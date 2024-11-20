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
        <label for="password_conf">確認用パスワード</label>
        <input type="password" name="password_conf">
    </p>
    <p>
        <input type="submit" value="新規登録">
    </p>
</body>
</html>