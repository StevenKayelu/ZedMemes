<?php
// api/fetch_memes.php
require './db/config.php'; // Adjust path if your db/config.php is in a different location
require './includes/auth.php'; // Assuming this has getUserId() for 'for-you' filter


header('Content-Type: application/json');

// Get parameters from the frontend
$filter = $_GET['filter'] ?? 'latest'; // Default to 'latest'
$category = $_GET['category'] ?? 'all'; // Default to 'all'
$searchQuery = $_GET['search'] ?? '';

// Basic validation for filter and category
// Added 'trending' to allowed filters
$allowedFilters = ['latest', 'most-voted', 'trending', 'for-you'];
if (!in_array($filter, $allowedFilters)) {
    echo json_encode(['success' => false, 'message' => 'Invalid filter type.']);
    exit;
}

// Fetch categories from the database dynamically
$allowedCategories = ['all'];
try {
    $categoriesStmt = $pdo->query("SELECT name FROM categories");
    $dbCategories = $categoriesStmt->fetchAll(PDO::FETCH_COLUMN);
    $allowedCategories = array_merge($allowedCategories, $dbCategories);
} catch (PDOException $e) {
    error_log("Error fetching categories from DB: " . $e->getMessage());
    // Fallback to hardcoded categories if DB fetch fails.
    // This ensures the script doesn't completely break if the categories table is empty or inaccessible for some reason.
    // However, it's better to ensure the DB is always consistent.
    // Note: 'trending' here is a category name, not the filter type.
    $allowedCategories = array_merge($allowedCategories, ['school', 'jokes', 'relationships', 'work', 'trending', 'sports']);
}


// Only validate category if it's not 'trending' filter (which doesn't use category)
if ($filter !== 'trending' && !in_array($category, $allowedCategories)) {
    echo json_encode(['success' => false, 'message' => 'Invalid category.']);
    exit;
}


try {
    $sql = "SELECT m.id, m.caption, m.filename, m.upvotes, m.likes, m.created_at, c.name AS category_name, u.username AS uploader_username
            FROM memes m
            JOIN users u ON m.user_id = u.id
            LEFT JOIN categories c ON m.category_id = c.id
            WHERE 1=1";

    $params = [];

    // Add category filter
    if ($category !== 'all') {
        $sql .= " AND c.name = ?";
        $params[] = $category;
    }

    // Add search query
    if (!empty($searchQuery)) {
        // Search by caption OR username
        $sql .= " AND (m.caption LIKE ? OR u.username LIKE ?)";
        $params[] = '%' . $searchQuery . '%';
        $params[] = '%' . $searchQuery . '%';
    }

    // Add ordering based on filter
    switch ($filter) {
        case 'latest':
            // Order by the newest posts
            $sql .= " ORDER BY m.created_at DESC";
            break;
        case 'most-voted':
            // Order by most upvoted (votes only)
            $sql .= " ORDER BY m.upvotes DESC";
            break;
        case 'trending':
            // Order by most votes + likes (trending)
            $sql .= " ORDER BY (m.likes + m.upvotes) DESC";
            break;
        case 'for-you':
            $userId = getUserId(); // Assuming getUserId() works and returns logged-in user's ID
            if ($userId) {
                // Select memes from categories the user has reacted to
                $sql .= " AND m.category_id IN (
                                SELECT DISTINCT m2.category_id FROM reactions r2
                                JOIN memes m2 ON r2.meme_id = m2.id
                                WHERE r2.user_id = ? AND m2.category_id IS NOT NULL
                            )";
                $params[] = $userId;
                $sql .= " ORDER BY m.created_at DESC"; // Still order by latest within those categories
            } else {
                // If not logged in, 'for-you' falls back to 'latest'
                $sql .= " ORDER BY m.created_at DESC";
            }
            break;
    }

    // Add LIMIT and OFFSET for pagination if you plan to implement it
    // $sql .= " LIMIT 20 OFFSET 0"; // Example for first 20 memes

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $memes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Format timestamp for display if needed
    foreach ($memes as &$meme) {
        $meme['timestamp'] = (new DateTime($meme['created_at']))->format('M d, Y H:i');
        // You can unset original 'created_at' and 'category_id' if not needed by frontend
        unset($meme['created_at']); // 'timestamp' is derived, so 'created_at' might not be needed
        // unset($meme['category_id']); // if you don't need the ID on the frontend, only the name
    }

    echo json_encode(['success' => true, 'memes' => $memes]);

} catch (PDOException $e) {
    error_log("Fetch memes error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Failed to fetch memes. Please try again.']);
}
?>
