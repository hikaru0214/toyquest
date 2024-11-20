<?php

//エラーメッセージ
$err = [];

//バリデーション
//ユーザーネーム
if(!$username = filter_input(INPUT_POST,'username')){
    $err[] = 'ユーザー名を入力してください';
}

//メールアドレス
if(!$mailaddress = filter_input(INPUT_POST,'mailaddress')) {
    $err[] = 'メースアドレスを入力してください';
}

//パスワード
if(!preg_match("/\A[a-z\d]{8,100}+z/i", $password)) {
    $err[] = 'パスワードは英数字8文字以上100文字以下で入力してください';
}

//確認用パスワード
$password_conf = filter_input(INPUT_POST,'password_conf');
if($password !== $password_conf){
    $err[] = '確認用パスワードと異なっています';
}

if(count($err) === 0){
    //登録処理
}

<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>登録確認</title>
</head>
<body>
<?php if(count($err) > 0):?>
<?php foreach($err as $e) :?>
    

    <P>ユーザー登録が完了しました</p>
    <a href="./login.php">ログイン画面へ</a>
</body>
</html>