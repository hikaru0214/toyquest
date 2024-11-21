<?php 
session_start();
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
</head>
<body>
    <h2>新規登録</h2>
    <form action="register.php" method="POST">

    <!-- エラーメッセージ表示 -->
    <?php if (!empty($err)): ?>
            <ul>
                <?php foreach ($err as $error): ?>
                    <li style="color: red;"><?php echo htmlspecialchars($error, ENT_QUOTES, 'UTF-8'); ?></li>
                <?php endforeach; ?>
            </ul>
    <?php endif; ?>
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
    <input type="hidden" name="csrf_token" value="<?php echo h(setToken()); ?>">
    <p>
        <input type="submit" value="新規登録">
    </p>
</body>
</html>