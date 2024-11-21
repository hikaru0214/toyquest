<?php
session_start();
?>


<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
       
       .withbutton {
            display: flex;
            justify-content: center;
            margin-top: 20px;
        }
    </style>
    <title>ログアウト画面</title>
</head>
<body>
    <div class="Header">
    <a style="left: 0;top: 0;position: absolute;" onclick="history.back()"><i class="fas fa-angle-left fa-2x"></i></a>
        SWEETSTOWN
    </div>
    <br>
    <br>
    <div class="withdrawal">
        <h1>●ログアウト手続き</h1>
        <hr noshade><br>
        <p class="withp">「ログアウトする」ボタンを押すと<br>
            ログアウトが完了いたします。<br>
            本当にログアウトしてもよろしいですか？</p>
        
        
            <div class="withbutton">
                <form action="top.php" method="post">
                <input type="submit" name="cancel" value="キャンセル" style="width:100px;height:50px">
                </form>
                <form action="logout-ok.php" method="post">
                <input type="submit" name="withdraw" value="ログアウトする" style="width:100px;height:50px" class="with">
                </form>
            </div>
    </div>
</body>
</html>
