function initApp() {
    setupAuthPersistence();
    initAuthCheck();
    initComparisonButtons();
    initCardCollapse();
    initKeyboardNavigation();
    
    document.getElementById('login-btn').addEventListener('click', handleLogin);
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
}

window.onload = initApp;
