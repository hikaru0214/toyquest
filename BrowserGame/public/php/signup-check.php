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
    <?php
    echo '<dl>';
        echo '<dt>ユーザーネーム</dt>';
        echo '<dd>',$_POST['username'],'</dd>';
        echo '<dt>メールアドレス</dt>';
        echo '<dd>',$_POST['mailaddress'],'</dd>';
        echo '<dt>パスワード</dt>';
        echo '<dd>',$_POST['password'],'</dd>';
        echo '</dl>';
    ?>
    
    <p><button type="submit">登録</button></p>
</from>
<a href="signup.php">戻る</a>
</div>
</body>
</html>