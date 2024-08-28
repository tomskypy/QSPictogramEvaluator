export class AuthService {
    constructor(auth) {
        this.auth = auth;
    }

    setPersistence() {
        return this.auth.setPersistence(this.auth.Auth.Persistence.LOCAL)
            .catch(error => {
                console.error('Error setting up auth persistence:', error);
            });
    }

    signIn(email, password) {
        return this.auth.signInWithEmailAndPassword(email, password)
            .catch(error => {
                console.error('Error signing in:', error);
                throw error;
            });
    }

    signOut() {
        return this.auth.signOut()
            .catch(error => {
                console.error('Error signing out:', error);
                throw error;
            });
    }

    onAuthStateChanged(callback) {
        this.auth.onAuthStateChanged(callback);
    }

    getCurrentUser() {
        return this.auth.currentUser;
    }
}
