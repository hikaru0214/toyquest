<?php
const SERVER = 'gamedb.cxsa4yusutqg.ap-northeast-1.rds.amazonaws.com';
const DBNAME = 'gamedatabase';
const USER = 'root';
const PASS = 'myrdspassword';

$connect = 'mysql:host=' . SERVER . ';dbname=' . DBNAME . ';charset=utf8';

try {
    $pdo = new PDO($connect, USER, PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $query = $pdo->query("select * from User");
    $select = $query->fetchAll();
    var_dump($select);
} catch (PDOException $e) {
    die('データベース接続失敗: ' . $e->getMessage());
}
?>