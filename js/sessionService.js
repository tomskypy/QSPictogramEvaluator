export class SessionService {
    constructor(db) {
        this.db = db;
        this.sessionActive = false;
        this.sessionData = [];
        this.sessionStartTime = null;
    }

    startSession() {
        this.sessionActive = true;
        this.sessionData = [];
        this.sessionStartTime = new Date().toISOString();
    }

    recordChoice(choiceData) {
        if (!this.sessionActive) return;
        this.sessionData.push(choiceData);
    }

    stopSession(userId) {
        if (!this.sessionActive) return;
        this.sessionActive = false;
        const sessionEndTime = new Date().toISOString();

        const sessionRef = this.db.ref('pictogram-sessions').push();
        sessionRef.set({
            userId: userId,
            sessionStart: this.sessionStartTime,
            sessionEnd: sessionEndTime,
            choices: this.sessionData
        }).catch(error => {
            console.error('Error saving session data:', error);
        });

        this.sessionData = [];
    }
}
