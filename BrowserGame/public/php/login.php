<?php 
session_start();

$_SESSION['access_token'] = bin2hex(random_bytes(32));

// エラー取得
$err = $_SESSION['err'] ?? [];
// セッションのエラー情報をクリア
unset($_SESSION['err']);
?>

<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ログイン</title>
    <style>
        body {
            background-image:url(../img/wanted_top.jpg);
            background-size:cover;/*全画面*/
            background-attachment: fixed;         /* 固定 */
            background-position: center center;   /* 縦横中央 */
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .container {
            width: 60%;
            padding: 3s0px;
            border: 1px solid #000;
            background-color: #fff;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            text-align: center;
        }
        h2 {
            font-size: 24px;
            margin-bottom: 20px;
        }
        form {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .form-group {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            width: 200%;
            margin-bottom: 15px;
        }
        label {
            font-size: 16px;
            width: 100px;
            text-align: right;
            margin-right: 10px;
        }
        input[type="email"],
        input[type="password"] {
            flex: 1;
            padding: 8px;
            font-size: 16px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        input[type="submit"] {
            width: 60%;
            padding: 10px;
            font-size: 16px;
            color: #fff;
            background-color: #007BFF;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 10px;
        }
        input[type="submit"]:hover {
            background-color: #0056b3;
        }
        .links {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
            font-size: 14px;
        }
        .links a {
            text-decoration: none;
            color: #007BFF;
        }
        .links a:hover {
            text-decoration: underline;
        }
        ul {
            list-style: none;
            padding: 0;
            color: red;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>ログイン</h2>
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
                <input type="email" name="mailaddress" required>
            </div>
            <div class="form-group">
                <label for="password">パスワード</label>
                <input type="password" name="password" required>
            </div>
            <input type="submit" value="ログイン">
        </form>
        <div class="links">
            <a href="change_password.php">パスワードを忘れた方</a>
            <a href="signup.php">新規</a>
        </div>
    </div>
</body>
</html>
