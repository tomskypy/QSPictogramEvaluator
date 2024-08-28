export class LogService {
    constructor() {
        this.logs = [];
    }

    log(showTimestamp, choiceTimestamp, pict1, pict2, choice) {
        this.logs.push({ showTimestamp, choiceTimestamp, pict1, pict2, choice });
    }

    getLogs() {
        return this.logs;
    }
}
