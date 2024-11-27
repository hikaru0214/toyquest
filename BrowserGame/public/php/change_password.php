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


    
        <a href="login.php"><span class="back-arrow">&larr;</span></a>
        <div class="container">
            <h2>パスワード再設定</h2>
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
            <button type="submit" class="submit-btn">登録</button>
        </form>  
        <!-- エラーメッセージ表示 -->
    
</body>
</html>