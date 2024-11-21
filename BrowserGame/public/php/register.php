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
if (empty($mailaddress)) {
    $err[] = 'メールアドレスが未入力です。';
}
if (empty($password)) {
    $err[] = 'パスワードが未入力です。';
}
if (!preg_match('/^[a-zA-Z0-9]{8,100}$/', $password)) {
    $err[] = 'パスワードは英数字で8文字以上100文字以下で入力してください。';
}

// メールアドレスの重複確認
$stmt = $pdo->prepare("SELECT * FROM User WHERE mailaddress = :mailaddress");
$stmt->bindValue(':mailaddress', $mailaddress, PDO::PARAM_STR);
$stmt->execute();
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    $err[] = 'このメールアドレスは既に登録されています。';
}

// エラーがない場合
if (count($err) === 0) {
    if ($user && password_verify($password, $user['password'])) {
        // ログイン成功
        $_SESSION['user'] = [
            'username' => $user['username'],
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
