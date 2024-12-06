<?php
session_start();
require '../dbConnect/dbconnect.php';

header('Content-Type: application/json');

try {
    if (!isset($_POST['action'])) {
        throw new Exception("無効なリクエストです。");
    }

    $action = $_POST['action'];
    $selectedGame = $_POST['rankingu'] ?? '総合スコア';

    $scores = [];
    if ($action === 'myScore') {
        if (!isset($_SESSION['user_id'])) {
            throw new Exception("ログインが必要です。");
        }
        $sql = "
            SELECT User.user_name, Score.score, Score.registration_date 
            FROM Score 
            INNER JOIN User ON Score.user_id = User.user_id 
            WHERE Score.user_id = :user_id 
            ORDER BY Score.score DESC, Score.registration_date ASC
        ";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':user_id', $_SESSION['user_id'], PDO::PARAM_INT);
        $stmt->execute();
        $scores = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } elseif ($action === 'friendScore') {
        if (!isset($_SESSION['user_id'])) {
            throw new Exception("ログインが必要です。");
        }
        $friendSql = "SELECT friend_id FROM Friend WHERE user_id = :user_id";
        $friendStmt = $pdo->prepare($friendSql);
        $friendStmt->bindValue(':user_id', $_SESSION['user_id'], PDO::PARAM_INT);
        $friendStmt->execute();
        $friendIds = $friendStmt->fetchAll(PDO::FETCH_COLUMN);

        if (!empty($friendIds)) {
            $sql = "
                SELECT User.user_name, Score.score, Score.registration_date 
                FROM Score 
                INNER JOIN User ON Score.user_id = User.user_id 
                WHERE Score.user_id IN (" . implode(',', $friendIds) . ") 
                ORDER BY Score.score DESC, Score.registration_date ASC
            ";
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
            $scores = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
    } elseif ($selectedGame === '総合スコア') {
        $sql = "
            SELECT User.user_name, SUM(Score.score) AS total_score, MAX(Score.registration_date) AS last_play_date
            FROM Score 
            INNER JOIN User ON Score.user_id = User.user_id 
            GROUP BY User.user_name 
            ORDER BY total_score DESC
            LIMIT 50
        ";
        $stmt = $pdo->query($sql);
        $scores = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } else {
        $gameMapping = [
            'Burush Dengon' => 1,
            'チャリ走' => 2,
            'WANTED' => 3,
        ];
        if (!isset($gameMapping[$selectedGame])) {
            throw new Exception("無効なゲーム選択です。");
        }
        $sql = "
            SELECT User.user_name, Score.score, Score.registration_date 
            FROM Score 
            INNER JOIN User ON Score.user_id = User.user_id 
            WHERE Score.game_id = :game_id 
            ORDER BY Score.score DESC, Score.registration_date ASC
        ";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':game_id', $gameMapping[$selectedGame], PDO::PARAM_INT);
        $stmt->execute();
        $scores = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    echo json_encode($scores);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}