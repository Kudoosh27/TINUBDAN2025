// Simple authentication logic
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'tinubdan2025';

function authenticate(username, password) {
    return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

// Logout function
function logout() {
    try {
        // Clear authentication data from localStorage
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('authTimestamp');

        // Optional: Clear any other session-related data
        localStorage.clear(); // Use cautiously if you have other important localStorage data

        // Redirect to login page
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Logout failed:', error);
        alert('Logout failed. Please try again.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

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

    // Add logout event listener to all pages
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
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

    // Get current page path
    const currentPath = window.location.pathname;
    const isLoginPage = currentPath.includes('login.html');
    const isOfficialPage = currentPath.includes('tinubdan-official.html');

    // Redirect logic for management view
    if (!isAuthenticated || !isSessionValid) {
        // Hide management view toggle and section
        const viewToggleBtn = document.getElementById('viewToggleBtn');
        const managementView = document.querySelector('.management-view');
        const managementToggleSection = document.getElementById('management-toggle-section');

        if (viewToggleBtn) viewToggleBtn.style.display = 'none';
        if (managementView) managementView.style.display = 'none';
        if (managementToggleSection) managementToggleSection.style.display = 'none';

        // Redirect to login only if on a restricted page (not official page)
        if (!isOfficialPage && !isLoginPage) {
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('authTimestamp');
            window.location.href = 'login.html';
        }
    }
}

// Add this to private pages
document.addEventListener('DOMContentLoaded', checkAccess);

// Management Button Implementations
function addSchedule() {
    const scheduleForm = document.getElementById('scheduleForm');
    if (!scheduleForm) {
        console.error('Schedule form not found');
        return;
    }

    // Toggle form visibility
    scheduleForm.classList.toggle('hidden');
    
    // Optional: Prepare form for new schedule entry
    scheduleForm.reset();
}

function editSchedule() {
    const scheduleList = document.getElementById('scheduleList');
    if (!scheduleList) {
        console.error('Schedule list not found');
        return;
    }

    // Toggle edit mode for schedules
    scheduleList.classList.toggle('edit-mode');
    
    // Optional: Highlight editable schedules
    const scheduleItems = scheduleList.querySelectorAll('.schedule-item');
    scheduleItems.forEach(item => {
        item.classList.toggle('editable');
    });
}

function addResult() {
    const resultForm = document.getElementById('resultForm');
    if (!resultForm) {
        console.error('Result form not found');
        return;
    }

    // Toggle form visibility
    resultForm.classList.toggle('hidden');
    
    // Optional: Prepare form for new result entry
    resultForm.reset();
}

function editResult() {
    const resultList = document.getElementById('resultList');
    if (!resultList) {
        console.error('Result list not found');
        return;
    }

    // Toggle edit mode for results
    resultList.classList.toggle('edit-mode');
    
    // Optional: Highlight editable results
    const resultItems = resultList.querySelectorAll('.result-item');
    resultItems.forEach(item => {
        item.classList.toggle('editable');
    });
}

function updateLeaderboard() {
    // Fetch and update leaderboard data
    fetch('/api/leaderboard/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update leaderboard');
        }
        return response.json();
    })
    .then(data => {
        const leaderboardContainer = document.getElementById('leaderboardContainer');
        if (leaderboardContainer) {
            // Update leaderboard UI with new data
            leaderboardContainer.innerHTML = ''; // Clear existing entries
            data.forEach((entry, index) => {
                const entryElement = document.createElement('div');
                entryElement.classList.add('leaderboard-entry');
                entryElement.innerHTML = `
                    <span class="rank">${index + 1}</span>
                    <span class="name">${entry.name}</span>
                    <span class="score">${entry.score}</span>
                `;
                leaderboardContainer.appendChild(entryElement);
            });
        }
        alert('Leaderboard updated successfully!');
    })
    .catch(error => {
        console.error('Leaderboard update error:', error);
        alert('Failed to update leaderboard. Please try again.');
    });
}

// Attach functions to management buttons
document.addEventListener('DOMContentLoaded', () => {
    const addScheduleBtn = document.getElementById('addScheduleBtn');
    const editScheduleBtn = document.getElementById('editScheduleBtn');
    const addResultBtn = document.getElementById('addResultBtn');
    const editResultBtn = document.getElementById('editResultBtn');
    const updateLeaderboardBtn = document.getElementById('updateLeaderboardBtn');

    if (addScheduleBtn) addScheduleBtn.addEventListener('click', addSchedule);
    if (editScheduleBtn) editScheduleBtn.addEventListener('click', editSchedule);
    if (addResultBtn) addResultBtn.addEventListener('click', addResult);
    if (editResultBtn) editResultBtn.addEventListener('click', editResult);
    if (updateLeaderboardBtn) updateLeaderboardBtn.addEventListener('click', updateLeaderboard);
});
