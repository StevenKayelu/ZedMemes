<?php
// update_profile.php
header('Content-Type: application/json');
require './db/config.php';
session_start();

function respond($success, $message, $extra = []) {
    echo json_encode(array_merge(['success' => $success, 'message' => $message], $extra));
    exit;
}

// Check if user is logged in
if (!isset($_SESSION['user']) || !isset($_SESSION['user']['id'])) {
    respond(false, 'Please log in to update your profile');
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Invalid request method');
}

// Get values
$user_id = $_SESSION['user']['id'];
$email = trim($_POST['email'] ?? '');
$current_password = $_POST['current_password'] ?? '';
$new_password = $_POST['new_password'] ?? '';

// Validate required fields
if ($email === '' || $current_password === '') {
    respond(false, 'Email and current password are required');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Please enter a valid email address');
}

if (!empty($new_password) && strlen($new_password) < 6) {
    respond(false, 'New password must be at least 6 characters long');
}

try {
    // Verify current password
    $stmt = $pdo->prepare("SELECT password, username FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($current_password, $user['password'])) {
        respond(false, 'Current password is incorrect');
    }

    // Check if email already taken
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
    $stmt->execute([$email, $user_id]);
    if ($stmt->fetch()) {
        respond(false, 'Email is already registered to another account');
    }

    // Update the user
    if (!empty($new_password)) {
        $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("UPDATE users SET email = ?, password = ? WHERE id = ?");
        $stmt->execute([$email, $hashed_password, $user_id]);
    } else {
        $stmt = $pdo->prepare("UPDATE users SET email = ? WHERE id = ?");
        $stmt->execute([$email, $user_id]);
    }

    // Update session values
    $_SESSION['user']['email'] = $email;

    respond(true, 'Profile updated successfully', [
        'user' => [
            'id' => $user_id,
            'username' => $user['username'], // keep it from DB
            'email' => $email
        ]
    ]);

} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    respond(false, 'A database error occurred');
} catch (Exception $e) {
    error_log("General error: " . $e->getMessage());
    respond(false, 'An unexpected error occurred');
}
?>
