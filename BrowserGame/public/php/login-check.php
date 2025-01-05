<?php
session_start();
// Redisに保存するためのクラス
// $redis = new Redis();

// トークン確認
if (!isset($_SESSION['access_token'])) {
    echo '<h1>エラー</h1>';
    echo '<p>このページは直接アクセスできません。</p>';
    echo '<a href="login.php">ログインページへ</a>';
    exit;
}
// DB接続
require '../dbConnect/dbconnect.php';
// エラーメッセージ配列
$err = [];
// 入力内容保存用
$input = [
    'mailaddress' => $_POST['mailaddress'] ?? '',
];
// 入力チェック
if (empty($_POST['mailaddress'])) {
    $err[] = 'メールアドレスが未入力です。';
}else if (empty($_POST['password'])) {
    $err[] = 'パスワードが未入力です。';
}

// エラーがなければログイン処理
if (count($err) === 0) {
    // ユーザーを検索
    $stmt = $pdo->prepare('SELECT * FROM User WHERE LOWER(mailaddress) = LOWER(:mailaddress)');
    $stmt->bindValue(':mailaddress', strtolower($_POST['mailaddress']), PDO::PARAM_STR);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        // パスワードを確認
        if (password_verify($_POST['password'], $user['password'])) {
            // ログイン成功
            $_SESSION['user'] = [
                'user_id' => $user['user_id'],
                'user_name' => $user['user_name'],
                'mailaddress' => $user['mailaddress']
            ];
            // セッションIDを生成
            $sessionId = session_id();
            setcookie("userId", $_SESSION['user']['user_id'], time()+60*60*24, "/");
            setcookie("userName", $_SESSION['user']['user_name'], time()+60*60*24, "/");
            setcookie("mailaddress", $_SESSION['user']['mailaddress'], time()+60*60*24, "/");
            // Redisサーバーに接続
            // $redis->connect('127.0.0.1', 6379);
            // // データをセット
            // $redis->set($sessionId, json_encode($_SESSION['user']));
            header('Location: rogocontrol.php');
            exit;
        } else {
            $err[] = 'パスワードが一致しません。';
        }
    } else {
        $err[] = 'メールアドレスが一致しません。';
    }
}

// エラーがある場合は戻る
$_SESSION['err'] = $err;
$_SESSION['input'] = $input;
header('Location: login.php');
exit;
?>