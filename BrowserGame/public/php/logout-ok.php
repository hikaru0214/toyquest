<?php
session_start();
if (isset($_SESSION['User'])) {
    unset($_SESSION['User']);
}

session_destroy(); 
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="CSS/header.css">
    <link rel="stylesheet" href="CSS/withdrawal-ok.css">
    <title>ログアウト完了画面</title>
</head>
<body>
    <div class="Header">
        SWEETSTOWN
    </div>
    
    <?php unset($_SESSION['User']);?>
    <div class="withdrawal-ok">
        <p>ログアウトが完了しました。</p>
        <a href= "login.php" >ログイン画面へ</a>
    </div>
</body>
</html>