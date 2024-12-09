<?php
session_start();

//トークン確認
if (!isset($_SESSION['access_token'])) {
    echo '<h1>エラー</h1>';
    echo '<p>このページは直接アクセスできません。</p>';
    echo '<a href="login.php">ログインページへ</a>';
    exit;
}
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>登録完了</title>
    <style>
        body {
            background-image:url(../img/login.jpg);
            background-size:cover;
            background-attachment: fixed;
            background-position: center center;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0;
        }
        .container {
            text-align: center;
            width: 46%;
            display: flex;
            flex-direction: column; /* 縦方向に配置 */
            align-items: center;    /* 中央揃え */
            margin-top: 150px;      /* 全体の位置調整 */
        }
        h1 {
            font-size: 30px;
        }
        .links {
            margin-top: 50px; /* 適用されるよう修正 */
            font-size: 24px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>ユーザー登録が完了しました。</hi>
    <div class="links">
        <a href="login.php">ログインページへ</a>
    </div>
</div>
</body>
</html>
