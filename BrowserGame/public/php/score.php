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
        .error-message {
            color: red;
            font-size: 16px;
            font-weight: bold;
            margin: 20px 0;
        }
    </style>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>
<body>
<?php
   if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    try {
        $gameMapping = [
            '総合スコア' => null, // 総合スコアは特別扱い
            'Burush Dengon' => 1,
            'チャリ走' => 2,
            'WANTED' => 3
        ];

        $selectedGame = $_POST['game'] ?? '総合スコア'; // セレクトボックスの選択値
        $gameId = $gameMapping[$selectedGame];

        if ($_POST['action'] === 'getMyScore') {
            if (!isset($_SESSION['user_id']) || empty($_SESSION['user_id'])) {
                echo json_encode(['error' => 'ログインが必要です。']);
                exit;
            }
            $sql = "
                SELECT User.user_name, Score.score, Score.registration_date 
                FROM Score 
                INNER JOIN User ON Score.user_id = User.user_id 
                WHERE Score.user_id = :user_id
                " . ($gameId !== null ? "AND Score.game_id = :game_id" : "") . "
                ORDER BY Score.score DESC, Score.registration_date ASC
            ";
            $stmt = $pdo->prepare($sql);
            $stmt->bindValue(':user_id', $_SESSION['user_id'], PDO::PARAM_INT);
            if ($gameId !== null) {
                $stmt->bindValue(':game_id', $gameId, PDO::PARAM_INT);
            }
            $stmt->execute();
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            exit;
        }

        if ($_POST['action'] === 'getFriendScore') {
            if (!isset($_SESSION['user_id'])) {
                echo json_encode(['error' => 'ログインが必要です。']);
                exit;
            }
            $friendSql = "SELECT friend_id FROM Friend WHERE user_id = :user_id";
            $friendStmt = $pdo->prepare($friendSql);
            $friendStmt->bindValue(':user_id', $_SESSION['user_id'], PDO::PARAM_INT);
            $friendStmt->execute();
            $friendIds = $friendStmt->fetchAll(PDO::FETCH_COLUMN, 0);

            if (empty($friendIds)) {
                echo json_encode(['error' => 'フレンドがいません。']);
                exit;
            }

            $sql = "
                SELECT User.user_name, Score.score, Score.registration_date 
                FROM Score 
                INNER JOIN User ON Score.user_id = User.user_id 
                WHERE Score.user_id IN (" . implode(',', $friendIds) . ")
                " . ($gameId !== null ? "AND Score.game_id = :game_id" : "") . "
                ORDER BY Score.score DESC, Score.registration_date ASC
            ";
            $stmt = $pdo->prepare($sql);
            if ($gameId !== null) {
                $stmt->bindValue(':game_id', $gameId, PDO::PARAM_INT);
            }
            $stmt->execute();
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            exit;
        }
    } catch (Exception $e) {
        echo json_encode(['error' => 'データ取得に失敗しました。']);
        exit;
    }
}

    ?>

    <a href="top.php" class="back-button">戻る</a>

    <div class="container">
        <h1>ランキング</h1>
        <form method="POST" action="">
            <div class="tabs">
                <label class="selectbox-1">
                <select id="game-select">
                    <option value="総合スコア">総合スコア</option>
                    <option value="Burush Dengon">Burush Dengon</option>
                    <option value="チャリ走">チャリ走</option>
                    <option value="WANTED">WANTED</option>
                </select>
                </label>
                <button type="submit" id="show_my_score">マイスコア</button>
                <button type="submit" id="show_friend_score">フレンドスコア</button>
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
                <tbody id="score-table-body">
                    <tr>
                        <td colspan="4">データがありません</td>
                    </tr>
                </tbody>
                </tbody>
            </table>
        </div>
    </div>
    <script>
        $(document).ready(function () {
            // ボタンイベント設定
            $('#show-my-score').on('click', function () {
                fetchData('getMyScore');
            });
            $('#show-friend-score').on('click', function () {
                fetchData('getFriendScore');
            });

            // データ取得関数
            function fetchData(action) {
                const selectedGame = $('#game-select').val();
                $.ajax({
                    url: '', // 現在のページにリクエストを送信
                    type: 'POST',
                    data: { 
                        action: action, 
                        game: selectedGame 
                    },
                    dataType: 'json',
                    success: function (response) {
                        if (response.error) {
                            alert(response.error);
                        } else {
                            updateTable(response);
                        }
                    },
                    error: function () {
                        alert('データ取得に失敗しました。');
                    }
                });
            }

            // テーブルを更新する関数
            function updateTable(scores) {
                const tableBody = $('#score-table-body');
                tableBody.empty();

                if (scores.length > 0) {
                    scores.forEach((score, index) => {
                        tableBody.append(`
                            <tr>
                                <td>${index + 1}</td>
                                <td>${score.user_name}</td>
                                <td>${score.score}</td>
                                <td>${score.registration_date || '-'}</td>
                            </tr>
                        `);
                    });
                } else {
                    tableBody.append('<tr><td colspan="4">データがありません</td></tr>');
                }
            }
        });
    </script>
</body>
</html>