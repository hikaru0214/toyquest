<?php session_start(); ?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>チャリ走</title>
    <style>
        body {
            background-image:url(../img/chariso.jpg);
            background-size:cover;/*全画面*/
            background-attachment: fixed;         /* 固定 */
            background-position: center center;   /* 縦横中央 */
            /*text-align: center;*/
            display: flex;
            flex-direction: column;
            /*justify-content: center;*/
            align-items: center;
        }
        .top,.how{
            position: absolute;
            top: 10px;
            font-size: 25px;
        }
        .top a,.how a{
            color:black;
            text-decoration: none;
        }
        .top {
            left: 15px;
        }
        .how {
            right:15px;
        }
        h1 {
            text-align: center;
            font-size: 60px;
            top: 85px;

        }
        .buttons {
            text-align: center;
            display: flex;
            justify-content: space-around;
            width: 80%;
            top: 350px;
            position: relative;
        }
        .button{
            top: 640px;
            padding: 8px;
            background-color: #FFFFFF;
            border: 2px solid #000;
            font-size: 25px;
            width: 280px;
            margin-bottom: 5px;
        }
    </style>
</head>
<body>
    <div class="top">
        <a onclick="history.back()">TOP</a>
    </div>
    <div class="how">
        <a href="top.html">HOW TO PLAY</a>
    </div>
    
    <h1>チャリ走</h1>
    <?php 
    // $redis = new Redis();
    // echo $redis->get(session_id());
    ?>
    <div class="buttons">
        <div class="button">
            <form action="http://52.68.111.88/game/single" method="post">
                <input type="hidden" name="userInfo" value="">
                <button type="submit">1PLAYER</button>
            </form>
        </div>
        <div class="button">MULTI BATTLE</div>
        <div class="button">
            <form action="http://52.68.111.88/game/createRoom" method="post">
                <input type="hidden" name="userInfo" value="<?= session_id() ?>">
                <button type="submit">CREATE ROOM</button>
            </form>
        </div>
    </div>
</body>
</html>
