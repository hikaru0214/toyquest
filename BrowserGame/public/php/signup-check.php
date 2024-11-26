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
    <link rel="stylesheet" href="css/signup-check.css">
    <title>登録確認画面</title>
    <style>
            body {
            background-image:url(../img/wanted_top.jpg);
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
        .form-group .toggle-password {
            font-size: 18px;
            cursor: pointer;
            color: #888;
            display: inline-block;
            vertical-align: middle;
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
    <script>
        function togglePasswordVisibility() {
            const passwordField = document.getElementById('password');
            const icon = document.getElementById('toggle-icon');
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                icon.textContent = '🙈'; // アイコン変更（目を隠す）
            } else {
                passwordField.type = 'password';
                icon.textContent = '👁️'; // アイコン変更（目を開ける）
            }
        }
    </script>
</head>
<body>
    <div class="container">
        <form action="signup-ok.php" method="post">
            <h1>登録確認</h1>
            <div class="form-group">
                <label for="username">ユーザーネーム</label>
                <div>
                    <?php <input type="text" echo htmlspecialchars($_SESSION['username'], ENT_QUOTES, 'UTF-8'); ?>
                </div>
            </div>
            <div class="form-group">
                <label for="mailaddress">メールアドレス</label>
                <div>
                    <?php echo htmlspecialchars($_SESSION['mailaddress'], ENT_QUOTES, 'UTF-8'); ?>
                </div>
            </div>
            <div class="form-group">
                <label for="password">パスワード</label>
                <div>
                    <?php echo str_repeat('*', strlen($_SESSION['password'])); // 表示をマスク ?>
                </div>
            </div>
            <button type="submit" class="login-btn">確認へ</button>
        </form>
        <div class="links">
            <a href="">戻る</a>
        </div>
    </div>
</body>
</html>
