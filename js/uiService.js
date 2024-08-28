export class UIService {
    constructor() {
        this.recordingStartTime = null;
        this.elapsedTimeInterval = null;
    }

    toggleVisibility(elementId, displayValue) {
        document.getElementById(elementId).style.display = displayValue;
    }

    hideKeyboardInfo() {
        const keyboardInfo = document.getElementById('keyboard-info');
        if (keyboardInfo && !keyboardInfo.classList.contains('fade-out')) {
            setTimeout(() => {
                keyboardInfo.classList.add('fade-out');
            }, 3000);
        }
    }

    populateCategorySelect(categories) {
        const categorySelect = document.getElementById('category-select');
        categorySelect.innerHTML = ''; 
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.name;
            option.text = category.name.charAt(0).toUpperCase() + category.name.slice(1);
            categorySelect.appendChild(option);
        });
    }

    updateSVGs(name1, name2, svg1Data, svg2Data) {
        const svgElement1 = document.getElementById('svg1');
        const svgElement2 = document.getElementById('svg2');
        svgElement1.innerHTML = svg1Data;
        svgElement2.innerHTML = svg2Data;
        svgElement1.dataset.name = name1;
        svgElement2.dataset.name = name2;
    }

    logAction(choice, svg1Name, svg2Name, responseTime) {
        const logEntry = document.createElement('li');
        logEntry.innerHTML = `<span class="highlight">${this.currentTimestamp()}</span> Selected <strong>${choice}</strong> with options <strong>${svg1Name}</strong> and <strong>${svg2Name}</strong>. | Response Time: ${responseTime} ms`;
        this.appendLogEntry(logEntry);
    }

    logSessionAction(actionType) {
        const logEntry = document.createElement('li');
        logEntry.innerHTML = `<span class="highlight">${this.currentTimestamp()}</span> ${actionType} recording.`;
        this.appendLogEntry(logEntry);
    }

    appendLogEntry(logEntry) {
        const logList = document.getElementById('log-list');
        logList.prepend(logEntry);
        this.toggleVisibility('log-container', logList.children.length > 0 ? 'block' : 'none');
    }

    currentTimestamp() {
        return new Date().toLocaleTimeString([], {
            hourCycle: 'h23',
            hour: '2-digit',
            minute: '2-digit',
            second: 'numeric',
            fractionalSecondDigits: 3
        });
    }

    updateChoiceView(logs, svgService) {
        // TODO
    }

    showStartRecording() {
        this.toggleVisibility('start-recording-btn', 'inline-block');
        this.toggleVisibility('stop-recording-btn', 'none');
        this.toggleVisibility('recording-indicator', 'none');
    }

    showStopRecording() {
        this.toggleVisibility('start-recording-btn', 'none');
        this.toggleVisibility('stop-recording-btn', 'inline-block');
        this.toggleVisibility('recording-indicator', 'flex');
        this.startRecordingTimer();
    }

    startRecordingTimer() {
        this.recordingStartTime = Date.now();
        this.elapsedTimeInterval = setInterval(() => {
            const elapsedTime = Date.now() - this.recordingStartTime;
            this.updateElapsedTime(elapsedTime);
        }, 1000);
    }

    stopRecordingTimer() {
        clearInterval(this.elapsedTimeInterval);
        this.updateElapsedTime(0);
    }

    updateElapsedTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');
        document.getElementById('elapsed-time').textContent = `${minutes}:${seconds}`;
    }
}
