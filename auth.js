// Simple authentication logic
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'tinubdan2025';

function authenticate(username, password) {
    return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

// Logout function
function logout() {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authTimestamp');
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    // Check if logout button exists (on tinubdan-official page)
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Prevent form submission and page reload
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            // Prevent default form submission
            e.preventDefault();
            e.stopPropagation();

            // Clear previous error messages
            errorMessage.textContent = '';

            // Trim inputs to remove whitespace
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            // Validate inputs
            if (!username || !password) {
                errorMessage.textContent = 'Please enter both username and password';
                return;
            }

            // Authenticate
            if (authenticate(username, password)) {
                // Store authentication state securely
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('authTimestamp', Date.now().toString());

                // Optional: Add a welcome toast or notification
                alert('Login Successful! Welcome to Tinubdan 2025');

                // Redirect to official page
                window.location.href = 'tinubdan-official.html';
            } else {
                // Show error and reset password field
                errorMessage.textContent = 'Invalid credentials';
                passwordInput.value = '';
                passwordInput.focus();
            }
        });
    }

    // Optional: Add real-time validation
    if (usernameInput && passwordInput) {
        [usernameInput, passwordInput].forEach(input => {
            input.addEventListener('input', () => {
                errorMessage.textContent = '';
            });
        });
    }
});

// Enhanced access control function
function checkAccess() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const authTimestamp = localStorage.getItem('authTimestamp');
    
    // Optional: Add timeout (e.g., 1 hour)
    const TIMEOUT = 60 * 60 * 1000; // 1 hour in milliseconds
    const isSessionValid = authTimestamp && 
        (Date.now() - parseInt(authTimestamp, 10) < TIMEOUT);

    // Only redirect if not on login page
    if ((!isAuthenticated || !isSessionValid) && 
        !window.location.pathname.includes('login.html')) {
        // Clear any stale authentication data
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('authTimestamp');
        
        // Redirect to login
        window.location.href = 'login.html';
    }
}

// Add this to private pages
document.addEventListener('DOMContentLoaded', checkAccess);
