// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAekw7dR4Jgzte2NBw3aA105K0VAdomm-U",
    authDomain: "q-sorting-pictogram-evaluator.firebaseapp.com",
    databaseURL: "https://q-sorting-pictogram-evaluator-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "q-sorting-pictogram-evaluator",
    storageBucket: "q-sorting-pictogram-evaluator.appspot.com",
    messagingSenderId: "763393271305",
    appId: "1:763393271305:web:072b1ad29fa3d4a49f7ad8",
    measurementId: "G-RHJ6Q5P64B"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();

// Variables
let svgList = [];
let showTime = null;

// Set up Firebase Authentication persistence
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(error => {
    console.error('Error setting up auth persistence:', error);
});

// Keyboard navigation functionality
document.addEventListener('keydown', function(event) {
    if (document.getElementById('main-content').style.display === 'none') {
        return; // Exit if main content is not visible
    }
    
    switch (event.key) {
        case 'a': case 'A':
            document.getElementById('greater').click();
            break;
        case 's': case 'S':
            document.getElementById('equal').click();
            break;
        case 'd': case 'D':
            document.getElementById('lesser').click();
            break;
    }
});

// Handle login and load SVGs on success
function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            toggleVisibility('login-overlay', 'none');
            toggleVisibility('main-content', 'block');
            loadSVGs();
        })
        .catch(() => {
            toggleVisibility('login-error', 'block');
        });
}

// Handle logout
function handleLogout() {
    auth.signOut().then(() => {
        toggleVisibility('login-overlay', 'flex');
        toggleVisibility('main-content', 'none');
    }).catch(error => {
        console.error('Error signing out:', error);
    });
}

// Load SVGs from Firebase
function loadSVGs() {
    db.ref('svgs').once('value')
        .then(snapshot => {
            svgList = Object.entries(JSON.parse(snapshot.val()));
            displayRandomPair();
        })
        .catch(error => {
            console.error('Error fetching SVGs:', error);
        });
}

// Display a random pair of SVGs
function displayRandomPair() {
    if (svgList.length < 2) return;

    const [index1, index2] = getRandomPair(svgList.length);
    updateSVGs(index1, index2);
    showTime = new Date();
}

// Update SVG elements in the DOM
function updateSVGs(index1, index2) {
    document.getElementById('svg1').src = svgList[index1][1];
    document.getElementById('svg2').src = svgList[index2][1];
    document.getElementById('svg1').dataset.name = svgList[index1][0];
    document.getElementById('svg2').dataset.name = svgList[index2][0];
}

// Get two different random indices
function getRandomPair(max) {
    return [Math.floor(Math.random() * max), Math.floor(Math.random() * max)];
}

// Log an action with details
function logAction(buttonId, svg1Name, svg2Name, responseTime) {
    const timestamp = new Date().toLocaleTimeString([], {
        hourCycle: 'h23',
        hour: '2-digit',
        minute: '2-digit',
        second: 'numeric',
        fractionalSecondDigits: 3
    });
    const logEntry = document.createElement('li');
    logEntry.innerHTML = `<span class="highlight">${timestamp}</span> Selected <strong>${buttonId}</strong> with options <strong>${svg1Name}</strong> and <strong>${svg2Name}</strong>. | Response Time: ${responseTime} ms`;
    const logList = document.getElementById('log-list');
    logList.prepend(logEntry);
    toggleVisibility('log-container', logList.children.length > 0 ? 'block' : 'none');
}

// Calculate the response time
function calculateResponseTime(start) {
    return Date.now() - start;
}

// Handle button clicks for comparison
function handleButtonClick(buttonId) {
    if (!showTime) return;
    const responseTime = calculateResponseTime(showTime);
    logAction(buttonId, document.getElementById('svg1').dataset.name, document.getElementById('svg2').dataset.name, responseTime);
    displayRandomPair();
}

// Initialize event listeners for comparison buttons
function initComparisonButtons() {
    ['greater', 'equal', 'lesser'].forEach(id => {
        document.getElementById(id).addEventListener('click', () => handleButtonClick(id === 'greater' ? '>' : id === 'lesser' ? '<' : '='));
    });
}

// Initialize card collapse functionality
function initCardCollapse() {
    const cardHeader = document.getElementById('infoCardHeader');
    const chevronIcon = document.getElementById('chevronIcon');

    cardHeader.addEventListener('click', () => {
        toggleCollapse('infoCardBody', chevronIcon);
    });
}

// Toggle the visibility of elements
function toggleVisibility(elementId, displayValue) {
    document.getElementById(elementId).style.display = displayValue;
}

// Toggle collapse state of card
function toggleCollapse(elementId, iconElement) {
    const cardBody = document.getElementById(elementId);
    const isCollapsed = cardBody.classList.contains('collapse');
    cardBody.classList.toggle('collapse', !isCollapsed);
    iconElement.classList.toggle('fa-chevron-down', isCollapsed);
    iconElement.classList.toggle('fa-chevron-up', !isCollapsed);
}

// Check auth state on page load
function initAuthCheck() {
    auth.onAuthStateChanged(user => {
        if (user) {
            toggleVisibility('login-overlay', 'none');
            toggleVisibility('main-content', 'block');
            loadSVGs();
        } else {
            toggleVisibility('login-overlay', 'flex');
            toggleVisibility('main-content', 'none');
        }
    });
}

// Initialize the application
function initApp() {
    initComparisonButtons();
    initCardCollapse();
    initAuthCheck();
    document.getElementById('login-btn').addEventListener('click', handleLogin);
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
}

// Run the app
window.onload = initApp;
