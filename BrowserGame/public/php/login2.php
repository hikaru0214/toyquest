<?php session_start(); ?>
<!-- DB接続 -->
<?php require '../dbConnect/dbconnect.php'; ?>



<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>新規登録</title>
</head>
<body>
    <h2>新規登録</h2>
    <form action="login-check.php" method="POST">
	<div><font color="#ff0000"><?php echo htmlspecialchars($error, ENT_QUOTES); ?></font></div>
    <p>
        <label for="mailaddress">メールアドレス</label>
        <input type="email" name="mailaddress">
    </p>
    <p>
        <label for="password">パスワード</label>
        <input type="password" name="password">
    </p>
    <p>
        <input type="submit" value="ログイン">
    </p>
	</form>
	<br>
    <a href="change_password.php">パスワードを忘れた方</a>
    <br>
    <a href="signup.php">新規</a>
</body>
</html>