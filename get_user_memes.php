<?php
session_start();
require './db/config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user'])) {
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

$user_id = $_SESSION['user']['id'];

try {
    $stmt = $pdo->prepare("
        SELECT 
            m.id,
            m.caption,
            m.filename,
            m.created_at AS timestamp,
            c.name AS category_name,
            u.username AS uploader_username,
            u.id AS uploader_id,
            COALESCE(SUM(r.reaction_type = 'like'), 0) AS likes,
            COALESCE(SUM(r.reaction_type = 'upvote'), 0) AS upvotes
        FROM memes m
        LEFT JOIN users u ON m.user_id = u.id
        LEFT JOIN categories c ON m.category_id = c.id
        LEFT JOIN reactions r ON m.id = r.meme_id
        WHERE m.user_id = ?
        GROUP BY m.id
        ORDER BY m.created_at DESC
    ");

    $stmt->execute([$user_id]);
    $memes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'meme' => $memes
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
