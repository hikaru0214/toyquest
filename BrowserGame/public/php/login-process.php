<?php session_start(); ?>
<?php require '../dbConnect/dbconnect.php';?>
<?php
$sql=$pdo->prepare('select * from User where mailaddress = ? AND password = ?');
$sql->execute([$_POST['email'],$_POST['password']]);
foreach($sql as $row) {
    $_SESSION['user']=[
        'user_id'=>$row['user_id'],
        'user_name'=>$row['user_name'],
        'mailaddress'=>$_POST['mailaddress'],
        'password'=>$row['password']
    ];
}
if(isset($_SESSION['user'])){
// try{
header('Location: top.php');
session_destroy();
exit;
// }catch(Exception $e){
//    var_dump($e->getMessage());
// }
}else{
header('Location: login.php?hogeA=ログイン名またはパスワードが違います');
exit;
}
?>