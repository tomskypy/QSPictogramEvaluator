function logAction(buttonId, svg1Name, svg2Name, responseTime) {
    const timestamp = new Date().toLocaleTimeString([], {
        hourCycle: 'h23',
        hour: '2-digit',
        minute: '2-digit',
        second: 'numeric',
        fractionalSecondDigits: 3
    });
    const logEntry = document.createElement('li');
    logEntry.innerHTML = `<span class="highlight">${timestamp}</span> Selected <strong>${buttonId}</strong> with options <strong>${svg1Name}</strong> and <strong>${svg2Name}</strong>. | Response Time: ${responseTime} ms`;
    const logList = document.getElementById('log-list');
    logList.prepend(logEntry);
    toggleVisibility('log-container', logList.children.length > 0 ? 'block' : 'none');
}

function calculateResponseTime(start) {
    return Date.now() - start;
}
