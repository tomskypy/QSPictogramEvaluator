export class UIService {
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

    updateSVGs(name1, name2, svg1, svg2) {
        const svgElement1 = document.getElementById('svg1');
        const svgElement2 = document.getElementById('svg2');
        svgElement1.src = svg1;
        svgElement2.src = svg2;
        svgElement1.dataset.name = name1;
        svgElement2.dataset.name = name2;
    }

    logAction(buttonId, svg1Name, svg2Name, responseTime) {
        const logEntry = document.createElement('li');
        logEntry.innerHTML = `<span class="highlight">${this.currentTimestamp()}</span> Selected <strong>${buttonId}</strong> with options <strong>${svg1Name}</strong> and <strong>${svg2Name}</strong>. | Response Time: ${responseTime} ms`;
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
}
