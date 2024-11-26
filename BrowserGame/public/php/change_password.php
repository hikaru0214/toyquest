<?php session_start(); ?>
<!-- DB接続 -->
<?php require '../dbConnect/dbconnect.php'; ?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>パスワード再設定</title>
    <style>
        .container{
            text-align: center;
        }
        .form-group {
            margin-bottom: 15px;
            text-align: center;
        }
        .form-group label {
            display: block;
            margin-bottom: 5px;
            text-align: center;
        }
        .form-group input {
            width: 80%;
            padding: 8px;
            box-sizing: border-box;
        }
        .back-arrow {
            display: inline-block;
            cursor: pointer;
            font-size: 24px;
            margin-bottom: 20px;
        }
        .submit-btn {
            display: block;
            width: 80%;
            padding: 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            cursor: pointer;
            margin: 0 auto;
        }
        .submit-btn:hover {
            background-color: #45a049;
            
        }
        
        /* エラーメッセージ用のスタイル */
        .error {
            color: red; /* 赤色 */
            margin-top: 10px;
            text-align: center;
        }
    </style>
</head>
<body>
<?php

$error_message = ""; // エラーメッセージの初期化


// フォームが送信されたか確認
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // フォームからデータを取得
    $mailaddress = $_POST['mailaddress'];
    $new_password = $_POST['new-password'];
    $confirm_password = $_POST['confirm-password'];

    // 新しいパスワードと確認用パスワードが一致するか確認
    if ($new_password !== $confirm_password) {
        $error_message = "新しいパスワードが一致しません。";
        exit;
    }

    // メールアドレスがデータベースに存在するか確認
    $stmt = $pdo->prepare("SELECT * FROM User WHERE mailaddress = :mailaddress");
    $stmt->bindParam(':mailaddress', $mailaddress, PDO::PARAM_STR);
    $stmt->execute();
    $user = $stmt->fetch();

    if ($user) {
        // 新しいパスワードをハッシュ化
        $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);

        // パスワードを更新
        $stmt = $pdo->prepare("UPDATE User SET password = :password WHERE mailaddress = :mailaddress");
        $stmt->bindParam(':password', $hashed_password, PDO::PARAM_STR);
        $stmt->bindParam(':mailaddress', $mailaddress, PDO::PARAM_STR);

        if ($stmt->execute()) {
            $error_message = "パスワードが更新されました。";
            header("Location: change_password_complete.html"); // 完了ページへリダイレクト
            exit;
        } else {
            $error_message = "パスワード更新中にエラーが発生しました。";
        }
    } else {
        $error_message = "このメールアドレスは登録されていません。";
    }
} 
?>

    
        <a href="login.php"><span class="back-arrow">&larr;</span></a>
        <div class="container">
            <h2>パスワード再設定</h2>
        </div>
        <form action="" method="post">
            <div class="form-group">
                <label for="mailaddress">メールアドレス</label>
                <input type="email" id="mailaddress" name="mailaddress" required>'
            </div>
            <div class="form-group">
                <label for="new-password">新しいパスワード</label>
                <input type="password" id="new-password" name="new-password" required>
            </div>
            <div class="form-group">
                <label for="confirm-password">パスワード (確認用)</label>
                <input type="password" id="confirm-password" name="confirm-password" required>
            </div>
            <button type="submit" class="submit-btn">登録</button>
        </form>  
        <!-- エラーメッセージ表示 -->
    <?php if (!empty($error_message)): ?>
        <p class="error"><?php echo htmlspecialchars($error_message, ENT_QUOTES, 'UTF-8'); ?></p>
    <?php endif; ?>
</body>
</html>