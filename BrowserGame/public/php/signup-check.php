<?php 
session_start();

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
</head>
<body>
    <div style="text-align: center">
        <form action="signup-ok.php" method="post">
            <h1>登録確認</h1>
            <hr>
            <dl>
                <dt>ユーザーネーム</dt>
                <dd><?php echo htmlspecialchars($_SESSION['username'], ENT_QUOTES, 'UTF-8'); ?></dd>
                <dt>メールアドレス</dt>
                <dd><?php echo htmlspecialchars($_SESSION['mailaddress'], ENT_QUOTES, 'UTF-8'); ?></dd>
                <dt>パスワード</dt>
                <dd><?php echo str_repeat('*', strlen($_SESSION['password'])); // 表示をマスク ?></dd>
            </dl>
            <p><button type="submit">登録</button></p>
        </form>
        <a href="signup.php">戻る</a>
    </div>
</body>
</html>
