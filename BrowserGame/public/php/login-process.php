<?php
session_start();
require '../dbConnect/dbconnect.php';

// Initialize error and success messages
$errorMessage = "";

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if (empty($email) || empty($password)) {
        // Display an error if fields are empty
        $errorMessage = "メールアドレスまたはパスワードを入力してください。";
    } else {
        // Prepare and execute SQL statement
        $sql = $pdo->prepare('SELECT * FROM User WHERE mailaddress = ?');
        $sql->execute([$email]);
        $user = $sql->fetch(PDO::FETCH_ASSOC);

        if ($user && $password === $user['password']) {
            // Save user info in session (excluding sensitive data)
            $_SESSION['user'] = [
                'user_id' => $user['user_id'],
                'user_name' => $user['user_name'],
                'mailaddress' => $user['mailaddress'],
                'password'=>$row['password']
            ];
            header('Location: top.php');
            exit;
        } else {
            // Display an error if email or password is incorrect
            $errorMessage = "ログイン名またはパスワードが間違っています。";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>ログイン</title>
    <style>
        .error {
            color: red;
        }
    </style>
</head>
<body>
    <h1>ログイン</h1>
    <?php if (!empty($errorMessage)): ?>
        <p class="error"><?php echo htmlspecialchars($errorMessage, ENT_QUOTES, 'UTF-8'); ?></p>
    <?php endif; ?>
    <form action="" method="post">
        <label for="email">メールアドレス:</label>
        <input type="email" name="email" id="email" value="<?php echo htmlspecialchars($email ?? '', ENT_QUOTES, 'UTF-8'); ?>"><br>
        <label for="password">パスワード:</label>
        <input type="password" name="password" id="password"><br>
        <button type="submit">ログイン</button>
    </form>
</body>
</html>
