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
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f9f9f9;
        }
        .container {
            width: 400px;
            padding: 20px;
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
            align-items: flex-start;
        }
        form p {
            margin: 10px 0;
        }
        label {
            font-size: 16px;
            margin-bottom: 5px;
        }
        input[type="email"],
        input[type="password"] {
            width: 100%;
            padding: 8px;
            font-size: 16px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        input[type="submit"] {
            width: 100%;
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
        <h2>toy</h2>
        <form action="login-check.php" method="POST">
            <!-- エラーメッセージ表示 -->
            <?php if (!empty($err)): ?>
                <ul>
                    <?php foreach ($err as $error): ?>
                        <li><?php echo htmlspecialchars($error, ENT_QUOTES, 'UTF-8'); ?></li>
                    <?php endforeach; ?>
                </ul>
            <?php endif; ?>

            <p>
                <label for="mailaddress">メールアドレス</label>
                <input type="email" name="mailaddress" required>
            </p>
            <p>
                <label for="password">パスワード</label>
                <input type="password" name="password" required>
            </p>
            <p>
                <input type="submit" value="ログイン">
            </p>
        </form>
        <div class="links">
            <a href="change_password.php">パスワードを忘れた方</a>
            <a href="signup.php">新規</a>
        </div>
    </div>
</body>
</html>
