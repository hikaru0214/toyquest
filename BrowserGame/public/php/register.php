<?php 
session_start();

// DB接続
require '../dbConnect/dbconnect.php';

// エラーメッセージ
$err = [];

if (empty($_POST["mailaddress"])) {
    $err[] = 'メールアドレスが未入力です。';
}
if (empty($_POST["password"])) {
    $err[] = 'パスワードが未入力です。';
}
if (!preg_match('/^[a-zA-Z0-9]{8,100}$/', $password)) {
    $err = 'パスワードは英数字で8文字以上100文字以下で入力してください。';
}

$stmt = $pdo->prepare("SELECT COUNT(*) FROM User WHERE mailaddress = :mailaddress");
$stmt->bindValue(':email', $mailaddress, PDO::PARAM_STR);
$stmt->execute();
$count = $stmt->fetchColumn();

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