<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>パスワード再設定</title>
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
    </style>
</head>
<body>      
        <a href="login.php"><span class="back-arrow">&larr;</span></a>
        <div class="container">
            <h1>パスワード再設定</h1>
        </div>
        <form action="change_password_complete.php" method="post">
            <div class="form-group">
                <label for="mailaddress">メールアドレス</label>
                <input type="email" id="mailaddress" name="mailaddress" required>
            </div>
            <div class="form-group">
                <label for="new-password">新しいパスワード</label>
                <input type="password" id="new-password" name="new-password" required>
            </div>
            <div class="form-group">
                <label for="confirm-password">パスワード (確認用)</label>
                <input type="password" id="confirm-password" name="confirm-password" required>
            </div>
            <button type="submit" class="login-btn">登録</button>
            <div class="links">
            <a href="login.php">戻る</a>
        </div>
        </form>  
        
    
</body>
</html>
<script>
document.querySelector('form').addEventListener('submit', function(e) {
    const password = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // 英数字8文字以上のチェック
    if (!/^[a-zA-Z0-9]{4,8}$/.test(password)) {
        alert("パスワードは英数字4文字以上8文字以下で入力してください。");
        e.preventDefault(); // フォーム送信をキャンセル
        return;
    }

    // パスワードの一致確認
    if (password !== confirmPassword) {
        alert("新しいパスワードが一致しません。");
        e.preventDefault(); // フォーム送信をキャンセル
        return;
    }
});
</script>