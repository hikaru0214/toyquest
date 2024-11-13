<?php session_start(); ?>
<?php require 'db-connect.php';?>
<?php
unset($_SESSION['user']);
$sql=$pdo->prepare('select * from User where user_id = ?');
$sql->execute([$_POST['user_id']]);
foreach($sql as $row) {
    if(password_verify($_POST['password'],$row['password'])){
        $_SESSION['user']=[
            'user_id'=>$row['user_id'],
            'user_name'=>$row['user_name'],
            'mailaddress'=>$_POST['mailaddress'],
            'password'=>$row['password'],
            'set_filePath'=>$row['set_filePath'],
        ];
    }
}
if(isset($_SESSION['user'])){
header('Location:top.php');
exit();    
}else{
header('Location:login.php?hogeA=ログイン名またはパスワードが違います');
exit();
}
?>
