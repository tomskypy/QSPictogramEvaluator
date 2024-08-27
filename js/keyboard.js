function initKeyboardNavigation() {
    document.addEventListener('keydown', function(event) {
        if (document.getElementById('main-content').style.display === 'none') {
            return;
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
}

function initLogInOutButtons() {
    document.getElementById('login-btn').addEventListener('click', handleLogin);
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
}

function initComparisonButtons() {
    ['greater', 'equal', 'lesser'].forEach(id => {
        document.getElementById(id).addEventListener('click', () => handleButtonClick(id === 'greater' ? '>' : id === 'lesser' ? '<' : '='));
    });
}

function handleButtonClick(buttonId) {
    if (!showTime) return;
    const responseTime = calculateResponseTime(showTime);
    logAction(buttonId, document.getElementById('svg1').dataset.name, document.getElementById('svg2').dataset.name, responseTime);
    displayRandomPair();
}
