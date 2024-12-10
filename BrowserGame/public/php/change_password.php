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
            /*min-height: 100vh;*/
            margin: 0;
        }
        .container {
            text-align: center;
            width: 46%;
        }
        h1 {
            position: relative;
            font-size: 40px;
            top:40px;
            margin-bottom: 40px;
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
        .submit-btn {
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
    </style>
</head>
<body>
        
    <div class="container">
            <h2>パスワード再設定</h2>
        
        <div class="form-group">
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
            <button type="submit" class="submit-btn">登録</button>
        </form>  
        <div class="links">
            <a href="login.php">戻る</a>
        </div>
    </div>
    </div>
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