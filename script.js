document.addEventListener('DOMContentLoaded', function() {
    const appTiles = document.querySelectorAll('.app-tile');
    
    // Add click animation and functionality
    appTiles.forEach(tile => {
        tile.addEventListener('click', function() {
            // Add a pulse animation effect when clicked
            this.classList.add('pulse');
            
            // Remove the class after animation completes
            setTimeout(() => {
                this.classList.remove('pulse');
                
                // Get app name and category
                const appName = this.querySelector('h3').textContent;
                let category = '';
                
                if (this.classList.contains('creator')) {
                    category = 'Music Creator';
                } else if (this.classList.contains('instrument')) {
                    category = 'Instrument';
                } else if (this.classList.contains('activity')) {
                    category = 'Activity';
                }
                
                // In the future, this would navigate to the actual app
                alert(`${category} App: ${appName} - Coming soon!`);
            }, 300);
        });
    });
    
    // Add some CSS for the pulse animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(0.95); }
            100% { transform: scale(1); }
        }
        
        .pulse {
            animation: pulse 0.3s ease-in-out;
        }
        
        .app-tile::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0);
            transition: background-color 0.3s ease;
            pointer-events: none;
            z-index: 1;
        }
        
        .app-tile:active::after {
            background-color: rgba(255, 255, 255, 0.3);
        }
    `;
    document.head.appendChild(style);
});
