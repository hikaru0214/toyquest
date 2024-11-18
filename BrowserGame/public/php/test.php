<?php require '../dbConnect/dbconnect.php'; ?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <?php 
        $stmt = $pdo->query('select * from User')->fetchAll();
        foreach ($stmt as $row) {
            echo $row['user_id'] . '<br>';
        }
        phpinfo();
    ?>
</body>
</html>