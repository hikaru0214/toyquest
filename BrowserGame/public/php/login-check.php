<?php 
session_start();
// DB接続
require '../dbConnect/dbconnect.php';

// エラーメッセージ配列
$err = [];

// 入力チェック
if (empty($_POST["mailaddress"])) {
    $err[] = 'メールアドレスが未入力です。';
}
if (empty($_POST["password"])) {
    $err[] = 'パスワードが未入力です。';
}

// エラーがなければログイン処理
if (count($err) == 0) {
    // メールアドレスが存在するか確認
    $sql = $pdo->prepare('SELECT * FROM User WHERE mailaddress = ?');
    $sql->execute([$_POST['mailaddress']]);
    $user = $sql->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        // メールアドレスは一致、パスワードを確認
        if ($user['password'] === $_POST['password']) {
            // ログイン成功
            $_SESSION['user'] = [
                'user_id' => $user['user_id'],
                'user_name' => $user['user_name'],
                'mailaddress' => $user['mailaddress']
            ];
            header('Location: top.php');
            exit;
        } else {
            // パスワードが一致しない
            $err[] = 'パスワードが一致しません。';
        }
    } else {
        // メールアドレスが一致しない
        $err[] = 'メールアドレスが一致しません。';
    }
}

// エラーがある場合は戻る
$_SESSION['err'] = $err;
header('Location: login.php');
exit;
?>
