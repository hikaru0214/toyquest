
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
<?php
$redis = new Redis();
$redis->connect('127.0.0.1', 6379);

$redis->set('key', 'value');
echo $redis->get('key');
phpinfo();
?>
</body>
</html>