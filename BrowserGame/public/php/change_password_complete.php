<?php session_start(); ?>
<!-- DB接続 -->
<?php require '../dbConnect/dbconnect.php'; ?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>パスワード設定完了</title>
    <style>
        body {
            margin-top: 50px;
        }

        .container {
            text-align: center;
        }
        .container h2 {
            margin-bottom: 20px;
        }
        .container a {
            color: blue;
            font-weight: bold;
        }
        .container a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
<?php

$error_message = "";
$success_message = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // POSTデータを受け取る
    $mailaddress = $_POST['mailaddress'];
    $new_password = $_POST['new-password'];
    $confirm_password = $_POST['confirm-password'];

    // パスワード確認
    if ($new_password !== $confirm_password) {
        $error_message = "新しいパスワードが一致しません。";
    } else {
        // メールアドレスが存在するか確認
        $stmt = $pdo->prepare("SELECT * FROM User WHERE mailaddress = :mailaddress");
        $stmt->bindParam(':mailaddress', $mailaddress, PDO::PARAM_STR);
        $stmt->execute();
        $user = $stmt->fetch();

        if ($user) {
            // パスワードをハッシュ化
            $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);

            // パスワードを更新
            $update_stmt = $pdo->prepare("UPDATE User SET password = :password WHERE mailaddress = :mailaddress");
            $update_stmt->bindParam(':password', $hashed_password, PDO::PARAM_STR);
            $update_stmt->bindParam(':mailaddress', $mailaddress, PDO::PARAM_STR);

            if ($update_stmt->execute()) {
                $success_message = "パスワードが正常に更新されました。";
            } else {
                $error_message = "パスワード更新中にエラーが発生しました。";
            }
        } else {
            $error_message = "このメールアドレスは登録されていません。";
        }
    }
}
?>

    <div class="container">
    <h2>パスワード再設定完了</h2>
    <?php if (!empty($success_message)): ?>
        <p class="message"><?php echo htmlspecialchars($success_message, ENT_QUOTES, 'UTF-8'); ?></p>
        <a href="login.php">ログイン画面へ</a>
    <?php else: ?>
        <p class="error"><?php echo htmlspecialchars($error_message, ENT_QUOTES, 'UTF-8'); ?></p>
        <a href="change_password.php">戻る</a>
    <?php endif; ?>
    </div>

</body>
</html>