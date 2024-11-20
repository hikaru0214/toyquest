<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>新規登録</title>
</head>
<body>
    <h2>新規登録</h2>
    <form action="register.php" method="POST">
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
    <a href="change_password.php"><button>パスワードを忘れた方</button></a>
    <br>
    <a href="signup.php"><button>新規</button></a>
</body>
</html>