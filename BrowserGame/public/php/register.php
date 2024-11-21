<?php 
session_start();

// DB接続
require '../dbConnect/dbconnect.php';

// エラーメッセージ
$err = [];

// POSTデータの取得
$mailaddress = $_POST['mailaddress'] ?? '';
$password = $_POST['password'] ?? '';
$username = $_POST['username'] ?? '';

// バリデーション
if (empty($username)) {
    $err[] = 'ユーザー名が未入力です。';
} elseif (strlen($username) > 30) {
    $err[] = 'ユーザー名は30文字以内で入力してください。';
} elseif (empty($mailaddress)) {
    $err[] = 'メールアドレスが未入力です。';
} elseif (empty($password)) {
    $err[] = 'パスワードが未入力です。';
} elseif (!preg_match('/^[a-zA-Z0-9]{4,7}$/', $password)) {
    $err[] = 'パスワードは英数字で4文字以上7文字以下で入力してください。';
} else {
    // メールアドレスの重複確認
    $stmt = $pdo->prepare("SELECT * FROM User WHERE mailaddress = :mailaddress");
    $stmt->bindValue(':mailaddress', $mailaddress, PDO::PARAM_STR);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        $err[] = 'このメールアドレスは既に登録されています。';
    }
}


// エラーがない場合
if (count($err) === 0) {
    if ($user && password_verify($password, $user['password'])) {
        // ログイン成功
        $_SESSION['user'] = [
            'username' => $user['username'],
            'mailaddress' => $user['mailaddress'],
            'mailaddress' => $user['mailaddress']
        ];
        header('Location: signup-check.php');
        exit;
    } else {
        $err[] = '認証情報が間違っています。';
    }
}

// エラーがある場合は戻る
$_SESSION['err'] = $err;
header('Location: signup.php');
exit;
?>
