export class KeyboardService {
    constructor(uiService) {
        this.uiService = uiService;
    }

    initKeyboardNavigation() {
        document.addEventListener('keydown', (event) => {
            if (document.getElementById('main-content').style.display === 'none') {
                return;
            }

            switch (event.key) {
                case 'a': case 'A':
                    document.getElementById('greater').click();
                    break;
                case 's': case 'S':
                    document.getElementById('equal').click();
                    break;
                case 'd': case 'D':
                    document.getElementById('lesser').click();
                    break;
            }
            
            const keyboardInfo = document.getElementById('keyboard-info');
            if (keyboardInfo && !keyboardInfo.classList.contains('fade-out')) {
                setTimeout(() => {
                    keyboardInfo.classList.add('fade-out');
                }, 3000);
            }    
        });
    }
}
