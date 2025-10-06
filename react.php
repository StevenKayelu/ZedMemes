<?php
// react.php
require 'db/config.php';
require 'includes/auth.php'; // Ensure this file exists and has isLoggedIn() and getUserId()

header('Content-Type: application/json');

if (!isLoggedIn()) {
    echo json_encode(['success' => false, 'message' => 'You must be logged in to react.']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $memeId = $_POST['meme_id'] ?? null;
    $reactionType = $_POST['reaction'] ?? null; // Frontend sends 'reaction'

    if (empty($memeId) || empty($reactionType)) {
        echo json_encode(['success' => false, 'message' => 'Missing meme ID or reaction type.']);
        exit;
    }

    $userId = getUserId();

    // Define allowed reaction types and their corresponding database columns
    $allowedReactions = [
        'like' => 'likes',
        'upvote' => 'upvotes'
    ];

    if (!array_key_exists($reactionType, $allowedReactions)) {
        echo json_encode(['success' => false, 'message' => 'Invalid reaction type.']);
        exit;
    }

    $dbColumn = $allowedReactions[$reactionType]; // Get the actual database column name (e.g., 'likes' or 'upvotes')

    try {
        $pdo->beginTransaction();

        // Check if the user has already reacted with this type to this meme
        $checkStmt = $pdo->prepare("SELECT id FROM reactions WHERE user_id = ? AND meme_id = ? AND reaction_type = ?");
        $checkStmt->execute([$userId, $memeId, $reactionType]);

        if ($checkStmt->rowCount() > 0) {
            // User has already reacted with this type, so remove the reaction (toggle off)
            $deleteStmt = $pdo->prepare("DELETE FROM reactions WHERE user_id = ? AND meme_id = ? AND reaction_type = ?");
            $deleteStmt->execute([$userId, $memeId, $reactionType]);

            // Decrement the count in the memes table
            $updateMemeStmt = $pdo->prepare("UPDATE memes SET {$dbColumn} = {$dbColumn} - 1 WHERE id = ?");
            $updateMemeStmt->execute([$memeId]);

            $message = ucfirst($reactionType) . " removed.";
            $action = 'removed';

        } else {
            // User has not reacted with this type, so add the reaction (toggle on)
            $insertStmt = $pdo->prepare("INSERT INTO reactions (user_id, meme_id, reaction_type) VALUES (?, ?, ?)");
            $insertStmt->execute([$userId, $memeId, $reactionType]);

            // Increment the count in the memes table
            $updateMemeStmt = $pdo->prepare("UPDATE memes SET {$dbColumn} = {$dbColumn} + 1 WHERE id = ?");
            $updateMemeStmt->execute([$memeId]);

            $message = ucfirst($reactionType) . " added.";
            $action = 'added';
        }

        $pdo->commit();

        // Fetch updated counts for *all* reaction types for this meme
        // This ensures the frontend can update all buttons if needed
        $currentCountsStmt = $pdo->prepare("SELECT likes, upvotes FROM memes WHERE id = ?");
        $currentCountsStmt->execute([$memeId]);
        $counts = $currentCountsStmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true,
            'message' => $message,
            'counts' => $counts, // e.g., {'likes': 10, 'upvotes': 5}
            'reactionType' => $reactionType, // The type that was just acted upon
            'action' => $action // 'added' or 'removed'
        ]);

    } catch (PDOException $e) {
        $pdo->rollBack();
        error_log("Reaction error: " . $e->getMessage()); // Log the error for debugging
        echo json_encode(['success' => false, 'message' => 'Failed to process reaction. Please try again.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>