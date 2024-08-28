export class AuthService {
    constructor(auth) {
        this.auth = auth;
    }

    setPersistence() {
        this.auth.setPersistence(this.auth.Auth.Persistence.LOCAL).catch(error => {
            console.error('Error setting up auth persistence:', error);
        });
    }

    signIn(email, password) {
        return this.auth.signInWithEmailAndPassword(email, password);
    }

    signOut() {
        return this.auth.signOut();
    }

    onAuthStateChanged(callback) {
        this.auth.onAuthStateChanged(callback);
    }
}
