<?php session_start(); ?>
<!-- DB接続 -->
<?php require '../dbConnect/dbconnect.php'; ?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>パスワード設定完了</title>
    <style>
        body {
        background-image:url(../img/login.jpg);
        background-size:cover;/*全画面*/
        background-attachment: fixed;         /* 固定 */
        background-position: center center;   /* 縦横中央 */
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        }
        .container {
            text-align: center;
            width: 46%;
        }
        h1 {
            position: relative;
            font-size: 40px;
            top:70px;
            margin-bottom: 100px;
        }
        .form-group {
            margin-top: 30px;
            text-align: left;
            position: relative;
        }
        .form-group label {
            font-size: 20px;
            display: inline-block;
            /*margin-right: 10px;*/
        }
        .form-group input {
            width: 100%;
            height: 30px;
            font-size: 18px;
            padding: 15px;
            box-sizing: border-box;
        }
        .login-btn {
            display: block;
            width: 100%;
            height: 40px;
            margin-top: 50px;
            font-size: 16px;
            background-color: #000;
            color: #fff;
            border: none;
            cursor: pointer;
        }
        .links {
            margin-top: 18px;
            font-size: 18px;
            text-align: right;
        }
        .links a {
            text-decoration: none;
            color: #000;
            margin-left: 15px;
        }
        .links a:hover {
            text-decoration: underline;
        } 
        /* エラーメッセージ用のスタイル */
        .error {
            color: red; /* 赤色 */
            margin-top: 10px;
            text-align: center;
        }
        .message{
            color: green; /* 緑色 */
            margin-top: 10px;
            text-align: center;
        }
    </style>
</head>
<body>
<?php

$error_message = "";
$success_message = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // POSTデータを受け取る
    $mailaddress = $_POST['mailaddress'];
    $new_password = $_POST['new-password'];
    $confirm_password = $_POST['confirm-password'];



    // パスワード確認
    if (!preg_match('/^[a-zA-Z0-9]{4,8}$/', $new_password)) {
        $error_message = "パスワードは英数字で4文字以上8文字以下で入力してください。";
    } elseif ($new_password !== $confirm_password) {    
        $error_message = "新しいパスワードが一致しません。";
    } else {
        // メールアドレスが存在するか確認
        $stmt = $pdo->prepare("SELECT * FROM User WHERE mailaddress = :mailaddress");
        $stmt->bindParam(':mailaddress', $mailaddress, PDO::PARAM_STR);
        $stmt->execute();
        $user = $stmt->fetch();

        if ($user) {
            // パスワードをハッシュ化
            $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);

            // パスワードを更新
            $update_stmt = $pdo->prepare("UPDATE User SET password = :password WHERE mailaddress = :mailaddress");
            $update_stmt->bindParam(':password', $hashed_password, PDO::PARAM_STR);
            $update_stmt->bindParam(':mailaddress', $mailaddress, PDO::PARAM_STR);

            if ($update_stmt->execute()) {
                $success_message = "パスワードが正常に更新されました。";
            } else {
                $error_message = "パスワード更新中にエラーが発生しました。";
            }
        } else {
            $error_message = "このメールアドレスは登録されていません。";
        }
    }
}
?>

    <div class="container">
    <h1>パスワード再設定完了</h1>
    <?php if (!empty($success_message)): ?>
        <p class="message"><?php echo htmlspecialchars($success_message, ENT_QUOTES, 'UTF-8'); ?></p>
        <a href="login.php">ログイン画面へ</a>
    <?php else: ?>
        <p class="error"><?php echo htmlspecialchars($error_message, ENT_QUOTES, 'UTF-8'); ?></p>
        <div class="links">
            <a href="change_password.php">戻る</a>
        </div>
    <?php endif; ?>
    </div>

</body>
</html>