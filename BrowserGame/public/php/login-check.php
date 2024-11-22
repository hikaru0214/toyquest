<?php
session_start();

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

// 入力チェック
if (empty($_POST['mailaddress'])) {
    $err[] = 'メールアドレスが未入力です。';
}
if (empty($_POST['password'])) {
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
            header('Location: top.php');
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
header('Location: login.php');
exit;
?>
