<?php
// upload_meme.php (or post_meme.php)
require './db/config.php';
require './includes/auth.php'; // Assumes isLoggedIn() and getUserId() are here

header('Content-Type: application/json'); // Always send JSON response

// 1. Check if the user is logged in
if (!isLoggedIn()) {
    echo json_encode(['success' => false, 'message' => 'You must be logged in to upload a meme.']);
    exit;
}

// 2. Process POST request and check for file upload
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['meme'])) {
    $file = $_FILES['meme'];
    $caption = trim($_POST['caption'] ?? '');
    $category_id = intval($_POST['category_id'] ?? 0);

    if (empty($caption)) {
        echo json_encode(['success' => false, 'message' => 'Caption is required.']);
        exit;
    }

    if ($category_id === 0) {
        echo json_encode(['success' => false, 'message' => 'Please select a valid category.']);
        exit;
    }

    // 3. Validate file type
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!in_array($file['type'], $allowedTypes)) {
        echo json_encode(['success' => false, 'message' => 'Only JPG, PNG, or GIF images are allowed.']);
        exit;
    }

    // 4. Check for any upload errors
    if ($file['error'] !== UPLOAD_ERR_OK) {
        $uploadErrors = [
            UPLOAD_ERR_INI_SIZE   => 'The uploaded file exceeds the maximum file size allowed by the server.',
            UPLOAD_ERR_FORM_SIZE  => 'The uploaded file exceeds the MAX_FILE_SIZE specified in the form.',
            UPLOAD_ERR_PARTIAL    => 'The file was only partially uploaded.',
            UPLOAD_ERR_NO_FILE    => 'No file was uploaded.',
            UPLOAD_ERR_NO_TMP_DIR => 'Missing a temporary folder for uploads.',
            UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk. Check server permissions.',
            UPLOAD_ERR_EXTENSION  => 'A PHP extension stopped the file upload.',
        ];
        $errorMessage = $uploadErrors[$file['error']] ?? 'An unknown upload error occurred.';
        echo json_encode(['success' => false, 'message' => 'Upload failed: ' . $errorMessage]);
        exit;
    }

    // 5. Generate a unique filename and set the correct destination
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename_for_db = uniqid('meme_', true) . '.' . $ext;
    $destination_path = 'uploads/' . $filename_for_db;

    // 6. Move the uploaded file
    if (move_uploaded_file($file['tmp_name'], $destination_path)) {
        // 7. Insert meme details into the database
        $userId = getUserId();
        $stmt = $pdo->prepare("INSERT INTO memes (user_id, filename, caption, likes, upvotes, category_id) VALUES (?, ?, ?, 0, 0, ?)");

        try {
            $stmt->execute([$userId, $filename_for_db, $caption, $category_id]);
            echo json_encode([
                'success' => true,
                'message' => 'Meme uploaded successfully!',
                'filename' => $filename_for_db,
                'caption' => $caption,
                'category_id' => $category_id,
                'meme_id' => $pdo->lastInsertId()
            ]);
        } catch (PDOException $e) {
            if (file_exists($destination_path)) {
                unlink($destination_path);
            }
            error_log("Meme database insert failed: " . $e->getMessage());
            echo json_encode(['success' => false, 'message' => 'Failed to save meme details to the database.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Could not save the image file to the server. Check folder permissions.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'No meme file uploaded or invalid request.']);
}
?>
