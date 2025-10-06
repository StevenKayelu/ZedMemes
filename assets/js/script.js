// Add this JavaScript code to your existing script.js file

// Theme Management Class (Defined outside DOMContentLoaded for clarity and scope)
class ThemeManager {
    constructor() {
        this.init();
    }

    init() {
        // Check for saved theme preference or default to light mode
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
        
        // Add event listener to theme toggle button
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateToggleButton(theme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        
        // Add a subtle animation to the toggle button
        const toggleButton = document.getElementById('theme-toggle');
        if (toggleButton) {
            toggleButton.style.transform = 'scale(0.9)';
            setTimeout(() => {
                toggleButton.style.transform = '';
            }, 150);
        }
    }

    updateToggleButton(theme) {
        const toggleButton = document.getElementById('theme-toggle');
        const icon = toggleButton?.querySelector('i');
        
        if (icon) {
            if (theme === 'dark') {
                icon.className = 'fas fa-sun';
                toggleButton.title = 'Switch to light mode';
            } else {
                icon.className = 'fas fa-moon';
                toggleButton.title = 'Switch to dark mode';
            }
        }
    }

    getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme') || 'light';
    }
}

// Your main DOMContentLoaded block
document.addEventListener('DOMContentLoaded', () => {
    let currentPage = 1;
    const memesPerPage = 3;
    let totalMemes = 0;
    let totalPages = 0;

    // Initialize theme manager
    const themeManager = new ThemeManager(); // <--- CALL THE CLASS CONSTRUCTOR HERE
    window.themeManager = themeManager; // Make it globally accessible if needed

    // Initialize Foundation JS if it's still needed globally.
    if (typeof jQuery !== 'undefined' && typeof jQuery.fn.foundation !== 'undefined') {
        jQuery(document).foundation();
    }

    const currentUser = window.currentUser; // Access the globally set variable

    let currentFilter = 'latest'; // Default filter
    let currentCategory = 'all';  // Default category
    let currentSearchQuery = '';  // Default empty search query

    const filterTabs = document.querySelectorAll('.filter-tab');
    const categoryTabs = document.querySelectorAll('.category-tab');
    const searchInput = document.getElementById('search-input');
    const memeContainer = document.getElementById('meme-container'); // Container for displaying memes

    // --- Utility function for displaying messages ---
    function showMessage(elementId, message, type) {
        const messageElement = document.getElementById(elementId);
        if (messageElement) {
            messageElement.textContent = message;
            messageElement.className = 'status-message ' + type;
            messageElement.style.display = 'block';
            messageElement.classList.add('show-message');

            setTimeout(() => {
                messageElement.classList.remove('show-message');
                messageElement.style.display = 'none';
                messageElement.textContent = '';
                messageElement.className = 'status-message';
            }, 3000);
        }
    }
    // Alternative function for when you only have message and type (no element ID)
function showGlobalMessage(message, type) {
    // Create a temporary message element if no specific element is provided
    let messageElement = document.getElementById('global-message');
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.id = 'global-message';
        messageElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            padding: 10px 20px;
            border-radius: 4px;
            font-weight: bold;
            max-width: 300px;
            word-wrap: break-word;
        `;
        document.body.appendChild(messageElement);
    }
    
    messageElement.textContent = message;
    messageElement.className = 'status-message ' + type;
    
    // Set colors based on type
    if (type === 'success') {
        messageElement.style.backgroundColor = '#d4edda';
        messageElement.style.color = '#155724';
        messageElement.style.border = '1px solid #c3e6cb';
    } else if (type === 'error') {
        messageElement.style.backgroundColor = '#f8d7da';
        messageElement.style.color = '#721c24';
        messageElement.style.border = '1px solid #f5c6cb';
    } else if (type === 'info') {
        messageElement.style.backgroundColor = '#d1ecf1';
        messageElement.style.color = '#0c5460';
        messageElement.style.border = '1px solid #bee5eb';
    }
    
    messageElement.style.display = 'block';
    messageElement.classList.add('show-message');

    setTimeout(() => {
        messageElement.classList.remove('show-message');
        messageElement.style.display = 'none';
        messageElement.textContent = '';
        messageElement.className = 'status-message';
    }, 3000);
}


     // Sign In button
    document.getElementById('signin-btn')?.addEventListener('click', () => {
        console.log("Sign In button clicked");
        openModal('login');
    });

    // Sign Up button
    document.getElementById('signup-btn')?.addEventListener('click', () => {
        console.log("Sign Up button clicked");
        openModal('signup');
    });

    // Upload button
    document.getElementById('upload-btn')?.addEventListener('click', () => {
        console.log("Upload button clicked");
        if (!window.currentUser || !currentUser.id) {
            alert("Please sign in to upload memes");
            openModal('login');
        } else {
            openModal('upload');
        }
    });

    // Outside click to close
    window.addEventListener('click', (e) => {
        document.querySelectorAll('.modal-overlay.active').forEach(modal => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    });

    // --- File upload functionality (Upload Modal) ---
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('meme-file');
    const imagePreview = document.getElementById('image-preview');
    const previewImg = document.getElementById('preview-img');

    if (uploadArea) {
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFileSelect(files[0]);
            }
        });
    }

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFileSelect(e.target.files[0]);
            }
        });
    }

    function handleFileSelect(file) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImg.src = e.target.result;
                uploadArea.style.display = 'none';
                imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            showMessage('upload-message', 'Please select a valid image file.', 'error');
        }
    }

    // --- Login form submission (RESTORED to use fetch) ---
    document.getElementById('login-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const statusDiv = document.getElementById('login-status');
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        form.classList.add('loading'); // Add loading state
        showMessage('login-status', 'Logging in...', 'info'); // Show info message

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        const url = 'login.php'; // Assuming login.php is in the same directory

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json(); // Attempt to read error message
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                showMessage('login-status', data.message, 'success');
                setTimeout(() => {
                    location.reload(); // Reload to update header and load memes for logged-in user
                }, 1000);
            } else {
                showMessage('login-status', data.message, 'error');
            }
        } catch (error) {
            console.error('Login Error:', error);
            showMessage('login-status', error.message || 'An error occurred during login. Please try again.', 'error');
        } finally {
            form.classList.remove('loading'); // Remove loading state
        }
    });

    // --- Signup form submission (RESTORED to use fetch) ---
 // --- Signup form submission ---
    document.getElementById('signup-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const username = document.getElementById('signup-username').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm').value;

        if (password !== confirmPassword) {
            showMessage('signup-status', 'Passwords do not match!', 'error');
            return;
        }

        form.classList.add('loading');
        showMessage('signup-status', 'Creating account...', 'info');

        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);

        try {
            const response = await fetch('register.php', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                showMessage('signup-status', data.message || 'Account created successfully!', 'success');
                setTimeout(() => {
                    switchModal('signup', 'login');
                }, 1500);
            } else {
                showMessage('signup-status', data.message || 'Registration failed. Please try again.', 'error');
            }
        } catch (error) {
            showMessage('signup-status', error.message || 'An error occurred during signup. Please try again.', 'error');
        } finally {
            form.classList.remove('loading');
        }
    });

    // --- Logout Button ---
    document.getElementById('logout-btn')?.addEventListener('click', async () => {
        try {
            const response = await fetch('logout.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            if (data.success) {
                location.reload();
            } else {
                alert(data.message || 'Logout failed.');
            }
        } catch (error) {
            console.error('Logout fetch error:', error);
            alert('An error occurred during logout.');
        }
    });

    // --- Upload form submission ---
    document.getElementById('upload-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const statusDiv = document.getElementById('upload-message'); // Ensure this ID is correct for upload status
        const fileInput = document.getElementById('meme-file'); // Re-declare for scope if needed

        if (!fileInput.files[0]) {
            showMessage('upload-message', 'Please select an image first.', 'error');
            return;
        }

        form.classList.add('loading');
        showMessage('upload-message', 'Uploading meme...', 'info');

        const formData = new FormData(e.target);

        try {
            const response = await fetch('upload_meme.php', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                showMessage('upload-message', 'Meme uploaded successfully!', 'success');
                setTimeout(() => {
                    closeModal('upload'); // Pass 'upload'
                    fetchMemes(); // Re-fetch memes to show the new upload
                }, 1000);
            } else {
                showMessage('upload-message', data.message, 'error');
            }
        } catch (error) {
            console.error('Upload Error:', error);
            showMessage('upload-message', error.message || 'An error occurred during upload. Please try again.', 'error');
        } finally {
            form.classList.remove('loading');
        }
    });

    // -- Main meme fetching and display functions ---
    async function fetchMemes() {
        //currentPage = 1;
        memeContainer.innerHTML = '<p class="loading-message">Loading memes...</p>';

        const url = `fetch_memes.php?filter=${currentFilter}&category=${currentCategory}&search=${encodeURIComponent(currentSearchQuery)}`;
       
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            
            if (data.success) {
                try {   
                        displayMemes(data.memes);
                    } catch (e) {
                        console.error('Error rendering memes:', e);
                    }

            } else {
                memeContainer.innerHTML = `<p class="error-message">Error: ${data.message || 'Failed to load memes.'}</p>`;
                console.error('Error fetching memes:', data.message);
            }
        } catch (error) {
            memeContainer.innerHTML = '<p class="error-message">An unexpected error occurred. Please try again later.</p>';
            console.error('Fetch error:', error);
        }
    }

        function formatRelativeTime(timestamp) {
        const now = new Date();
        const past = new Date(timestamp);
        const diffInMs = now - past;
        const diffInSeconds = Math.floor(diffInMs / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);
        const diffInWeeks = Math.floor(diffInDays / 7);
        const diffInMonths = Math.floor(diffInDays / 30);
        const diffInYears = Math.floor(diffInDays / 365);

        if (diffInSeconds < 60) {
            return "now";
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
        } else if (diffInDays < 7) {
            return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
        } else if (diffInWeeks < 4) {
            return `${diffInWeeks} week${diffInWeeks !== 1 ? 's' : ''} ago`;
        } else if (diffInMonths < 12) {
            return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
        } else {
            return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
        }
    }
// Replace your existing displayMemes function with this updated version
function displayMemes(memes) {
    memeContainer.innerHTML = ''; // Clear previous memes
    
    if (memes.length === 0) {
        memeContainer.innerHTML = '<p class="no-memes-found">No memes found on this selection.</p>';
        updatePaginationControls(0);
        return;
    }
    
    // Calculate pagination
    totalMemes = memes.length;
    totalPages = Math.ceil(totalMemes / memesPerPage);
    
    // Get memes for current page
    const startIndex = (currentPage - 1) * memesPerPage;
    const endIndex = startIndex + memesPerPage;
    const memesForPage = memes.slice(startIndex, endIndex);
    
    console.log(memes.category_name);
    
    // Create scroll to top button
    createScrollToTopButton();
    
    // Create floating category navigation
    createFloatingCategoryNav();

    memesForPage.forEach((meme, index) => {
        const memeCard = document.createElement('div');
        memeCard.classList.add('cell');
        memeCard.style.setProperty('--index', index);
// Function to format timestamp as relative time
        memeCard.innerHTML = `
            <div class="meme-card floating-animation">
                <div class="meme-header" data-user-id="${meme.uploader_id}">
                    <div class="user-avatar" data-user="${meme.uploader_username}">
                        ${meme.uploader_username ? meme.uploader_username.substring(0, 1).toUpperCase() : '??'}
                    </div>
                    <div>
                        <h3 class="meme-title">${meme.caption}</h3>
                        <div class="meme-meta">
                            <span>by ${meme.uploader_username ? meme.uploader_username: '??'}</span>
                            <span>•</span>
                            <span>${formatRelativeTime(meme.timestamp)}</span>
                            <span class="category-badge" data-category="${meme.category_name}">${meme.category_name}</span>
                        </div>
                    </div>
                </div>
                <img src="./uploads/${meme.filename}" alt="${meme.caption}" class="meme-image">
                <div class="meme-actions">
                    <div class="reaction-group">
                        <button class="reaction-btn like-btn" data-meme-id="${meme.id}" data-reaction-type="like">
                            <i class="fas fa-thumbs-up"></i> <span class="reaction-count">${meme.likes}</span>
                        </button>
                        <button class="reaction-btn upvote-btn" data-meme-id="${meme.id}" data-reaction-type="upvote">
                            <i class="fas fa-arrow-up"></i> <span class="reaction-count">${meme.upvotes}</span>
                        </button>
                    </div>
                    <div class="action-group">
                        <button class="action-btn share-btn">
                            <i class="fas fa-share"></i>
                        </button>
                        <button class="action-btn download-btn" data-image="uploads/${meme.filename}">
                            <i class="fas fa-download"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        memeContainer.appendChild(memeCard);

        // Add interesting demarcation text after every 6 memes
        if ((index + 1) % 6 === 0 && index < memesForPage.length - 1) {
            const demarcationCard = createDemarcationCard(index);
            memeContainer.appendChild(demarcationCard);
        }
    });

    // Update pagination controls
    updatePaginationControls(totalPages);
    
    attachReactionListeners();
    attachUserProfileListeners();
    attachCategoryNavigationListeners();
    attachDemarcationButtonListeners();
    initScrollToTop();
}

// New function to create pagination controls
function createPaginationControls() {
    const paginationContainer = document.createElement('div');
    paginationContainer.id = 'pagination-controls';
    paginationContainer.className = 'pagination-controls';
    
    paginationContainer.innerHTML = `
        <div class="pagination-info">
            <span id="pagination-info-text">Showing 0 of 0 memes</span>
        </div>
        <div class="pagination-buttons">
            <button id="prev-page" class="pagination-btn" disabled>
                <i class="fas fa-chevron-left"></i> Previous
            </button>
            <span id="page-info">Page 1 of 1</span>
            <button id="next-page" class="pagination-btn" disabled>
                Next <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    `;
    
    return paginationContainer;
}

// New function to update pagination controls
function updatePaginationControls(pages) {
    let paginationControls = document.getElementById('pagination-controls');
    
    if (!paginationControls) {
        paginationControls = createPaginationControls();
        // Insert after meme container
        memeContainer.parentNode.insertBefore(paginationControls, memeContainer.nextSibling);
    }
    
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');
    const paginationInfo = document.getElementById('pagination-info-text');
    
    if (pages <= 1) {
        paginationControls.style.display = 'none';
        return;
    }
    
    paginationControls.style.display = 'flex';
    
    // Update buttons
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === pages;
    
    // Update page info
    pageInfo.textContent = `Page ${currentPage} of ${pages}`;
    
    // Update pagination info
    const startItem = (currentPage - 1) * memesPerPage + 1;
    const endItem = Math.min(currentPage * memesPerPage, totalMemes);
    paginationInfo.textContent = `Showing ${startItem}-${endItem} of ${totalMemes} memes`;
    
    // Add event listeners
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            fetchMemes();
        }
    };
    
    nextBtn.onclick = () => {
        if (currentPage < pages) {
            currentPage++;
            fetchMemes();
        }
    };
}

// Update your existing fetchMemes function to reset pagination on new searches
// Add this line at the beginning of your fetchMemes function:
// currentPage = 1; // Reset to first page when fetching new data

// Add this function to reset pagination when filters change
function resetPagination() {
    currentPage = 1;
    const paginationControls = document.getElementById('pagination-controls');
    if (paginationControls) {
        paginationControls.style.display = 'none';
    }
}

// Create scroll to top button
function createScrollToTopButton() {
    // Remove existing button if it exists
    const existingBtn = document.getElementById('scroll-to-top');
    if (existingBtn) {
        existingBtn.remove();
    }

    const scrollBtn = document.createElement('button');
    scrollBtn.id = 'scroll-to-top';
    scrollBtn.className = 'scroll-to-top-btn';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.title = 'Scroll to top';
    scrollBtn.style.display = 'none';
    
    document.body.appendChild(scrollBtn);
}

// Initialize scroll to top functionality
function initScrollToTop() {
    const scrollBtn = document.getElementById('scroll-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'flex';
        } else {
            scrollBtn.style.display = 'none';
        }
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Create floating category navigation
function createFloatingCategoryNav() {
    // Remove existing nav if it exists
    const existingNav = document.getElementById('floating-category-nav');
    if (existingNav) {
        existingNav.remove();
    }

    const floatingNav = document.createElement('div');
    floatingNav.id = 'floating-category-nav';
    floatingNav.className = 'floating-category-nav';
    floatingNav.innerHTML = `
        <div class="floating-nav-toggle">
            <i class="fas fa-filter"></i>
        </div>
        <div class="floating-nav-content">
            <div class="nav-item" data-category="all">
                <i class="fas fa-th"></i>
                <span>All</span>
            </div>
            <div class="nav-item" data-category="school">
                <i class="fas fa-graduation-cap"></i>
                <span>School</span>
            </div>
            <div class="nav-item" data-category="jokes">
                <i class="fas fa-laugh"></i>
                <span>Jokes</span>
            </div>
            <div class="nav-item" data-category="relationships">
                <i class="fas fa-heart"></i>
                <span>Love</span>
            </div>
            <div class="nav-item" data-category="work">
                <i class="fas fa-briefcase"></i>
                <span>Work</span>
            </div>
            <div class="nav-item" data-category="trending">
                <i class="fas fa-fire"></i>
                <span>Trending</span>
            </div>
            <div class="nav-item" data-category="sports">
                <i class="fas fa-futbol"></i>
                <span>Sports</span>
            </div>
        </div>
    `;
    
    document.body.appendChild(floatingNav);
}
// Create demarcation cards with interesting content
function createDemarcationCard(index) {
    const demarcationTexts = [
        {
            title: "🚀 Meme Break!",
            subtitle: "You've scrolled through some amazing content!",
            content: "Take a moment to appreciate the creativity of our ZedMemes community. Every meme tells a story!"
        },
        {
            title: "💡 Did You Know?",
            subtitle: "Fun fact about memes",
            content: "The word 'meme' was coined by Richard Dawkins in 1976. Who knew it would become this awesome!"
        },
        {
            title: "🎯 Keep Going!",
            subtitle: "More laughs await below",
            content: "You're doing great! There are more hilarious memes waiting for you. Keep scrolling for more fun!"
        },
        {
            title: "⭐ Community Love",
            subtitle: "Powered by amazing creators",
            content: "Every meme you see is crafted by our talented community. Don't forget to show some love with your votes!"
        },
        {
            title: "🔥 Trending Alert",
            subtitle: "Hot content incoming",
            content: "The next batch of memes is absolutely fire! Get ready for some serious laughs ahead."
        },
        {
            title: "🎉 Celebration Time",
            subtitle: "You're part of something special",
            content: "Thank you for being part of the ZedMemes family! Your engagement makes this community awesome."
        }
    ];

    const randomText = demarcationTexts[Math.floor(Math.random() * demarcationTexts.length)];
    
    const demarcationCard = document.createElement('div');
    demarcationCard.className = 'cell small-12 demarcation-cell';
    demarcationCard.innerHTML = `
        <div class="demarcation-card">
            <div class="demarcation-content">
                <h3 class="demarcation-title">${randomText.title}</h3>
                <p class="demarcation-subtitle">${randomText.subtitle}</p>
                <p class="demarcation-text">${randomText.content}</p>
                <div class="demarcation-actions">
                    <button class="demarcation-btn" data-action="trending">
                        <i class="fas fa-fire"></i> Check Trending
                    </button>
                    <button class="demarcation-btn" data-action="scroll-top">
                        <i class="fas fa-arrow-up"></i> Back to Top
                    </button>
                </div>
            </div>
            <div class="demarcation-decoration">
                <div class="decoration-element"></div>
                <div class="decoration-element"></div>
                <div class="decoration-element"></div>
            </div>
        </div>
    `;
    
    return demarcationCard;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Updated profile modal population function
    async function openUserProfileModalDelegation(userId) {
        try {
            console.log('Opening profile for user ID:', userId);
            
            const response = await fetch(`get_user_profile.php?user_id=${userId}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            
            if (data.success) {
                const user = data.user;
                const profileModal = document.getElementById('profile-modal');
                
                // Update profile info
                const profileAvatar = profileModal.querySelector('.user-profile-avatar');
                const profileUsername = profileModal.querySelector('.profile-username');
                const profileEmail = profileModal.querySelector('.profile-email');
                const profileStats = profileModal.querySelector('.profile-stats');
                const profileActions = document.getElementById('profile-actions');
                
                if (profileAvatar) profileAvatar.textContent = user.username?.charAt(0).toUpperCase() || 'U';
                if (profileUsername) profileUsername.textContent = user.username || 'Unknown';
                if (profileEmail) profileEmail.textContent = user.email || 'N/A';
                
                if (profileStats) {
                    profileStats.innerHTML = `
                        <div class="cell small-4 text-center stat-item">
                            <div class="stat-number">${user.meme_count || 0}</div>
                            <div class="stat-label">Memes Posted</div>
                        </div>
                        <div class="cell small-4 text-center stat-item">
                            <div class="stat-number">${user.total_votes || 0}</div>
                            <div class="stat-label">Total Votes</div>
                        </div>
                        <div class="cell small-4 text-center stat-item">
                            <div class="stat-number">${user.total_likes || 0}</div>
                            <div class="stat-label">Total Likes</div>
                        </div>
                    `;
                }
                
                const isCurrentUser = currentUser && parseInt(currentUser.id) === parseInt(userId);
                if (profileActions) {
                    profileActions.innerHTML = isCurrentUser
                        ? `
                            <button class="button success" id="my-memes-btn">
                                <i class="fas fa-images"></i> My Memes
                            </button>
                            <button class="button success" id="edit-profile-btn">
                                <i class="fas fa-edit"></i> Edit Profile
                            </button>
                            <button class="button alert" id="profile-logout-btn">
                                <i class="fas fa-sign-out-alt"></i> Logout
                            </button>
                        `
                        : `
                            <button class="button secondary" disabled>
                                <i class="fas fa-eye"></i> Viewing Profile
                            </button>
                        `;
                }
                
                // Attach event listeners
                if (isCurrentUser) {
                    document.getElementById('my-memes-btn')?.addEventListener('click', openMyMemesModal);
                    document.getElementById('edit-profile-btn')?.addEventListener('click', openEditProfileModal);
                    document.getElementById('profile-logout-btn')?.addEventListener('click', handleProfileModalLogout);
                }
                
                // Open the modal
                $('#profile-modal').foundation('open');
                
            } else {
                console.error('Error fetching profile:', data.message);
                showGlobalMessage('Error loading profile: ' + data.message, 'error');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            showGlobalMessage('Error loading profile. Please try again.', 'error');
        }
    }

    
    // My Memes Modal Functions
   // 2. Fixed My Memes modal error handling
    async function openMyMemesModal() {
        try {
            const response = await fetch('get_user_memes.php');

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            const contentDiv = document.getElementById('my-memes-content');

            if (data.success) {
                if (data.meme && data.meme.length > 0) {
                    contentDiv.innerHTML = data.meme.map(meme => `
                        <div class="meme-card floating-animation" data-meme-id="${meme.id}">
                            <div class="meme-header" data-user-id="${meme.uploader_id}">
                                <div class="user-avatar" data-user="${meme.uploader_username}">
                                    ${meme.uploader_username ? meme.uploader_username.substring(0, 1).toUpperCase() : '??'}
                                </div>
                                <div>
                                    <h3 class="meme-title">${meme.caption}</h3>
                                    <div class="meme-meta">
                                        <span>by ${meme.uploader_username || '??'}</span>
                                        <span>•</span>
                                        <span>${meme.timestamp}</span>
                                        <span class="category-badge" data-category="${meme.category_name}">${meme.category_name}</span>
                                    </div>
                                </div>
                            </div>
                            <img src="./uploads/${meme.filename}" alt="${meme.caption}" class="meme-image">
                            
                            <div class="meme-actions">
                                <div class="reaction-group">
                                    <button class="reaction-btn like-btn" data-meme-id="${meme.id}" data-reaction-type="like">
                                        <i class="fas fa-thumbs-up"></i> <span class="reaction-count">${meme.likes}</span>
                                    </button>
                                    <button class="reaction-btn upvote-btn" data-meme-id="${meme.id}" data-reaction-type="upvote">
                                        <i class="fas fa-arrow-up"></i> <span class="reaction-count">${meme.upvotes}</span>
                                    </button>
                                </div>
                                <div class="action-group">
                                    <button class="action-btn share-btn">
                                        <i class="fas fa-share"></i>
                                    </button>
                                    <button class="action-btn download-btn" data-image="uploads/${meme.filename}">
                                        <i class="fas fa-download"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="meme-actions admin-actions">
                                <button class="btn btn-edit" onclick="editMeme(${meme.id}, '${meme.caption.replace(/'/g, "\\'")}', '${meme.category_name.replace(/'/g, "\\'")}')">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                                <button class="btn btn-delete" onclick="deleteMeme(${meme.id})">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </div>
                        </div>
                    `).join('');

                    // Attach reaction listeners immediately after HTML injection
                    attachReactionListeners();
                    attachUserProfileListeners();
                    attachCategoryNavigationListeners();
                    attachDemarcationButtonListeners();
                    initScrollToTop();

                } else {
                    contentDiv.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-image"></i>
                            <h3>No memes yet</h3>
                            <p>You haven't uploaded any memes yet. Start sharing your creativity!</p>
                            <button class="button primary" onclick="$('#my-memes-modal').foundation('close'); $('#upload-modal').foundation('open');">
                                <i class="fas fa-upload"></i> Upload Your First Meme
                            </button>
                        </div>
                    `;
                }
            }
            $('#my-memes-modal').foundation('open');

        } catch (error) {
            console.error('Error loading user memes:', error);
            showGlobalMessage('Error loading your memes. Please try again.', 'error');
        }
    }

    
    // Edit Meme Function
    window.editMeme = function(memeId, caption, category) {
        document.getElementById('edit-meme-id').value = memeId;
        document.getElementById('edit-meme-caption').value = caption;
        document.getElementById('edit-meme-category').value = category;

        $('#edit-meme-modal').foundation('open');
    };

    // Delete Meme Function
    window.deleteMeme = async function(memeId) {
        if (!confirm('Are you sure you want to delete this meme? This action cannot be undone.')) return;

        try {
            const response = await fetch('delete_meme.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: memeId })
            });
            const data = await response.json();

            if (data.success) {
                showGlobalMessage('Meme deleted successfully!', 'success');

                // Remove meme card from DOM
                const memeCard = document.querySelector(`.meme-card[data-meme-id="${memeId}"]`);
                if (memeCard) memeCard.remove();

                // Check if container is empty, then show empty state
                const contentDiv = document.getElementById('my-memes-content');
                if (contentDiv && contentDiv.children.length === 0) {
                    contentDiv.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-image"></i>
                            <h3>No memes yet</h3>
                            <p>You haven't uploaded any memes yet. Start sharing your creativity!</p>
                            <button class="button primary" onclick="$('#my-memes-modal').foundation('close'); $('#upload-modal').foundation('open');">
                                <i class="fas fa-upload"></i> Upload Your First Meme
                            </button>
                        </div>
                    `;
                }
            } else {
                showGlobalMessage('Error deleting meme: ' + data.message, 'error');
            }
        } catch (error) {
            console.error('Error deleting meme:', error);
            showGlobalMessage('Error deleting meme. Please try again.', 'error');
        }
    };


    
    // Edit Meme Form Submission
    document.getElementById('edit-meme-form')?.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        
        try {
            const response = await fetch('update_meme.php', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                showMessage('edit-meme-status', 'Meme updated successfully!', 'success');
                
                // Update the meme card in My Memes modal
                const memeId = formData.get('meme_id');
                const memeCard = document.querySelector(`[data-meme-id="${memeId}"]`);
                if (memeCard) {
                    const caption = memeCard.querySelector('.meme-caption');
                    const category = memeCard.querySelector('.meme-category');
                    if (caption) caption.textContent = formData.get('caption');
                    if (category) category.textContent = formData.get('category');
                }
                
                // Close the edit modal after a delay
                setTimeout(() => {
                    $('#edit-meme-modal').foundation('close');
                }, 1500);
                
            } else {
                showMessage('edit-meme-status', 'Error updating meme: ' + data.message, 'error');
            }
        } catch (error) {
            console.error('Error updating meme:', error);
            showMessage('edit-meme-status', 'Error updating meme. Please try again.', 'error');
        }
    });
    
    // Make functions available globally
    window.openUserProfileModalDelegation = openUserProfileModalDelegation;
    window.openMyMemesModal = openMyMemesModal;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Attach category navigation listeners
function attachCategoryNavigationListeners() {
    const floatingNav = document.getElementById('floating-category-nav');
    const toggle = floatingNav.querySelector('.floating-nav-toggle');
    const content = floatingNav.querySelector('.floating-nav-content');
    
    toggle.addEventListener('click', () => {
        content.classList.toggle('active');
    });
    
    // Add click listeners to nav items
    const navItems = floatingNav.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const category = e.currentTarget.dataset.category;
            scrollToCategory(category);
            content.classList.remove('active');
        });
    });
}

// Attach demarcation button listeners
function attachDemarcationButtonListeners() {
    const demarcationBtns = document.querySelectorAll('.demarcation-btn');
    demarcationBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.currentTarget.dataset.action;
            if (action === 'trending') {
                scrollToCategory('trending');
            } else if (action === 'scroll-top') {
                scrollToTop();
            }
        });
    });
}

// Scroll to category function
function scrollToCategory(category) {
    // First try to find the category tab in the main navigation
    const categoryTab = document.querySelector(`.category-tab[data-category="${category}"]`);
    if (categoryTab) {
        categoryTab.click();
        // Scroll to the search controls area
        const searchControls = document.querySelector('.search-controls');
        if (searchControls) {
            searchControls.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    } else {
        // If category tab not found, try filter tabs
        const filterTab = document.querySelector(`.filter-tab[data-filter="${category}"]`);
        if (filterTab) {
            filterTab.click();
            const searchControls = document.querySelector('.search-controls');
            if (searchControls) {
                searchControls.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }
}

// Smooth scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

    // --- Event Listeners for Filter Tabs ---
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            resetPagination();
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            fetchMemes();
        });
    });

    // --- Event Listeners for Category Tabs ---
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            resetPagination();
            categoryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            fetchMemes();
        });
    });

    // --- Event Listeners for Search ---
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            resetPagination();
            const newSearchQuery = searchInput.value.trim();
            if (newSearchQuery !== currentSearchQuery) {
                currentSearchQuery = newSearchQuery;
                fetchMemes();
            }
        }, 300);
    });

    // --- Reaction Button Logic ---
    function attachReactionListeners() {
        memeContainer.removeEventListener('click', handleReactionDelegation);
        memeContainer.addEventListener('click', handleReactionDelegation);
    }

  // 4. Fixed reaction handler
    async function handleReactionDelegation(event) {
        const button = event.target.closest('.reaction-btn');
        if (!button) return;

        const memeId = button.dataset.memeId;
        const reactionType = button.dataset.reactionType;

        if (!currentUser || !currentUser.id) {
            openModal('login');
            return;
        }

        if (memeId === '0') return;

        try {
            const formData = new FormData();
            formData.append('meme_id', memeId);
            formData.append('reaction', reactionType);

            const response = await fetch('react.php', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                const countSpan = button.querySelector('.reaction-count');
                if (countSpan && data.counts) {
                    const countKey = reactionType + 's';
                    if (data.counts.hasOwnProperty(countKey)) {
                        countSpan.textContent = data.counts[countKey];
                    }
                }
                button.classList.add('reaction-animation');
                setTimeout(() => button.classList.remove('reaction-animation'), 600);
            } else {
                showGlobalMessage(data.message || 'An error occurred while reacting.', 'error');
            }
        } catch (error) {
            console.error('Error processing reaction:', error);
            showGlobalMessage(error.message || 'An error occurred while reacting. Please try again.', 'error');
        }
    }


    // --- Download functionality (using event delegation) ---
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.download-btn');
        if (btn) {
            const imageUrl = btn.dataset.image;
            if (imageUrl) {
                const link = document.createElement('a');
                link.href = imageUrl;
                const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    });

    // --- Share functionality (using event delegation) ---
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.share-btn');
        if (btn) {
            if (navigator.share) {
                navigator.share({
                    title: 'Check out this meme!',
                    url: window.location.href
                }).catch(error => console.error('Error sharing:', error));
            } else {
                navigator.clipboard.writeText(window.location.href).then(() => {
                    alert('Link copied to clipboard!');
                }).catch(err => console.error('Could not copy text: ', err));
            }
        }
    });

   // --- User Profile Modal Logic ---
const userProfileModal = document.getElementById('profile-modal');
const profileUsername = userProfileModal?.querySelector('.profile-username');
const profileEmail = userProfileModal?.querySelector('.profile-email');
const profileAvatar = userProfileModal?.querySelector('.user-profile-avatar');
const profileStats = userProfileModal?.querySelector('.profile-stats');
const profileActions = document.getElementById('profile-actions');

// Handle opening profile modal from navbar/profile button
document.getElementById('profile-btn')?.addEventListener('click', () => {
    if (!currentUser || !currentUser.id) {
        openModal('login');
        return;
    }

    openUserProfileModalDelegation(currentUser.id); // use ID directly
});

// Delegate click listeners to open other user profiles
function attachUserProfileListeners() {
    memeContainer?.removeEventListener('click', handleAvatarClick);
    memeContainer?.addEventListener('click', handleAvatarClick);
}

// Extract and pass userId to the modal logic
function handleAvatarClick(event) {
    const avatar = event.target.closest('.user-avatar');
    if (!avatar || !avatar.dataset.user) return;

    const memeHeader = avatar.closest('.meme-header');
    const userId = memeHeader?.dataset.userId;

    if (userId) {
        openUserProfileModalDelegation(userId);
    }
}

// Main function to open profile modal and populate data
// async function openUserProfileModalDelegation(userId) {
//     try {
//         console.log('Opening profile for user ID:', userId);
//         console.log(document.getElementById('profile-modal'));
        

//         const response = await fetch(`get_user_profile.php?user_id=${userId}`);
//         if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//         const data = await response.json();

//         if (data.success) {
//             const user = data.user;

//             if (profileAvatar) profileAvatar.textContent = user.username?.charAt(0).toUpperCase() || 'U';
//             if (profileUsername) profileUsername.textContent = user.username || 'Unknown';
//             if (profileEmail) profileEmail.textContent = user.email || 'N/A';

//             if (profileStats) {
//                 profileStats.innerHTML = `
//                     <div class="cell small-4 text-center stat-item">
//                         <div class="stat-number h4">${user.meme_count || 0}</div>
//                         <div class="stat-label">Memes Posted</div>
//                     </div>
//                     <div class="cell small-4 text-center stat-item">
//                         <div class="stat-number h4">${user.total_votes || 0}</div>
//                         <div class="stat-label">Total Votes</div>
//                     </div>
//                     <div class="cell small-4 text-center stat-item">
//                         <div class="stat-number h4">${user.total_likes || 0}</div>
//                         <div class="stat-label">Total Likes</div>
//                     </div>
//                 `;
//             }

//             const isCurrentUser = currentUser && parseInt(currentUser.id) === parseInt(userId);
//             if (profileActions) {
//                 profileActions.innerHTML = isCurrentUser
//                     ? `
//                         <button class="button primary small" id="edit-profile-btn">
//                             <i class="fas fa-edit"></i> Edit Profile
//                         </button>
//                         <button class="button alert small" id="profile-logout-btn">
//                             <i class="fas fa-sign-out-alt"></i> Logout
//                         </button>
//                     `
//                     : `
//                         <button class="button secondary small" disabled>
//                             <i class="fas fa-eye"></i> Viewing Profile
//                         </button>
//                     `;
//             }

//             // Attach listeners after rendering buttons
//             document.getElementById('edit-profile-btn')?.addEventListener('click', openEditProfileModal);
//             document.getElementById('profile-logout-btn')?.addEventListener('click', handleProfileModalLogout);

//             openModal('profile');
//         } else {
//             console.error('Error fetching profile:', data.message);
//             showMessage('Error loading profile: ' + data.message, 'error');
//         }
//     } catch (error) {
//         console.error('Fetch error for profile modal:', error);
//         showMessage('Error loading profile. Please try again.', 'error');
//     }
// }

// Logout from profile modal
async function handleProfileModalLogout() {
    try {
        const response = await fetch('logout.php', { method: 'POST' });
        const data = await response.json();
        if (data.success) {
            location.reload();
        } else {
            showGlobalMessage(data.message || 'Logout failed.', 'error');
        }
    } catch (err) {
        console.error('Logout error:', err);
        showGlobalMessage('Logout failed. Please try again.', 'error');
    }
}

// Edit Profile modal: fill current values
function openEditProfileModal() {
    if (!currentUser) {
        openModal('login');
        return;
    }

    const usernameInput = document.getElementById('edit-username');
    const emailInput = document.getElementById('edit-email');
    const currentPasswordInput = document.getElementById('edit-current-password');
    const newPasswordInput = document.getElementById('edit-new-password');
    const confirmPasswordInput = document.getElementById('edit-confirm-password');

    if (!usernameInput || !emailInput || !currentPasswordInput || !newPasswordInput || !confirmPasswordInput) {
        console.error('One or more Edit Profile form fields are missing in the DOM.');
        return;
    }

    usernameInput.value = currentUser.username || '';
    emailInput.value = currentUser.email || '';
    currentPasswordInput.value = '';
    newPasswordInput.value = '';
    confirmPasswordInput.value = '';

    closeModal('profile'); // optional: if you want to close profile modal first
    $('#edit-profile-modal').foundation('open');
}

// Handle edit profile form submission
// Handle edit profile form submission
async function handleEditProfileSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const statusDiv = document.getElementById('edit-profile-status');

    const username = document.getElementById('edit-username').value.trim();
    const email = document.getElementById('edit-email').value.trim();
    const currentPassword = document.getElementById('edit-current-password').value;
    const newPassword = document.getElementById('edit-new-password').value;
    const confirmPassword = document.getElementById('edit-confirm-password').value;

    // Validation
    if (!username || !email) {
        showMessage('edit-profile-status', 'Username and email are required.', 'error');
        return;
    }

    if (newPassword && newPassword !== confirmPassword) {
        showMessage('edit-profile-status', 'New passwords do not match.', 'error');
        return;
    }

    if (newPassword && newPassword.length < 6) {
        showMessage('edit-profile-status', 'New password must be at least 6 characters.', 'error');
        return;
    }

    form.classList.add('loading');
    showMessage('edit-profile-status', 'Updating profile...', 'info');

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('current_password', currentPassword);
    if (newPassword) {
        formData.append('new_password', newPassword);
    }

    try {
        const response = await fetch('update_profile.php', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            showMessage('edit-profile-status', 'Profile updated successfully!', 'success');

            // Update currentUser only if returned
            if (data.user) {
                currentUser = { ...currentUser, ...data.user };
            }

            // Close modal and refresh
            setTimeout(() => {
                closeModal('edit-profile');
                location.reload();
            }, 1500);
        } else {
            const message = data.message || 'Update failed. Please check your input.';
            showMessage('edit-profile-status', message, 'error');
        }
    } catch (error) {
        showMessage('edit-profile-status', 'An error occurred. Please try again.', 'error');
    } finally {
        form.classList.remove('loading');
    }
}

// Attach edit profile form listener
document.getElementById('edit-profile-form')?.addEventListener('submit', handleEditProfileSubmit);

function openModal(modalId) {
    const modalEl = document.getElementById(`${modalId}-modal`);
    if (!modalEl) return;

    const $modal = $(modalEl);
    if (!$modal.data('zfPlugin')) {
        new Foundation.Reveal($modal);
    }
    $modal.foundation('open');
}

function closeModal(modalId) {
    const modalEl = document.getElementById(`${modalId}-modal`);
    if (!modalEl) return;

    const $modal = $(modalEl);
if ($modal.length && $modal.data('zfPlugin')) {
    $modal.foundation('close');
}

}

function switchModal(fromModal, toModal) {
closeModal(fromModal);
setTimeout(() => openModal(toModal), 300);

}
window.togglePassword = function(inputId, iconElement) {
    const passwordInput = document.getElementById(inputId);
    if (passwordInput) {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            iconElement.classList.remove('fa-eye');
            iconElement.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            iconElement.classList.remove('fa-eye-slash');
            iconElement.classList.add('fa-eye');
        }
    }
};

window.switchModal = switchModal;
window.openModal = openModal;
window.closeModal = closeModal;


    // Initial fetch of memes when the page loads
    fetchMemes();
});