<?php session_start(); ?>
<!-- DB接続 -->
<?php require '../dbConnect/dbconnect.php'; ?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ランキング</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            
            background-image: url(../img/rankingu.png); /* 背景に画像を指定 */
            background-size: cover;
            color: black;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        .container {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            background-color: rgba(255, 255, 255, 0.9);
            border-radius: 10px;
            padding: 150px;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
            color: black;
            

        }

        h1 {
            text-align: center;
            margin-bottom: 100px;
            
        }

        .back-button {
            position: absolute;
            top: 10px;
            left: 10px;
            color: rgb(232, 248, 4);
            text-decoration: none;
        }

        .tabs {
            display: flex;
            justify-content: space-around;
            margin-bottom: 30px;
            width: 100%;
        }

        .tabs button {
            background-color: #1192ee;
            color: white;
            border: 1px solid #ccc;
            padding: 10px 20px;
            cursor: pointer;
            flex-grow: 1;
            margin-right: 5px;
            margin-left: 10px;
            border-radius: 5px;
            width: 120%;
            margin: 0 auto;
        }

        .tabs button:last-child {
            margin-right: 0;
        }

        .tabs button:hover {
            background-color: #ddd;
        }

        .table-container {
            background-color: white;
            border: 1px solid #ccc;
            padding: 20px;
            border-radius: 5px;
            width: 95%;
            margin: 0 auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        table, th, td {
            border: 1px solid #ccc;
        }

        th, td {
            padding: 10px;
            text-align: center;
        }
        .selectbox-1 {
            position: relative;
        }

        .selectbox-1::before,
        .selectbox-1::after {
            position: absolute;
            content: '';
            pointer-events: none;
        }

        .selectbox-1::before {
            display: inline-block;
            right: 0;
            width: 2.8em;
            height: 2.8em;
            border-radius: 0 3px 3px 0;
            background-color: #1192ee;
        }

        .selectbox-1::after {
            position: absolute;
            top: 50%;
            right: 1.4em;
            transform: translate(50%, -50%) rotate(45deg);
            width: 6px;
            height: 6px;
            border-bottom: 3px solid #fff;
            border-right: 3px solid #fff;
        }

        .selectbox-1 select {
            appearance: none;
            min-width: 230px;
            height: 2.8em;
            padding: .4em 3.6em .4em .8em;
            border: none;
            border-radius: 3px;
            background-color: #efebeb;
            color: #333;
            font-size: 1em;
            cursor: pointer;
        }

        .selectbox-1 select:focus {
            outline: 2px solid #1192ee;
        }
    </style>
</head>
<body>
<?php
    // 初期設定
    $selectedGame = isset($_POST['rankingu']) ? $_POST['rankingu'] : '総合スコア';
    $showMyScore = isset($_POST['show_my_score']) ? true : false;
    $showFriendScore = isset($_POST['show_friend_score']) ? true : false;

    try {
        // SQL生成
        if ($showFriendScore) {
            if (!isset($_SESSION['user_id'])) {
                throw new Exception("ログインが必要です。");
            }

            // フレンドリスト取得
            $friendSql = "SELECT friend_id FROM Friend WHERE user_id = :user_id";
            $friendStmt = $pdo->prepare($friendSql);
            $friendStmt->bindValue(':user_id', $_SESSION['user_id'], PDO::PARAM_INT);
            $friendStmt->execute();
            $friendIds = $friendStmt->fetchAll(PDO::FETCH_COLUMN, 0);

            if (empty($friendIds)) {
                throw new Exception("フレンドがいません。");
            }

            $sql = "
                SELECT User.user_id, User.user_name, Score.score, Score.registration_date 
                FROM Score 
                INNER JOIN User ON Score.user_id = User.user_id 
                WHERE Score.user_id IN (" . implode(',', $friendIds) . ") 
                ORDER BY Score.score DESC, Score.registration_date ASC
            ";
        } elseif ($showMyScore && (!isset($_SESSION['user_id']) || empty($_SESSION['user_id']))) {
            if (!isset($_SESSION['user_id'])) {
                throw new Exception("ログインが必要です。");
            }

            $sql = "
                SELECT User.user_id, User.user_name, Score.score, Score.registration_date 
                FROM Score 
                INNER JOIN User ON Score.user_id = User.user_id 
                WHERE Score.user_id = :user_id 
                ORDER BY Score.score DESC, Score.registration_date ASC
            ";
            $stmt = $pdo->prepare($sql);
            $stmt->bindValue(':user_id', $_SESSION['user_id'], PDO::PARAM_INT);
        } elseif ($selectedGame === '総合スコア') {
            $sql = "
                SELECT User.user_id, User.user_name, SUM(Score.score) AS total_score, MAX(Score.registration_date) AS last_play_date
                FROM Score 
                INNER JOIN User ON Score.user_id = User.user_id 
                WHERE Score.game_id IN (1, 2, 3) 
                GROUP BY User.user_id, User.user_name 
                ORDER BY total_score DESC
            ";
        } else {
            $gameMapping = [
                'Burush Dengon' => 1,
                'チャリ走' => 2,
                'WANTED' => 3,
            ];
            $sql = "
                SELECT User.user_id, User.user_name, Score.score, Score.registration_date 
                FROM Score 
                INNER JOIN User ON Score.user_id = User.user_id 
                WHERE Score.game_id = :game_id 
                ORDER BY Score.score DESC, Score.registration_date ASC
            ";
        }

        // SQL実行
        $stmt = $pdo->prepare($sql);
        if ($showMyScore) {
            $stmt->bindValue(':user_id', $_SESSION['user_id'], PDO::PARAM_INT);
        } elseif (isset($gameMapping[$selectedGame])) {
            $stmt->bindValue(':game_id', $gameMapping[$selectedGame], PDO::PARAM_INT);
        }
        $stmt->execute();
        $scores = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        echo "エラー: " . $e->getMessage();
        exit;
    }
    ?>

    <a href="javascript:history.back();" class="back-button">戻る</a>

    <div class="container">
        <h1>ランキング</h1>
        <form method="POST" action="">
            <div class="tabs">
                <label class="selectbox-1">
                    <select name="rankingu" onchange="this.form.submit()">
                        <option <?= $selectedGame === '総合スコア' ? 'selected' : '' ?>>総合スコア</option>
                        <option <?= $selectedGame === 'Burush Dengon' ? 'selected' : '' ?>>Burush Dengon</option>
                        <option <?= $selectedGame === 'チャリ走' ? 'selected' : '' ?>>チャリ走</option>
                        <option <?= $selectedGame === 'WANTED' ? 'selected' : '' ?>>WANTED</option>
                    </select>
                </label>
                <button type="submit" name="show_my_score">マイスコア</button>
                <button type="submit" name="show_friend_score">フレンドスコア</button>
            </div>
        </form>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>順位</th>
                        <th>ユーザー名</th>
                        <th>スコア</th>
                        <th>日付</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (!empty($scores)): ?>
                        <?php 
                        $rank = 1; 
                        foreach ($scores as $score): 
                            $displayDate = isset($score['last_play_date']) 
                                ? htmlspecialchars($score['last_play_date'], ENT_QUOTES, 'UTF-8') 
                                : (isset($score['registration_date']) 
                                    ? htmlspecialchars($score['registration_date'], ENT_QUOTES, 'UTF-8') 
                                    : '-'); 
                        ?>
                        <tr>
                            <td><?= $rank ?></td>
                            <td><?= htmlspecialchars($score['user_name'], ENT_QUOTES, 'UTF-8') ?></td>
                            <td><?= htmlspecialchars($score['score'] ?? $score['total_score'], ENT_QUOTES, 'UTF-8') ?></td>
                            <td><?= $displayDate ?></td>
                        </tr>
                        <?php 
                        $rank++;
                        endforeach; 
                        ?>
                    <?php else: ?>
                        <tr>
                            <td colspan="4">データがありません</td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>