<?php
session_start();

// トークン確認
if (!isset($_SESSION['access_token'])) {
    echo '<h1>エラー</h1>';
    echo '<p>このページは直接アクセスできません。</p>';
    echo '<a href="login.php">ログインページへ</a>';
    exit;
}

// エラー取得
$err = $_SESSION['err'] ?? [];
// セッションのエラー情報をクリア
unset($_SESSION['err']);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>新規登録</title>
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
    <h1>新規登録</h1>
    <form action="register.php" method="POST">

    <!-- エラーメッセージ表示 -->
    <?php if (!empty($err)): ?>
            <ul>
                <?php foreach ($err as $error): ?>
                    <li style="color: red;"><?php echo htmlspecialchars($error, ENT_QUOTES, 'UTF-8'); ?></li>
                <?php endforeach; ?>
            </ul>
    <?php endif; ?>
    <div class="form-group">
                <label for="username">ユーザーネーム</label>
                <input type="text" name="username" value="<?php echo htmlspecialchars($username, ENT_QUOTES, 'UTF-8'); ?>">
            </div>
            <div class="form-group">
                <label for="mailaddress">メールアドレス</label>
                <input type="email" name="mailaddress" value="<?php echo htmlspecialchars($mailaddress, ENT_QUOTES, 'UTF-8'); ?>">
            </div>
            <div class="form-group">
                <label for="password">パスワード</label>
                <input type="password" id="password" name="password">
            </div>
            <div class="form-group">
                <label for="password_check">確認用パスワード</label>
                <input type="password" id="password_check" name="password_check">
            </div>
            <button type="submit" class="login-btn">確認へ</button>
        </form>
        <div class="links">
            <a href="login.php">戻る</a>
        </div>
    </div>
</body>
</html>