<?php
session_start();
?>

<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ログアウト</title>
    <style>
    body {
            background-image:url(../img/wanted_top.jpg);
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
            font-size: 26px;
        }
        .links a {
            text-decoration: none;
            color: #000;
            margin-left: 15px;
        }
        .links a:hover {
            text-decoration: underline;
        } 
    </style>
</head>
<body>

<div class="container">
    <h1>現在のアカウントからログアウトしますか？</h1>
    <div class="links">
        <a href="top.php" style="margin-right: 50px;">いいえ</a>
        <a href="logout-complete.php" style="color:red;">はい</a>
    </div>
</div>

</body>
</html>
