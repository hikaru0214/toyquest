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
        
    </style>
</head>
<body>


    
        <a href="login.html"><span class="back-arrow">&larr;</span></a>
        <div class="container">
            <h2>パスワード再設定</h2>
        </div>
        <form action="change_password_complete.html" method="post">
            <div class="form-group">
                <label for="email">メールアドレス</label>
                <input type="email" id="email" name="email" required>'
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
        <?php

// フォームが送信されたか確認
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // フォームからデータを取得
    $email = $_POST['email'];
    $new_password = $_POST['new-password'];
    $confirm_password = $_POST['confirm-password'];

    // 新しいパスワードと確認用パスワードが一致するか確認
    if ($new_password !== $confirm_password) {
        echo "新しいパスワードが一致しません。";
        exit;
    }

    // メールアドレスがデータベースに存在するか確認
    $mdb = $pdo->prepare("SELECT * FROM User WHERE mailaddress = :email");
    $mdb->bindParam(':email', $email, PDO::PARAM_STR);
    $mdb->execute();
    $user = $mdb->fetch();

    if ($user) {
        // 新しいパスワードをハッシュ化
        $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);

        // パスワードを更新
        $mdb = $pdo->prepare("UPDATE User SET password = :password WHERE email = :email");
        $mdb->bindParam(':password', $hashed_password, PDO::PARAM_STR);
        $mdb->bindParam(':email', $email, PDO::PARAM_STR);

        if ($mdb->execute()) {
            echo "パスワードが更新されました。";
            header("Location: change_password_complete.html"); // 完了ページへリダイレクト
            exit;
        } else {
            echo "パスワード更新中にエラーが発生しました。";
        }
    } else {
        echo "このメールアドレスは登録されていません。";
    }
} else {
    echo "無効なリクエストです。";
}
?>    
</body>
</html>