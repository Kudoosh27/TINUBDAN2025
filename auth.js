// Simple authentication logic
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'tinubdan2025';

function authenticate(username, password) {
    return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (authenticate(username, password)) {
            // Store authentication state
            localStorage.setItem('isAuthenticated', 'true');
            // Redirect to game-schedule or dashboard
            window.location.href = 'game-schedule.html';
        } else {
            errorMessage.textContent = 'Invalid credentials';
        }
    });
});

// Access control function for private pages
function checkAccess() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
        window.location.href = 'login.html';
    }
}

// Add this to private pages like game-schedule.html, event-result.html
document.addEventListener('DOMContentLoaded', checkAccess);