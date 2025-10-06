<?php
session_start();
require 'db/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Expect 'email' from the frontend
    $email = trim($_POST['email']);
    $password = $_POST['password'];

    // Select user by email
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        // Importantly, store necessary user details in the session
        // Only store what's needed for display/auth, not sensitive data like hashed password
        $_SESSION['user'] = [
            'id' => $user['id'],
            'username' => $user['username'], // Make sure 'username' is also stored if you display it
            'email' => $user['email']
        ];
        echo json_encode(['success' => true, 'message' => 'Login successful!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
    }
}
?>