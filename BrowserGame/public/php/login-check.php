<?php session_start();?>
<!-- DB接続 -->
 <?php require '../dbConnect/dbconnect.php';?>
 
<?php

// エラーメッセージ
$err = [];

$sql=$pdo->prepare('select * from User where mailaddress = ? AND password = ?');
$sql->execute([$_POST['mailaddress'],$_POST['password']]);
foreach($sql as $row) {
    $_SESSION['user']=[
        'user_id'=>$row['user_id'],
        'user_name'=>$row['user_name'],
        'mailaddress'=>$_POST['mailaddress'],
        'password'=>$row['password']
    ];
}

// ログインボタンが押された場合
if (isset($_POST["signUp"])) {
	// 1. ユーザIDの入力チェック
	if (empty($_POST["mailaddress"])) {  // 値が空のとき
		$err[] = 'メールアドレスが未入力です。';
	} else if (empty($_POST["password"])) {
		$err[] = 'パスワードが未入力です。';
    }
}

if(count($err) == 0){
    header('Location:top.php');
    exit;
}else{
    $_SESSION = $err;
    header('Location: login2.php');
    return;
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
    <form action="login-check.php" method="POST">
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