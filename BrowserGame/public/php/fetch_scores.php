<?php
session_start();
require '../dbConnect/dbconnect.php';

header('Content-Type: application/json');

try {
    if (!isset($_POST['action'])) {
        throw new Exception("無効なリクエストです。");
    }

    $action = $_POST['action'];
    $selectedGame = $_POST['rankingu'] ?? '総合スコア';  // セレクトボックスの選択されたゲーム

    $scores = [];
    if ($action === 'myScore') {
        if (!isset($_SESSION['user_id'])) {
            throw new Exception("ログインが必要です。");
        }

        $gameMapping = [
            '総合スコア' => null,  // 総合スコアは全ゲームを対象
            'Burush Dengon' => 1,
            'チャリ走' => 2,
            'WANTED' => 3
        ];

        // 総合スコアの場合
        if ($selectedGame === '総合スコア') {
            $sql = "
                SELECT User.user_name, SUM(Score.score) AS total_score, MAX(Score.registration_date) AS last_play_date
                FROM Score 
                INNER JOIN User ON Score.user_id = User.user_id 
                WHERE Score.user_id = :user_id
                GROUP BY User.user_name
                ORDER BY total_score DESC
            ";
            $stmt = $pdo->prepare($sql);
            $stmt->bindValue(':user_id', $_SESSION['user_id'], PDO::PARAM_INT);
            $stmt->execute();
            $scores = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } else {
            // ゲームごとのスコアの場合
            if (!isset($gameMapping[$selectedGame])) {
                throw new Exception("無効なゲーム選択です。");
            }

            $gameId = $gameMapping[$selectedGame];
            $sql = "
                SELECT User.user_name, Score.score, Score.registration_date 
                FROM Score 
                INNER JOIN User ON Score.user_id = User.user_id 
                WHERE Score.user_id = :user_id AND Score.game_id = :game_id
                ORDER BY Score.score DESC, Score.registration_date ASC
            ";
            $stmt = $pdo->prepare($sql);
            $stmt->bindValue(':user_id', $_SESSION['user_id'], PDO::PARAM_INT);
            $stmt->bindValue(':game_id', $gameId, PDO::PARAM_INT);
            $stmt->execute();
            $scores = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
    } elseif ($action === 'friendScore') {
        if (!isset($_SESSION['user_id'])) {
            throw new Exception("ログインが必要です。");
        }
        // フレンドスコアの処理（省略）
    }

    echo json_encode($scores);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
