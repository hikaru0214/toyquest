<?php session_start();?>
<!-- DB接続 -->
 <?php require '../dbConnect/dbconnect.php';?>

// <?php
// データベース接続情報
//$dsn = 'mysql:host=localhost;dbname=your_database;charset=utf8';
//$username = 'your_username';
//$password = 'your_password';

//try {
    // PDOオブジェクトの作成
    //$pdo = new PDO($dsn, $username, $password);
    //$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
//} catch (PDOException $e) {
   // die("データベース接続失敗: " . $e->getMessage());
//}
?>
 
<?php

// エラーメッセージ
$err = "";


// ログインボタンが押された場合
if (isset($_POST["signUp"])) {
	// 1. ユーザIDの入力チェック
	if (empty($_POST["username"])) {  // 値が空のとき
		$err = 'ユーザー名が未入力です。';
	} else if (empty($_POST["mailaddress"])) {
		$err = 'メールアドレスが未入力です。';
	} else if (empty($_POST["password"])) {
		$err = 'パスワードが未入力です。';
    }else if (!preg_match('/^[a-zA-Z0-9]{8,100}$/', $password)) {
        $err = 'パスワードは英数字で8文字以上100文字以下で入力してください。';
	}else{
        $mailaddress = $_POST["mailaddress"];
    }

    //$stmt = $pdo->prepare("SELECT COUNT(*) FROM User WHERE mailaddress = :mailaddress");
        //$stmt->bindValue(':email', $mailaddress, PDO::PARAM_STR);
        //$stmt->execute();
        //$count = $stmt->fetchColumn();


    // メールアドレスが登録済みかどうかの判定
    if ($count > 0) {
        $err = 'このメールアドレスは既に登録されています。';
    }

	if (!empty($_POST["username"]) && !empty($_POST["mailaddress"]) && !empty($_POST["password"])) {
		// 入力したユーザIDとパスワードを格納
		$username = $_POST["username"];
		$password = $_POST["mailaddress"];
		$password = $_POST["password"];

		// 2. ユーザIDとパスワードが入力されていたら認証する
		$dsn = sprintf('mysql: host=%s; dbname=%s; charset=utf8', $db['host'], $db['dbname']);

		// 3. エラー処理
		try {
			$pdo = new PDO($dsn, $db['user'], $db['pass'], array(PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION));

			$stmt = $pdo->prepare("INSERT INTO userData(name, password) VALUES (?, ?)");

			$stmt->execute(array($username, password_hash($password, PASSWORD_DEFAULT)));  // パスワードのハッシュ化を行う（今回は文字列のみなのでbindValue(変数の内容が変わらない)を使用せず、直接excuteに渡しても問題ない）
			$userid = $pdo->lastinsertid();  // 登録した(DB側でauto_incrementした)IDを$useridに入れる

			$signUpMessage = '登録が完了しました。あなたの登録IDは '. $userid. ' です。パスワードは '. $password. ' です。';  // ログイン時に使用するIDとパスワード
		} catch (PDOException $e) {
			$errorMessage = 'データベースエラー';
			// $e->getMessage() でエラー内容を参照可能（デバッグ時のみ表示）
			// echo $e->getMessage();
		}
	} 
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>新規登録</title>
</head>
<body>
    <h2>新規登録</h2>

    <div><font color="#ff0000"><?php echo htmlspecialchars($errorMessage, ENT_QUOTES); ?></font></div>

    <form action="register.php" method="POST">
    <p>
        <label for="username">ユーザー名</label>
        <input type="text" name="username">
    </p>
    <p>
        <label for="mailaddress">メールアドレス</label>
        <input type="email" name="mailaddress">
    </p>
    <p>
        <label for="password">パスワード</label>
        <input type="password" name="password">
    </p>
    <p>
        <input type="submit" value="新規登録">
    </p>
</body>
</html>