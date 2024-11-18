<?php session_start(); ?>
<?php require '../dbConnect/db-connect.php';?>
<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// $sql=$pdo->prepare('select * from User where mailaddress = ? AND password = ?');
// $sql->execute([$_POST['email'],$_POST['password']]);
// foreach($sql as $row) {
//     $_SESSION['user']=[
//         'user_id'=>$row['user_id'],
//         'user_name'=>$row['user_name'],
//         'mailaddress'=>$_POST['mailaddress'],
//         'password'=>$row['password']
//     ];
// }
// if(isset($_SESSION['user'])){
try{
header('Location: BrowserGame/public/php/top.php');
exit;
}catch(Exception e){
    var_dump($e->getMessage());
}
// }else{
// header('Location: BrowserGame/public/php/login.php?hogeA=ログイン名またはパスワードが違います');
// exit;
// }
?>