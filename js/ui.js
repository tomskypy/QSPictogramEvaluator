function toggleVisibility(elementId, displayValue) {
    document.getElementById(elementId).style.display = displayValue;
}

function initCardCollapse() {
    const cardHeader = document.getElementById('infoCardHeader');
    const chevronIcon = document.getElementById('chevronIcon');

    cardHeader.addEventListener('click', () => {
        toggleCollapse('infoCardBody', chevronIcon);
    });
}

function toggleCollapse(elementId, iconElement) {
    const cardBody = document.getElementById(elementId);
    const isCollapsed = cardBody.classList.contains('collapse');
    cardBody.classList.toggle('collapse', !isCollapsed);
    iconElement.classList.toggle('fa-chevron-down', isCollapsed);
    iconElement.classList.toggle('fa-chevron-up', !isCollapsed);
}
