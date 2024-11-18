<?php session_start(); ?>
<?php require '../dbConnect/db-connect.php';?>
<?php
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
header('Location: BrowserGame/public/php/top.php');
exit;
// }else{
// header('Location: BrowserGame/public/php/login.php?hogeA=ログイン名またはパスワードが違います');
// exit;
// }
?>