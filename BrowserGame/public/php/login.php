<?php session_start(); ?>
<!doctype html>
<html lang="ja" data-bs-theme="auto">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ログイン</title>
    <!-- DB接続 -->
    <?php require 'dbconnect.php'; ?>

    <style>
    .wrapper{
        height:100vh;
        width:100vw;
        display: flex;
        justify-content:center;
        align-items:center;
    }
    </style>

</head>
<body>
<canvas id="canvas" style="position: absolute;"></canvas>

<div style="width: 50vw; height: 50vh; margin-left: auto; margin-right: auto; text-align: center; font-size: large; position: relative;">

    <form action="/login-process.php" method="post">
        メールアドレス <input id="email" name="email" type="text" style="margin-top: 50vh;">
        <br>
        パスワード <input id="password" name="password" type="text">
        <br>
        <button type="submit">ログイン</button>
    </form>
    <br>
    <a href="change_password.html"><button>パスワードを忘れた方</button></a>
    <br>
    <a href="signup.html"><button>新規</button></a>
</div>
    <!-- DB切断 -->
    <?php $pdo = null;?>
</body>
</html>