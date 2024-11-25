<?php
session_start();
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// セッションデータをクリア
$_SESSION = array();

// セッションID削除（Cookieの削除）
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// セッション破棄
session_destroy();
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ログアウト完了</title>
    <style>
        body {
            display: flex;
            justify-content: center;
        }
        .container {
            margin-top:10%;
            text-align: center;
        }
        .buttons {
            margin-top: 50px;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
<div class="container">
    <p style="font-size: 28px;">ログアウトが完了しました</p>
    <div class="buttons">
        <input type="button" onclick="location.href='./login.php'" value="ログイン画面へ" style="width:100px; height:40px; font-size:12px;">
    </div>
</div>

</body>
</html>
