<?php
session_start();
require './db/config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user'])) {
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$user_id = $_SESSION['user']['id'];
$meme_id = $_POST['meme_id'] ?? '';
$caption = $_POST['caption'] ?? '';
$category_id = $_POST['category'] ?? ''; // <--- Changed to category_id

// Validate that category_id is an integer to prevent SQL injection or bad data
if (!is_numeric($category_id) || $category_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid category ID format']);
    exit;
}

if (empty($meme_id) || empty($caption)) { // category_id checked above
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

try {
    // Verify the meme belongs to the current user
    $stmt = $pdo->prepare("SELECT user_id FROM memes WHERE id = ?");
    $stmt->execute([$meme_id]);
    $meme = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$meme || $meme['user_id'] != $user_id) {
        echo json_encode(['success' => false, 'message' => 'Meme not found or access denied']);
        exit;
    }

    // Verify the category ID exists in the categories table
    $stmt = $pdo->prepare("SELECT id FROM categories WHERE id = ?"); // <--- Changed to check by ID
    $stmt->execute([$category_id]);
    $category = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$category) {
        echo json_encode(['success' => false, 'message' => 'Invalid category ID']); // <--- Updated error message
        exit;
    }

    // Update the meme
    $stmt = $pdo->prepare("
        UPDATE memes
        SET caption = ?, category_id = ?
        WHERE id = ? AND user_id = ?
    ");

    $stmt->execute([$caption, $category_id, $meme_id, $user_id]);

    echo json_encode(['success' => true, 'message' => 'Meme updated successfully']);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>