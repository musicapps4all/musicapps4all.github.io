:root {
    --primary-color: #2D3436;
    --secondary-color: #636E72;
    --accent-color: #74B9FF;
    --background-color: #F1F2F6;
    --text-color: #2D3436;
    --tile-hover-shadow: 0 8px 20px rgba(45, 52, 54, 0.2);
    --tile-active-shadow: 0 4px 10px rgba(45, 52, 54, 0.15);
    
    /* Category colors */
    --creator-color: #6C5CE7;
    --instrument-color: #00B894;
    --activity-color: #FD79A8;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Montserrat', sans-serif;
    background-color: var(--background-color);
    color: var(--text-color);
    line-height: 1.6;
}

.container {
    width: 90%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
}

header {
    background-color: #fff; /* Changed background to white */
    color: var(--primary-color); /* Changed text color to dark blue-grey */
    padding: 20px 0;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

header h1 {
    font-weight: 600;
    font-size: 2.2rem;
    letter-spacing: 1px;
}

.tagline {
    font-weight: 400;
    opacity: 0.8;
    margin-top: 5px;
}

/* Navigation Styles */
.main-nav {
    background-color: var(--primary-color); /* Changed background to dark blue-grey */
    padding: 10px 0; /* Reduced padding to make it thinner */
    margin-bottom: 40px;
}

.main-nav .container {
    display: flex;
    justify-content: center;
    gap: 0; /* Removed gap to have buttons touch */
    flex-wrap: wrap;
}

.nav-button {
    text-decoration: none;
    color: white;
    background-color: transparent;
    border: 1px solid #7a8285; /* Thinner, subtle border */
    border-radius: 0; /* Sharp corners */
    padding: 12px 24px;
    font-weight: 500;
    transition: all 0.2s ease-in-out;
    font-size: 0.9rem;
    flex-grow: 1; /* Allows buttons to fill space */
    text-align: center;
    cursor: pointer;
}

.nav-button:hover, .nav-button.active {
    background-color: var(--accent-color);
    color: var(--primary-color);
    border-color: var(--accent-color);
}

#main-content {
    margin-bottom: 60px;
}

.tab-content {
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    min-height: 40vh;
    margin-bottom: 60px;
    padding: 40px;
    max-width: 800px; /* Constrain width for better readability */
    margin-left: auto;
    margin-right: auto;
}

.tab-content h2 {
    color: var(--primary-color);
    margin-bottom: 25px; /* Increased space after title */
}

.tab-content p {
    line-height: 1.7; /* Increase line spacing */
    margin-bottom: 1.75em; /* Create strong paragraph breaks */
}

.tab-content p:last-of-type {
    margin-bottom: 0; /* Remove margin from the last paragraph */
}

.app-category {
    margin-bottom: 50px;
}

.category-title {
    font-size: 1.6rem;
    margin-bottom: 20px;
    padding-bottom: 8px;
    position: relative;
    display: inline-block;
}

.category-title::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: var(--primary-color);
    border-radius: 2px;
}

/* Category-specific styling for title underlines */
.app-category:nth-child(1) .category-title::after {
    background-color: var(--creator-color);
}

.app-category:nth-child(2) .category-title::after {
    background-color: var(--instrument-color);
}

.app-category:nth-child(3) .category-title::after {
    background-color: var(--activity-color);
}

.app-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
    gap: 20px;
    justify-content: center;
}

.app-tile {
    background-color: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(45, 52, 54, 0.1);
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
    max-width: 100%;
    margin: 0 auto;
    border-top: 4px solid transparent;
}

/* Category-specific styling */
.app-tile.creator {
    border-top-color: var(--creator-color);
}

.app-tile.instrument {
    border-top-color: var(--instrument-color);
}

.app-tile.activity {
    border-top-color: var(--activity-color);
}

.app-tile:hover {
    transform: translateY(-6px);
    box-shadow: var(--tile-hover-shadow);
}

.app-tile:active {
    transform: translateY(-3px);
    box-shadow: var(--tile-active-shadow);
}

.app-tile img {
    width: 100%;
    display: block;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.app-tile:hover img {
    transform: scale(1.05);
}

.app-info {
    padding: 12px;
    background-color: white;
}

.app-info h3 {
    color: var(--primary-color);
    margin-bottom: 4px;
    font-size: 0.95rem;
}

.app-info p {
    font-size: 0.75rem;
    color: var(--secondary-color);
}

footer {
    background-color: var(--primary-color);
    color: white;
    padding: 25px 0;
    font-size: 0.9rem;
}

.footer-links {
    margin-top: 15px;
}

.footer-links a {
    color: white;
    margin-right: 20px;
    text-decoration: none;
    opacity: 0.8;
    transition: opacity 0.2s ease;
}

.footer-links a:hover {
    opacity: 1;
    text-decoration: underline;
}

@media (max-width: 768px) {
    .main-nav .container {
        flex-direction: column; /* Stack buttons vertically on small screens */
    }

    .nav-button {
        padding: 10px 20px;
        font-size: 0.9rem;
    }
    
    .app-grid {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 15px;
    }
    
    header h1 {
        font-size: 1.8rem;
    }
    
    .tagline {
        font-size: 0.9rem;
    }
    
    .category-title {
        font-size: 1.3rem;
    }
    
    .app-info h3 {
        font-size: 0.85rem;
    }
    
    .app-info p {
        font-size: 0.7rem;
    }
}
