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
        try {
        
            // データ取得SQL
            $sql = "SELECT Score.score_id, Score.game_id, Score.user_id,User.user_name,Score. registration_date, Score.score FROM Score INNER JOIN User ON Score.user_id = User.user_id  ORDER BY registration_date DESC";
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
        
            // 結果を取得
            $scores = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            echo "データベース接続エラー: " . $e->getMessage();
            exit;
        }
    ?>
    <a href="" onclick="history.back()" class="back-button">戻る</a>

    <div class="container">
        <h1>ランキング</h1>
        <div class="tabs">
            <label class="selectbox-1">
                <select name="rankingu">
                    <option>総合スコア</option>
                    <option>Burush Dengon</option>
                    <option>チャリ走</option>
                    <option>WANTED</option>
                </select> 
            </label>  
            <button>マイスコア</button>
            <button>フレンドスコア</button>
            <button>マルチスコア</button>
        </div>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>本日スコア</th>
                        <th>月間スコア</th>
                        <th>ユーザー名</th>
                        <th>日付</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- スコアのデータはここに追加されます -->
                    <?php if (!empty($scores)): ?>
                <?php foreach ($scores as $score): ?>
                    <tr>
                        <td><?= htmlspecialchars($score['score'], ENT_QUOTES, 'UTF-8') ?></td>
                        <td><?= htmlspecialchars($score['score'], ENT_QUOTES, 'UTF-8') ?></td>
                        <td><?= htmlspecialchars($score['user_name'], ENT_QUOTES, 'UTF-8') ?></td>
                        <td><?= htmlspecialchars($score['registration_date'], ENT_QUOTES, 'UTF-8') ?></td>
                        
                    </tr>
                <?php endforeach; ?>
            <?php else: ?>
                <tr>
                    <td colspan="5">データがありません</td>
                </tr>
            <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>

</body>
</html>