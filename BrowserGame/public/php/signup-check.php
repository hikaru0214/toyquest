<?php
session_start();

// トークン確認
if (!isset($_SESSION['access_token'])) {
    echo '<h1>エラー</h1>';
    echo '<p>このページは直接アクセスできません。</p>';
    echo '<a href="login.php">ログインページへ</a>';
    exit;
}

// セッションデータがない場合は入力画面にリダイレクト
if (!isset($_SESSION['username'], $_SESSION['mailaddress'], $_SESSION['password'])) {
    header('Location: signup.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>登録確認画面</title>
    <style>
            body {
            background-image:url(../img/login.jpg);
            background-size:cover;/*全画面*/
            background-attachment: fixed;         /* 固定 */
            background-position: center center;   /* 縦横中央 */
            display: flex;
            justify-content: center;
            align-items: center;
            /*min-height: 100vh;*/
            margin: 0;
        }
        .container {
            text-align: center;
            width: 46%;
        }
        h1 {
            position: relative;
            font-size: 40px;
            top:40px;
            margin-bottom: 40px;
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
        }
        .links a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>登録確認</h1>
        <form action="signup-ok.php" method="post">
            <div class="form-group">
                <label for="username">ユーザーネーム</label>
                <input type="text" name="username" value="<?php echo htmlspecialchars($_SESSION['username'], ENT_QUOTES, 'UTF-8'); ?>"readonly>
            </div>
            <div class="form-group">
                <label for="mailaddress">メールアドレス</label>
                <input type="mailaddress" name="mailaddress" value="<?php echo htmlspecialchars($_SESSION['mailaddress'], ENT_QUOTES, 'UTF-8'); ?>"readonly>
            </div>
            <div class="form-group">
                <label for="password">パスワード</label>
                <input type="password" name="password" value="<?php echo str_repeat('*', strlen($_SESSION['password']));  ?>"readonly>
            </div>
            <button type="submit" class="login-btn">登録</button>
        </form>
            <div class="links">
                <a href="signup.php" onclick="<?php $_SESSION['input'] = ['username' => $_SESSION['username'], 'mailaddress' => $_SESSION['mailaddress']]; ?>">戻る</a>
            </div>
    </div>
</body>
</html>
