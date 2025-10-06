<?php
session_start();
require './db/config.php';

header('Content-Type: application/json');

// Authentication check
if (!isset($_SESSION['user'])) {
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

// Check request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

// Get meme ID
$input = json_decode(file_get_contents('php://input'), true);
$user_id = $_SESSION['user']['id'];
$id = $input['id'] ?? '';

if (empty($id)) {
    echo json_encode(['success' => false, 'message' => 'Meme ID is required']);
    exit;
}

try {
    // Fetch meme and check ownership
    $stmt = $pdo->prepare("SELECT user_id, filename FROM memes WHERE id = ?");
    $stmt->execute([$id]);
    $meme = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$meme || $meme['user_id'] != $user_id) {
        echo json_encode(['success' => false, 'message' => 'Meme not found or access denied']);
        exit;
    }

    // Delete votes related to this meme
    $pdo->prepare("DELETE FROM reactions WHERE meme_id = ?")->execute([$id]);

    // Delete the meme
    $stmt = $pdo->prepare("DELETE FROM memes WHERE id = ? AND user_id = ?");
    $stmt->execute([$id, $user_id]);

    // Delete the image file
    $filepath = './uploads/' . $meme['filename']; // Adjust path as needed
    if (!empty($meme['filename']) && file_exists($filepath)) {
        unlink($filepath);
    }

    echo json_encode(['success' => true, 'message' => 'Meme deleted successfully']);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
