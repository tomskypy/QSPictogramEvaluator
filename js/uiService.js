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

    populateCategorySelect(categories) {
        const categorySelect = document.getElementById('category-select');
        categorySelect.innerHTML = ''; // Clear existing options
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
