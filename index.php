<?php
// index.php

require   './db/config.php'; // Ensure this path is correct for your database connection
session_start();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ZedMemes</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/foundation/6.7.5/css/foundation.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="./assets/css/style.css">
</head>
<body>
   <!-- Replace the header section in your index.php with this updated version -->

<header class="header">
    <div class="grid-container">
        <div class="grid-x align-middle">
            <div class="cell auto">
                <h1>
                    <img src="logo.jpg" alt="ZedMemes Logo" class="logo">
                    ZedMemes
                </h1>
            </div>
            <div class="cell shrink">
                <div class="button-group" id="auth-buttons">

                    
                    <?php if (isset($_SESSION['user'])): ?>
                        <button id="profile-btn">
                            <span class="welcome-text">
                                Welcome, <?php echo htmlspecialchars($_SESSION['user']['username']); ?>!
                            </span>
                        </button>  
                        <button class="btn" id="upload-btn">
                            <i class="fas fa-upload"></i> Upload
                        </button>
                        <button class="btn btn-logout" id="logout-btn">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </button>
                    <?php else: ?>
                        <button class="btn" id="signin-btn">
                            <i class="fas fa-sign-in-alt"></i> Sign In
                        </button>
                        <button class="btn btn-primary1" id="signup-btn">
                            <i class="fas fa-user-plus"></i> Sign Up
                        </button>
                    <?php endif; ?>
                    <!-- Theme toggle button -->
                    <button class="theme-toggle" id="theme-toggle" title="Toggle dark/light mode">
                        <i class="fas fa-moon"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</header>

    <main class="grid-container">
        <div class="search-controls">
            <div class="search-bar">
                <input type="text" id="search-input" class="search-input" placeholder="Search memes by caption or username...">
                <button class="search-btn" id="search-btn">
                    <i class="fas fa-search"></i>
                </button>
            </div>

            <div class="filter-tabs">
                <div class="filter-tab active" data-filter="latest">
                    <i class="fas fa-clock"></i> Latest
                </div>
                <div class="filter-tab" data-filter="trending">
                    <i class="fas fa-fire"></i> Trending
                </div>
                <div class="filter-tab" data-filter="for-you">
                    <i class="fas fa-heart"></i> For You
                </div>
            </div>


            <div class="category-tabs">
                <div class="category-tab active" data-category="all">All</div>
                <div class="category-tab" data-category="school">School</div>
                <div class="category-tab" data-category="jokes">Jokes</div>
                <div class="category-tab" data-category="relationships">Relationships</div>
                <div class="category-tab" data-category="work">Work</div>
                <div class="category-tab" data-category="sports">Sports</div>
            </div>
        </div>

        <div id="meme-container" class="grid-x grid-margin-x small-up-1 medium-up-2 large-up-3 xlarge-up-4">

        </div>

        </main>

    <!-- Login Modal -->
    <div id="login-modal" class="reveal" data-reveal>
            <div class="modal-header">
                <button class="modal-close" data-close aria-label="Close modal" type="button">&times;</button>
                <h2 class="modal-title">Welcome Back</h2>
                <p class="modal-subtitle">Sign in to your ZedMemes account</p>
            </div>
            <div class="modal-body">
                <form id="login-form">
                    <div class="form-group">
                        <label class="form-label" for="login-email">Email Address</label>
                        <div class="input-container">
                            <input type="email" id="login-email" class="form-input" placeholder="Enter your email" required>
                            <i class="fas fa-envelope input-icon"></i>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="login-password">Password</label>
                        <div class="input-container">
                            <input type="password" id="login-password" class="form-input" placeholder="Enter your password" required>
                            <i class="fas fa-eye password-toggle input-icon" onclick="togglePassword('login-password', this)"></i>
                        </div>
                    </div>
                    <button type="submit" class="btn-primary">Sign In</button>
                    <div class="status-message" id="login-status"></div>
                </form>
                <div class="toggle-link">
                    <a href="#" onclick="switchModal('login', 'signup')">Don't have an account? Sign up</a>
                </div>
            </div>
    </div>

    <!-- Signup Modal -->
    <div id="signup-modal" class="reveal" data-reveal>
            <div class="modal-header">
                <button class="modal-close" data-close aria-label="Close modal" type="button">&times;</button>
                <h2 class="modal-title">Join ZedMemes</h2>
                <p class="modal-subtitle">Create your account to start sharing memes</p>
            </div>
            <div class="modal-body">
                <form id="signup-form">
                    <div class="form-group">
                        <label class="form-label" for="signup-username">Username</label>
                        <div class="input-container">
                            <input type="text" id="signup-username" class="form-input" placeholder="Choose a username" required>
                            <i class="fas fa-user input-icon"></i>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="signup-email">Email Address</label>
                        <div class="input-container">
                            <input type="email" id="signup-email" class="form-input" placeholder="Enter your email" required>
                            <i class="fas fa-envelope input-icon"></i>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="signup-password">Password</label>
                        <div class="input-container">
                            <input type="password" id="signup-password" class="form-input" placeholder="Create a password" required>
                            <i class="fas fa-eye password-toggle input-icon" onclick="togglePassword('signup-password', this)"></i>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="signup-confirm">Confirm Password</label>
                        <div class="input-container">
                            <input type="password" id="signup-confirm" class="form-input" placeholder="Confirm your password" required>
                            <i class="fas fa-eye password-toggle input-icon" onclick="togglePassword('signup-confirm', this)"></i>
                        </div>
                    </div>
                    <button type="submit" class="btn-primary">Create Account</button>
                    <div class="status-message" id="signup-status"></div>
                </form>
                <div class="toggle-link">
                  <a href="#" onclick="switchModal('signup', 'login')">Already have an account? Sign in</a>
                </div>
            </div>
    </div>

    <!-- Upload Modal -->
    <div id="upload-modal" class="reveal" data-reveal>
        <div class="modal-header">
        <h2>Upload Meme</h2>
        <button class="modal-close" data-close aria-label="Close modal" type="button">&times;</button>
        </div>
        <div class="modal-body">
        <form id="upload-form" enctype="multipart/form-data">
            <div class="form-group">
            <label>Select Image</label>
            <div class="upload-area" id="upload-area">
                <i class="fas fa-cloud-upload-alt" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                <p>Click to select an image or drag and drop</p>
                <input type="file" id="meme-file" name="meme" accept="image/*" style="display: none;">
            </div>
            <div id="image-preview" style="display: none; text-align: center;">
                <img id="preview-img" class="preview-image" alt="Preview">
            </div>
            </div>
            <div class="form-group">
            <label for="meme-caption">Caption</label>
            <input type="text" id="meme-caption" name="caption" class="form-control" placeholder="Add a funny caption..." required>
            </div>
            <div class="form-group">
            <label for="meme-category">Category</label>
            <select id="meme-category" name="category_id" class="category-select" required>
                <option value="">Select a category</option>
                <option value="1">School Memes</option>
                <option value="2">Jokes</option>
                <option value="3">Relationships</option>
                <option value="4">Work Life</option>
                <option value="6">Sports</option>
            </select>
            </div>
            <button type="submit" class="btn-submit">Upload Meme</button>
            <div class="status-message" id="upload-message" style="display: none;"></div>
        </form>
        </div>
    </div>

   <!-- Enhanced Profile Modal -->
<div id="profile-modal" class="reveal large" data-reveal>
    <div class="modal-header">
        <button class="close-button" data-close aria-label="Close modal" type="button">
            <span aria-hidden="true">&times;</span>
        </button>
        <div class="user-profile-avatar" style="width: 80px; height: 80px; line-height: 80px; font-size: 2rem;">
            U
        </div>
        <h4 class="profile-username">Username</h4>
        <p class="profile-email">user@example.com</p>
    </div>
    <div class="modal-body">
        <div class="profile-stats">
            <div class="cell small-4 text-center stat-item">
                <div class="stat-number">0</div>
                <div class="stat-label">Memes Posted</div>
            </div>
            <div class="cell small-4 text-center stat-item">
                <div class="stat-number">0</div>
                <div class="stat-label">Total Votes</div>
            </div>
            <div class="cell small-4 text-center stat-item">
                <div class="stat-number">0</div>
                <div class="stat-label">Total Likes</div>
            </div>
        </div>
        
        <div class="profile-actions" id="profile-actions">
            <!-- Buttons will be dynamically populated -->
        </div>
    </div>
</div>

<!-- Edit Profile Modal -->
<div id="edit-profile-modal" class="reveal" data-reveal>
    <div class="modal-header">
        <button class="modal-close" data-close aria-label="Close modal" type="button">&times;</button>
        <h2 class="modal-title">Edit Your Profile</h2>
        <p class="modal-subtitle">Update your account details securely</p>
    </div>
    <div class="modal-body">
        <form id="edit-profile-form">
            <div class="form-group">
                <label class="form-label" for="edit-username">Username</label>
                <div class="input-container">
                    <input type="text" id="edit-username" class="form-input" placeholder="Enter your username" disabled>
                    <i class="fas fa-user input-icon"></i>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label" for="edit-email">Email Address</label>
                <div class="input-container">
                    <input type="email" id="edit-email" class="form-input" placeholder="Enter your email" required>
                    <i class="fas fa-envelope input-icon"></i>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label" for="edit-current-password">Current Password</label>
                <div class="input-container">
                    <input type="password" id="edit-current-password" class="form-input" placeholder="Enter current password" required>
                    <i class="fas fa-lock input-icon"></i>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label" for="edit-new-password">New Password</label>
                <div class="input-container">
                    <input type="password" id="edit-new-password" class="form-input" placeholder="Enter new password">
                    <i class="fas fa-eye password-toggle input-icon" onclick="togglePassword('edit-new-password', this)"></i>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label" for="edit-confirm-password">Confirm New Password</label>
                <div class="input-container">
                    <input type="password" id="edit-confirm-password" class="form-input" placeholder="Confirm new password">
                    <i class="fas fa-eye password-toggle input-icon" onclick="togglePassword('edit-confirm-password', this)"></i>
                </div>
            </div>

            <button type="submit" class="btn-primary">Save Changes</button>
            <div class="status-message" id="edit-profile-status"></div>
        </form>
    </div>
</div>


<!-- My Memes Modal -->
<div id="my-memes-modal" class="reveal large" data-reveal>
    <div class="modal-header">
        <h2 class="modal-title">
            <i class="fas fa-images"></i>
            My Memes
        </h2>
        <button class="modal-close" data-close aria-label="Close modal" type="button">&times;</button>
    </div>
    
    <div class="modal-body">
        <div id="my-memes-content">
            <!-- Content will be loaded dynamically -->
        </div>
    </div>
</div>

<!-- Edit Meme Modal -->
<div id="edit-meme-modal" class="reveal" data-reveal>
    <div class="modal-header">
        <h2 class="modal-title">Edit Meme</h2>
        <button class="modal-close" data-close aria-label="Close modal" type="button">&times;</button>
    </div>
    <div class="modal-body">
        <form id="edit-meme-form">
            <input type="hidden" id="edit-meme-id" name="meme_id">
            <div class="form-group">
                <label class="form-label" for="edit-meme-caption">Caption</label>
                <input type="text" id="edit-meme-caption" name="caption" class="form-input" placeholder="Enter new caption..." required>
            </div>
            <div class="form-group">
                <label class="form-label" for="edit-meme-category">Category</label>
                <select id="edit-meme-category" name="category" class="category-select" placeholder="Select a category" required>
                    <option value="" selected disabled>Select a category</option>
                    <option value="1">School Memes</option>
                    <option value="2">Jokes</option>
                    <option value="3">Relationships</option>
                    <option value="4">Work Life</option>
                    <option value="6">Sports</option>
                </select>
            </div>
            <button type="submit" class="button success">Update Meme</button>
            <div id="edit-meme-status" class="status-message"></div>
        </form>
    </div>
</div>



    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/foundation/6.7.5/js/foundation.min.js"></script>

    <script>
        window.currentUser = <?php echo isset($_SESSION['user']) ? json_encode($_SESSION['user']) : 'null'; ?>;
         $(document).foundation();
   
   
   </script>
    
    <script src="assets/js/script.js"></script>





</body>
</html>