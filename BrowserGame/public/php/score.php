<?php session_start();
    require '../dbConnect/dbconnect.php'; 

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            $type = $data['type'] ?? null;
            $selectedGame = $data['selectedGame'] ?? '総合スコア';
    
            if (!isset($_SESSION['user_id'])) {
                throw new Exception("ログインが必要です。");
            }
    
            $response = [];
    
            if ($type === 'myScore') {
                $sql = "SELECT User.user_name, Score.score, Score.registration_date 
                        FROM Score 
                        INNER JOIN User ON Score.user_id = User.user_id 
                        WHERE Score.user_id = :user_id 
                        ORDER BY Score.score DESC, Score.registration_date ASC";
                $stmt = $pdo->prepare($sql);
                $stmt->bindValue(':user_id', $_SESSION['user_id'], PDO::PARAM_INT);
                $stmt->execute();
                $response = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } elseif ($type === 'friendScore') {
                $friendSql = "SELECT friend_id FROM Friend WHERE user_id = :user_id";
                $friendStmt = $pdo->prepare($friendSql);
                $friendStmt->bindValue(':user_id', $_SESSION['user_id'], PDO::PARAM_INT);
                $friendStmt->execute();
                $friendIds = $friendStmt->fetchAll(PDO::FETCH_COLUMN, 0);
    
                if (!empty($friendIds)) {
                    $sql = "SELECT User.user_name, Score.score, Score.registration_date 
                            FROM Score 
                            INNER JOIN User ON Score.user_id = User.user_id 
                            WHERE Score.user_id IN (" . implode(',', $friendIds) . ") 
                            ORDER BY Score.score DESC, Score.registration_date ASC";
                    $stmt = $pdo->query($sql);
                    $response = $stmt->fetchAll(PDO::FETCH_ASSOC);
                }
            }
    
            header('Content-Type: application/json');
            echo json_encode($response);
            exit;
        } catch (Exception $e) {
            header('Content-Type: application/json', true, 400);
            echo json_encode(['error' => $e->getMessage()]);
            exit;
        }
    }
 ?>

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
</head>
<body>
<a href="top.php" class="back-button">戻る</a>

    <div class="container">
        <h1>ランキング</h1>
        <form>
            <div class="tabs">
                <label class="selectbox-1">
                    <select id="rankingu">
                        <option value="総合スコア">総合スコア</option>
                        <option value="Burush Dengon">Burush Dengon</option>
                        <option value="チャリ走">チャリ走</option>
                        <option value="WANTED">WANTED</option>
                    </select>
                </label>
                <button type="button" id="show_my_score">マイスコア</button>
                <button type="button" id="show_friend_score">フレンドスコア</button>
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
                <tbody id="scoreTableBody">
                    <tr>
                        <td colspan="4">データがありません。</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <script>
        document.getElementById('show_my_score').addEventListener('click', function() {
            fetchScores('myScore');
        });

        document.getElementById('show_friend_score').addEventListener('click', function() {
            fetchScores('friendScore');
        });

        function fetchScores(type) {
            const selectedGame = document.getElementById('rankingu').value;

            // 自分自身へAjaxリクエストを送信
            fetch(window.location.href, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, selectedGame })
            })
                .then(response => response.json())
                .then(data => updateTable(data))
                .catch(error => console.error('Error:', error));
        }

        function updateTable(data) {
            const tableBody = document.getElementById('scoreTableBody');
            tableBody.innerHTML = ''; // 既存の行をクリア

            if (data && data.length > 0) {
                data.forEach((row, index) => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${row.user_name}</td>
                        <td>${row.score}</td>
                        <td>${row.registration_date}</td>
                    `;
                    tableBody.appendChild(tr);
                });
            } else {
                const tr = document.createElement('tr');
                tr.innerHTML = '<td colspan="4">データがありません。</td>';
                tableBody.appendChild(tr);
            }
        }
    </script>
</body>