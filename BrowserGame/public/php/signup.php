<?php session_start();?>
<!-- DB接続 -->
 <?php require '../dbConnect/dbconnect.php';?>

<!doctype html>
<html>
	<head>
			<meta charset="UTF-8">
			<title>新規登録</title>
	</head>
	<body>
		<h1>新規登録画面</h1>
		<form id="loginForm" name="loginForm" action="signup-process.php" method="POST">
			<fieldset>
				<legend>新規登録フォーム</legend>
				<label for="username">ユーザー名</label><input type="text" id="username" name="username" placeholder="ユーザー名を入力" value="<?php if (!empty($_POST["username"])) {echo htmlspecialchars($_POST["username"], ENT_QUOTES);} ?>">
				<br>
				<label for="password">メールアドレス</label><input type="mailaddress" id="mailaddress" name="mailaddress" value="" placeholder="メールアドレスを入力">
				<br>
				<label for="password2">パスワード</label><input type="password" id="password" name="password" value="" placeholder="パスワードを入力">
				<br>
				<input type="submit" id="signUp" name="signUp" value="新規登録">
			</fieldset>
		</form>
		<br>
		<form action="Login.php">
			<input type="submit" value="戻る">
		</form>
	</body>
</html>
