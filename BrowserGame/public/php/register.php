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
}elseif (!filter_var($mailaddress, FILTER_VALIDATE_EMAIL)) {
    $err[] = '正しいメールアドレスを入力してください。';
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
    // 入力値をポストに保存
    $_POST['mailaddress'] = $mailaddress;
    $_POST['password'] = $password; // パスワードはハッシュ化する場合はここで対応
    $_POST['username'] = $username;

    // 確認ページにリダイレクト
    header('Location: signup-check.php');
    exit;
} else {
    // エラー情報をセッションに保存
    $_SESSION['err'] = $err;

    // 入力ページに戻る
    header('Location: signup.php');
    exit;
}
?>
?>