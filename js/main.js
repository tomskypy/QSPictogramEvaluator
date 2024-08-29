import { db, auth, storage } from './firebaseConfig.js';
import { AuthService } from './authService.js';
import { SVGService } from './svgService.js';
import { UIService } from './uiService.js';
import { LogService } from './logService.js';
import { KeyboardService } from './keyboardService.js';
import { SessionService } from './sessionService.js';

const authService = new AuthService(auth);
const svgService = new SVGService(storage);
const uiService = new UIService();
const logService = new LogService();
const keyboardService = new KeyboardService(uiService);
const sessionService = new SessionService(db);
let showTime = null;

function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    authService.signIn(email, password)
        .then(() => {
            authService.setPersistence();
            revealMainContent();
        })
        .catch(() => {
            uiService.toggleVisibility('login-error', 'block');
        });
}

function handleLogout() {
    authService.signOut().then(() => {
        hideMainContent();
    }).catch(error => {
        console.error('Error signing out:', error);
    });
}

function handleCategoryChange() {
    const selectedCategory = document.getElementById('category-select').value;
    localStorage.setItem('selectedCategory', selectedCategory);
    svgService.loadSVGs(selectedCategory).then(() => displayRandomPair());
}

function displayRandomPair() {
    const [svg1, svg2] = svgService.getRandomPair();
    uiService.updateSVGs(svg1[0], svg2[0], svg1[1], svg2[1]);
    showTime = new Date();
}

function handleButtonClick(buttonId) {
    const responseTime = Date.now() - showTime;
    const svg1Name = document.getElementById('svg1').dataset.name;
    const svg2Name = document.getElementById('svg2').dataset.name;
    const choice = buttonId === 'greater' ? '>' : buttonId === 'lesser' ? '<' : '=';

    const choiceData = {
        timestamp: new Date().toISOString(),
        svg1Name,
        svg2Name,
        choice,
        responseTime
    };

    logService.log(showTime, responseTime, svg1Name, svg2Name, choice);
    uiService.logAction(choice, svg1Name, svg2Name, responseTime);
    uiService.updateChoiceView(logService.getLogs(), svgService);

    sessionService.recordChoice(choiceData);

    displayRandomPair();
}

function revealMainContent() {
    uiService.toggleVisibility('login-overlay', 'none');
    svgService.loadCategories().then(categories => {
        uiService.populateCategorySelect(categories);

        const savedSelectedCategory = localStorage.getItem('selectedCategory');
        let existingCategory = categories.filter(category => category.name === savedSelectedCategory);
        if (existingCategory.length > 0) {
            document.getElementById('category-select').value = savedSelectedCategory;
        } else {
            localStorage.setItem('selectedCategory', null);
        }

        handleCategoryChange();
        uiService.toggleVisibility('download-sessions-btn', 'block');
        uiService.toggleVisibility('logout-btn', 'block');
        uiService.toggleVisibility('main-content', 'block');
    });
}


function hideMainContent() {
    uiService.toggleVisibility('login-overlay', 'flex');
    uiService.toggleVisibility('main-content', 'none');
    uiService.toggleVisibility('download-sessions-btn', 'none');
    uiService.toggleVisibility('logout-btn', 'none');
}

function handleSessionStart() {
    sessionService.startSession();
    uiService.logSessionAction('Started');
    uiService.showStopRecording();
}

function handleSessionStop() {
    const userId = authService.getCurrentUser().uid;
    sessionService.stopSession(userId);
    uiService.logSessionAction('Stopped');
    uiService.showStartRecording();
    uiService.stopRecordingTimer();
}

function handleDownloadSessions() {
    sessionService.getSessions().then(sessions => {
        const blob = new Blob([JSON.stringify(sessions, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sessions.json';
        a.click();
        URL.revokeObjectURL(url);
    }).catch(error => {
        console.error('Error downloading sessions:', error);
    });
}

function initApp() {
    keyboardService.initKeyboardNavigation();
    authService.onAuthStateChanged(user => {
        if (user) {
            revealMainContent();
        } else {
            hideMainContent();
        }
    });

    document.getElementById('login-btn').addEventListener('click', handleLogin);
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    document.getElementById('download-sessions-btn').addEventListener('click', handleDownloadSessions);
    document.getElementById('category-select').addEventListener('change', handleCategoryChange);
    document.querySelectorAll('.compare-button').forEach(button => {
        button.addEventListener('click', () => handleButtonClick(button.id));
    });

    document.getElementById('start-recording-btn').addEventListener('click', handleSessionStart);
    document.getElementById('stop-recording-btn').addEventListener('click', handleSessionStop);

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
    document.getElementById('theme-toggle-btn').addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

window.onload = initApp;
