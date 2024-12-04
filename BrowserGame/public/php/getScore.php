<?php
session_start();
require '../dbConnect/dbconnect.php';

header('Content-Type: application/json');

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

    echo json_encode($response);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
}
