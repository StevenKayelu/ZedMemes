<?php
session_start();

function isLoggedIn() {
    return isset($_SESSION['user']);
}

function getUserId() {
    return $_SESSION['user']['id'] ?? null;
}
?>