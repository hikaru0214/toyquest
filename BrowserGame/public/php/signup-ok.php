<?php 
session_start();
require '../dbConnect/dbconnect.php';
// セッションデータがない場合は入力画面にリダイレクト
if (!isset($_SESSION['username'], $_SESSION['mailaddress'], $_SESSION['password'])) {
    header('Location: signup.php');
    exit;
}

try {
    // セッションから値を取得
    $username = $_SESSION['username'];
    $mailaddress = $_SESSION['mailaddress'];
    $password = $_SESSION['password'];

    // パスワードをハッシュ化
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // データベースに登録
    $stmt = $pdo->prepare("INSERT INTO User (user_name, mailaddress, password) VALUES (:user_name, :mailaddress, :password)");
    $stmt->bindValue(':user_name', $username, PDO::PARAM_STR);
    $stmt->bindValue(':mailaddress', $mailaddress, PDO::PARAM_STR);
    $stmt->bindValue(':password', $hashedPassword, PDO::PARAM_STR);
    $stmt->execute();

    // セッションのクリア
    session_unset();
    session_destroy();

    // 登録完了画面にリダイレクト
    header('Location: signup-complete.php');
    exit;

} catch (PDOException $e) {
    // エラー発生時はセッションをクリアせずエラーを表示
    $_SESSION['err'] = ['データベースエラー: ' . $e->getMessage()];
    header('Location: signup.php');
    exit;
}
?>
