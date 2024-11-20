<?php 
session_start();
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
    <title>新規登録</title>
</head>
<body>
    <h2>新規登録</h2>
    <form action="login-check.php" method="POST">
        <!-- エラーメッセージ表示 -->
        <?php if (!empty($err)): ?>
            <ul>
                <?php foreach ($err as $error): ?>
                    <li style="color: red;"><?php echo htmlspecialchars($error, ENT_QUOTES, 'UTF-8'); ?></li>
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
    <br>
    <a href="change_password.php">パスワードを忘れた方</a>
    <br>
    <a href="signup.php">新規</a>
</body>
</html>
