function setupAuthPersistence() {
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(error => {
        console.error('Error setting up auth persistence:', error);
    });
}

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

function handleLogout() {
    auth.signOut().then(() => {
        toggleVisibility('login-overlay', 'flex');
        toggleVisibility('main-content', 'none');
    }).catch(error => {
        console.error('Error signing out:', error);
    });
}

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
