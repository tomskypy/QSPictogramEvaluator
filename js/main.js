import { db, auth, storage } from './firebaseConfig.js';
import { AuthService } from './authService.js';
import { SVGService } from './svgService.js';
import { UIService } from './uiService.js';
import { LogService } from './logService.js';
import { KeyboardService } from './keyboardService.js';

const authService = new AuthService(auth);
const svgService = new SVGService(db, storage);
const uiService = new UIService();
const logService = new LogService();
const keyboardService = new KeyboardService(uiService);
let showTime = null

function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    authService.signIn(email, password)
        .then(() => {
            authService.setPersistence();
            uiService.toggleVisibility('login-overlay', 'none');
            uiService.toggleVisibility('main-content', 'block');
            svgService.loadSVGs().then(() => displayRandomPair());
        })
        .catch(() => {
            uiService.toggleVisibility('login-error', 'block');
        });
}

function handleLogout() {
    authService.signOut().then(() => {
        uiService.toggleVisibility('login-overlay', 'flex');
        uiService.toggleVisibility('main-content', 'none');
    }).catch(error => {
        console.error('Error signing out:', error);
    });
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

    logService.log(showTime, responseTime, svg1Name, svg2Name, choice);
    uiService.logAction(choice, svg1Name, svg2Name, responseTime);
    uiService.updateChoiceView(logService.getLogs(), svgService);
    displayRandomPair();
}

function initApp() {
    keyboardService.initKeyboardNavigation();
    authService.onAuthStateChanged(user => {
        if (user) {
            uiService.toggleVisibility('login-overlay', 'none');
            uiService.toggleVisibility('main-content', 'block');
            svgService.loadSVGs().then(() => displayRandomPair());
        } else {
            uiService.toggleVisibility('login-overlay', 'flex');
            uiService.toggleVisibility('main-content', 'none');
        }
    });

    document.getElementById('login-btn').addEventListener('click', handleLogin);
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    document.querySelectorAll('.compare-button').forEach(button => {
        button.addEventListener('click', () => handleButtonClick(button.id));
    });
}

window.onload = initApp;
