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
    // メールアドレスとパスワードを照合
    $sql = $pdo->prepare('SELECT * FROM User WHERE mailaddress = ? AND password = ?');
    $sql->execute([$_POST['mailaddress'], $_POST['password']]);
    $user = $sql->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        // ログイン成功
        $_SESSION['user'] = [
            'user_id' => $user['user_id'],
            'user_name' => $user['user_name'],
            'mailaddress' => $user['mailaddress'],
            'password' => $user['password']
        ];
        header('Location: top.php');
        exit;
    } else {
        // 一致しない場合
        $err[] = 'メールアドレスまたはパスワードが一致しません。';
    }
}

// エラーがある場合は戻る
$_SESSION['err'] = $err;
header('Location: login2.php');
exit;
?>
