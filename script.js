document.addEventListener('DOMContentLoaded', function() {
    // Only select .app-tile elements that are NOT links (i.e., not <a>)
    const inactiveTiles = document.querySelectorAll('.app-tile:not(a.app-tile)');
    
    inactiveTiles.forEach(tile => {
        tile.addEventListener('click', function(e) {
            // Add a pulse animation effect when clicked
            this.classList.add('pulse');
            
            setTimeout(() => {
                this.classList.remove('pulse');
                const appName = this.querySelector('h3').textContent;
                let category = '';
                if (this.classList.contains('creator')) category = 'Music Creator';
                else if (this.classList.contains('instrument')) category = 'Instrument';
                else if (this.classList.contains('activity')) category = 'Activity';
                alert(`${category} App: ${appName} - Coming soon!`);
            }, 300);
        });
    });

    // Add pulse animation CSS, if not already present
    if (!document.getElementById('pulse-style')) {
        const style = document.createElement('style');
        style.id = 'pulse-style';
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
    }
});
