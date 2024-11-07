// Define the pairs of elements to be handled
const elementPairs = [
    { gif: 'ParisOnlineGif', title: 'mainLogo', customFalloff: true }, // Add custom flag for ParisOnlineGif
    { gif: 'EvanoraGif', title: 'EvanoraTitle' },
    { gif: 'LiliCastiglioniGif', title: 'LiliCastiglioniTitle' },
    { gif: 'SheDiamondGif', title: 'SheDiamondTitle' },
    { gif: 'BarbroMijaGif', title: 'BarbroMijaTitle' },
    { gif: 'BodRushGif', title: 'BodRushTitle' },
    { gif: 'ThanasGif', title: 'ThanasTitle' },
    { element: 'homeSubtextMainPage', fullOpacityRange: 300, falloffRange: 200 }
];

/**
 * Calculates the opacity based on the distance from the center.
 *
 * @param {number} distanceFromCenter - The distance from the center point.
 * @param {number} fullOpacityRange - The range where opacity should be 100%.
 * @param {number} falloffRange - The range where opacity falls off to 0%.
 * @returns {number} The calculated opacity, from 0 to 1.
 */
function calculateOpacity(distanceFromCenter, fullOpacityRange, falloffRange) {
    if (distanceFromCenter <= fullOpacityRange) {
        return 1; // Full opacity within the full opacity range
    } else if (distanceFromCenter >= fullOpacityRange + falloffRange) {
        return 0; // No opacity beyond the falloff range
    } else {
        // Linear falloff between full opacity range and falloff range
        return 1 - (distanceFromCenter - fullOpacityRange) / falloffRange;
    }
}

/**
 * Updates the opacity and glow effects for both GIF and title elements.
 *
 * @param {HTMLElement} gifElement - The GIF element to update.
 * @param {HTMLElement} titleElement - The title element to track.
 * @param {number} opacity - The calculated opacity based on distance.
 */
function updateOpacityAndGlow(gifElement, titleElement, opacity) {
    // Update the opacity of the GIF
    gifElement.style.opacity = opacity;

    // Apply intense glow effect to the title element
    applyIntenseGlowEffect(titleElement, opacity);
}

// Function to apply intense glow effect to the title element
function applyIntenseGlowEffect(element, opacity) {
    const baseColor = 'rgba(255, 255, 255, ';
    const maxBlur = 30; // Increased max blur for more intensity
    const glowLayers = 20; // More layers for a more intense glow

    let textShadow = '';
    for (let i = 1; i <= glowLayers; i++) {
        const layerOpacity = opacity * (1 - (i - 1) / glowLayers);
        const blur = (i / glowLayers) * maxBlur;
        textShadow += `0 0 ${blur}px ${baseColor}${layerOpacity}), `;
    }

    // Add a larger, softer outer glow
    textShadow += `0 0 ${maxBlur * 4}px ${baseColor}${opacity * 0.5})`;

    element.style.textShadow = textShadow.trim();

    // Add a subtle text stroke for extra pop in the center
    const strokeOpacity = Math.pow(opacity, 0.5); // Square root for a more dramatic center effect
    element.style.webkitTextStroke = `1px rgba(255, 255, 255, ${strokeOpacity})`;
    element.style.textStroke = `1px rgba(255, 255, 255, ${strokeOpacity})`;
}

// Function to update both the GIF and title based on scroll position
function updateEffects() {
    const windowHeight = window.innerHeight;
    const centerY = windowHeight / 2;
    const fullOpacityRange = 60; // Full opacity range
    const falloffRange = 40; // Falloff range

    elementPairs.forEach(pair => {
        const gifElement = document.getElementById(pair.gif);
        const titleElement = document.getElementById(pair.title);

        if (gifElement && titleElement) {
            const titleRect = titleElement.getBoundingClientRect();
            const elementCenterY = titleRect.top + titleRect.height / 2;
            const distanceFromCenter = Math.abs(elementCenterY - centerY);


            // Default falloff settings
            let fullOpacityRange = 50;
            let falloffRange = 50;

            // Custom falloff for ParisOnlineGif and mainLogo
            if (pair.customFalloff) {
                fullOpacityRange = 200;  // Wider full opacity range for ParisOnlineGif
                falloffRange = 400;      // Wider falloff range for ParisOnlineGif
            }

            // Calculate the opacity based on the distance from the center
            const opacity = calculateOpacity(distanceFromCenter, fullOpacityRange, falloffRange);

            // Update the opacity for both the GIF and title glow
            updateOpacityAndGlow(gifElement, titleElement, opacity);
        }
    });
}




/* added for opacity of textbox */

function updateHomeSubtextOpacity() {
    const windowHeight = window.innerHeight;
    const homeSubtextElement = document.getElementById('homeSubtextMainPage');

    if (homeSubtextElement) {
        const homeSubtextRect = homeSubtextElement.getBoundingClientRect();
        const homeSubtextCenterY = homeSubtextRect.top + homeSubtextRect.height / 2;
        const distanceFromBottom = windowHeight - homeSubtextCenterY;
        
        // Halve the full opacity and falloff ranges to make the opacity change faster
        const fullOpacityRange = 100; // Reduced full opacity range
        const falloffRange = 50; // Reduced falloff range

        // Calculate the opacity based on the distance from the bottom of the screen
        let opacity;
        if (distanceFromBottom >= fullOpacityRange + falloffRange) {
            opacity = 1; // Full opacity beyond the falloff range
        } else if (distanceFromBottom <= fullOpacityRange) {
            opacity = 0; // No opacity within the full opacity range
        } else {
            // Linear falloff between full opacity range and falloff range
            opacity = 1 - (distanceFromBottom - fullOpacityRange) / falloffRange;
        }

        // Update the opacity of the #homeSubtextMainPage element
        homeSubtextElement.style.opacity = opacity;
    }
}


/* end of added for textbox  */



// Add this to the existing event listeners
window.addEventListener('scroll', () => {
    updateEffects();
    updateHomeSubtextOpacity();
});

window.addEventListener('resize', () => {
    updateEffects();
    updateHomeSubtextOpacity();
});

// Initial call to set the initial state
updateEffects();
updateHomeSubtextOpacity();

// Create an Intersection Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // If the element is in view
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            // Optional: stop observing after it's faded in
            observer.unobserve(entry.target);
        }
    });
}, {
    // Element becomes visible when it's 20% in view
    threshold: 0.2
});

// Observe all elements with class bottomDidactic
document.querySelectorAll('.bottomDidactic').forEach((element) => {
    observer.observe(element);
});



/* image overlay gallery script  */

let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');

function openGallery() {
    document.getElementById('galleryOverlay').style.display = 'block';
    document.body.style.overflow = 'hidden';
    showSlide(currentSlide);
}

function closeGallery() {
    document.getElementById('galleryOverlay').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

// Event Listeners
document.querySelector('.next').addEventListener('click', nextSlide);
document.querySelector('.prev').addEventListener('click', prevSlide);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (document.getElementById('galleryOverlay').style.display === 'block') {
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'Escape') closeGallery();
    }
});

// Touch swipe support
let touchStartX = 0;
let touchEndX = 0;

document.querySelector('.carousel-container').addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.querySelector('.carousel-container').addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextSlide(); // Swipe left
        } else {
            prevSlide(); // Swipe right
        }
    }
}




