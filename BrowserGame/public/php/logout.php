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
    <p style="font-size: 28px;">現在のアカウントからログアウトしますか？</p>
    <div class="buttons">
        <input type="button"  onclick="history.back()" value="いいえ" style="width:100px; height:40px; margin-right: 50px; font-size:20px;">
        <input type="button"  onclick="location.href='./logout-complete.php'" value="はい"style="width:100px; height:40px; font-size:20px;">
    </div>
</div>

</body>
</html>
