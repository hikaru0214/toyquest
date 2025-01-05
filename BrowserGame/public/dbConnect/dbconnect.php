<?php
const SERVER = 'gamedb.cxsa4yusutqg.ap-northeast-1.rds.amazonaws.com';
const DBNAME = 'gamedatabase';
const USER = 'root';
const PASS = 'myrdspassword';
// const SERVER = 'mysql';
// const DBNAME = 'testdb';
// const USER = 'root';
// const PASS = 'rootpassword';


$connect = 'mysql:host=' . SERVER . ';dbname=' . DBNAME . ';charset=utf8';

try {
    $pdo = new PDO($connect, USER, PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die('データベース接続失敗: ' . $e->getMessage());
}
?>