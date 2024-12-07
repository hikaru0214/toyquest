<?php 
session_start();

$_SESSION['access_token'] = bin2hex(random_bytes(32));

// エラー取得
$err = $_SESSION['err'] ?? [];
// 入力内容取得
$mailaddress=$_SESSION['input']['mailaddress'] ?? '';
// セッションのエラー情報と入力データをクリア
unset($_SESSION['err'],$_SESSION['input']);
?>

<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ログイン</title>
    <style>
       body {
        background-image:url(../img/login.jpg);
        background-size:cover;/*全画面*/
        background-attachment: fixed;         /* 固定 */
        background-position: center center;   /* 縦横中央 */
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        }
        .container {
            text-align: center;
            width: 46%;
        }
        h1 {
            position: relative;
            font-size: 40px;
            top:70px;
            margin-bottom: 100px;
        }
        .form-group {
            margin-top: 30px;
            text-align: left;
            position: relative;
        }
        .form-group label {
            font-size: 20px;
            display: inline-block;
            /*margin-right: 10px;*/
        }
        .form-group input {
            width: 100%;
            height: 30px;
            font-size: 18px;
            padding: 15px;
            box-sizing: border-box;
        }
        .login-btn {
            display: block;
            width: 100%;
            height: 40px;
            margin-top: 50px;
            font-size: 16px;
            background-color: #000;
            color: #fff;
            border: none;
            cursor: pointer;
        }
        .links {
            margin-top: 18px;
            font-size: 18px;
            text-align: right;
        }
        .links a {
            text-decoration: none;
            color: #000;
            margin-left: 15px;
        }
        .links a:hover {
            text-decoration: underline;
        } 
    </style>
</head>
<body>
    <div class="container">
        <h1>TOYQUEST</h1>
        <form action="login-check.php" method="POST">
            <!-- エラーメッセージ表示 -->
            <?php if (!empty($err)): ?>
                <ul>
                    <?php foreach ($err as $error): ?>
                        <li style="color: red;"><?php echo htmlspecialchars($error, ENT_QUOTES, 'UTF-8'); ?></li>
                    <?php endforeach; ?>
                </ul>
            <?php endif; ?>

            <div class="form-group">
                <label for="mailaddress">メールアドレス</label>
                <input type="email" name="mailaddress" value="<?php echo htmlspecialchars($mailaddress, ENT_QUOTES, 'UTF-8'); ?>">
            </div>
            <div class="form-group">
                <label for="password">パスワード</label>
                <input type="password" name="password">
            </div>
            <button type="submit" class="login-btn">ログイン</button>
        <div class="links">
            <a href="change_password.php">パスワードを忘れた方</a>
            <a href="signup.php">新規</a>
        </div>
    </div>
</body>
</html>
