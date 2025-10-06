<?php
// register.php
require 'db/config.php';

header('Content-Type: application/json'); // Always send JSON response

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password_raw = $_POST['password'] ?? ''; // Store raw password for validation

    // 1. Essential Server-Side Input Validation
    if (empty($username) || empty($email) || empty($password_raw)) {
        echo json_encode(['success' => false, 'message' => 'All fields are required.']);
        exit;
    }

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
        exit;
    }

    // Basic password strength check (e.g., minimum length)
    if (strlen($password_raw) < 8) { // Recommend at least 8 characters
        echo json_encode(['success' => false, 'message' => 'Password must be at least 8 characters long.']);
        exit;
    }

    // Hash the password securely
    $password_hashed = password_hash($password_raw, PASSWORD_BCRYPT);

    // 2. Prepare SQL statement for user insertion
    $stmt = $pdo->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");

    try {
        $stmt->execute([$username, $email, $password_hashed]);
        // Registration successful
        echo json_encode(['success' => true, 'message' => 'Registration successful! You can now sign in.']);
    } catch (PDOException $e) {
        // 3. Handle specific PDO exceptions for duplicate entries
        // SQLSTATE '23000' typically indicates an integrity constraint violation (e.g., UNIQUE key violation)
        if ($e->getCode() == '23000') {
            // You can optionally try to determine if it's username or email,
            // but a generic "already exists" is often sufficient for security.
            echo json_encode(['success' => false, 'message' => 'The email or username you entered is already taken.']);
        } else {
            // Catch any other unexpected database errors
            error_log("Registration error: " . $e->getMessage()); // Log for server-side debugging
            echo json_encode(['success' => false, 'message' => 'An unexpected error occurred during registration. Please try again.']);
        }
    }
} else {
    // 4. Handle non-POST requests
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>