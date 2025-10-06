<?php
// get_user_profile.php
header('Content-Type: application/json');
require './db/config.php';
session_start();

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

// Validate session
if (!isset($_SESSION['user']) || !isset($_SESSION['user']['id'])) {
    echo json_encode(['success' => false, 'message' => 'Please log in to view profile']);
    exit;
}

// Determine which user's profile to fetch
$user_id = null;
if (isset($_GET['user_id']) && is_numeric($_GET['user_id'])) {
    $user_id = (int)$_GET['user_id']; // requested user
} else {
    $user_id = $_SESSION['user']['id']; // fallback to logged-in user
}

try {
    // Get user basic info
    $stmt = $pdo->prepare("SELECT id, username, email, created_at FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'User not found']);
        exit;
    }

    // Get user statistics
    $stats_stmt = $pdo->prepare("
        SELECT 
            COUNT(m.id) as meme_count,
            COALESCE(SUM(m.upvotes), 0) as total_votes,
            COALESCE(SUM(m.likes), 0) as total_likes
        FROM memes m 
        WHERE m.user_id = ?
    ");
    $stats_stmt->execute([$user_id]);
    $stats = $stats_stmt->fetch(PDO::FETCH_ASSOC);

    // Combine user data with stats
    $user_data = array_merge($user, $stats);

    echo json_encode([
        'success' => true,
        'user' => $user_data
    ]);
} catch (PDOException $e) {
    error_log("Database error in get_user_profile.php: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Database error occurred']);
} catch (Exception $e) {
    error_log("Error in get_user_profile.php: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An error occurred while fetching profile']);
}
?>
