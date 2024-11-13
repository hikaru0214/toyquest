<?php session_start(); ?>
<!doctype html>
<html lang="ja" data-bs-theme="auto">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ログイン</title>

    <!-- DB接続 -->
    <?php require 'db-connect.php'; ?>

    <style>
    .wrapper{
        height:100vh;
        width:100vw;
        display: flex;
        justify-content:center;
        align-items:center;
    }
    </style>

</head>
<body>
<!----------------------------------------------------ここから-------------------------------------------------------------------->
    <?php unset($_SESSION['user']); ?>
    <div class="wrapper">
        <form action="login-process.php" method="post" class="d-flex flex-column" style="height:50vh;width:50vw;min-width:240px;">
            <h1 class="mb-0">トイクエスト</h1>

            <!-- ログインしていない場合 -->
            <div class="flex-grow-1 align-content-center">
            <?php
            if(isset($_GET['hogeB'])){
                echo '<p class="text-danger mb-0">',$_GET['hogeB'],'</p>';
            }else{
                echo '<p class="text-danger mb-0"><br></p>';
            }
            ?>
            </div>
            <div class="flex-grow-1 align-content-center">
                <label for="mailaddress" class="form-label">メールアドレス</label>
                <input type="text" class="form-control" id="mailaddress" name="mailaddress" required>
            </div>
            <div class="flex-grow-1 align-content-center">
                <label for="password" class="form-label">パスワード</label>
                <input type="password" class="form-control" id="password" name="password" required>
            </div>
            
            <!-- ログイン処理に失敗した場合 -->
            <div class="flex-grow-1 align-content-center">
            <?php
            if(isset($_GET['hogeA'])){
                echo '<p class="text-danger mb-0">',$_GET['hogeA'],'</p>';
            }else{
                echo '<p class="text-danger mb-0"><br></p>';
            }
            ?>
            </div>
            <div class="flex-grow-1 align-content-center">
                <button type="submit" class="btn btn-primary" style="width:100%;height:2.5rem;">ログイン</button>
            </div>
        </form>
    </div>
<!----------------------------------------------------ここまで-------------------------------------------------------------------->

    <!-- DB切断 -->
    <?php $pdo = null;?>

</body>
</html>