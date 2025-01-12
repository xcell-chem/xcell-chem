// popup.js
// Add JavaScript comments and details here.

// popup.js

// Function to show the popup
function showPopup(countdown) {
    if (countdown < 3) return; // Do not show if less than 3 seconds left

    const overlay = document.createElement('div');
    overlay.id = 'overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; // Semi-transparent black
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '9999';

    const popupBox = document.createElement('div');
    popupBox.style.backgroundColor = '#ededed'; // Background color for popup
    popupBox.style.padding = '20px';
    popupBox.style.borderRadius = '10px';
    popupBox.style.textAlign = 'center';
    popupBox.innerHTML = `
        <p>Make a purchase within <span id="countdown">${countdown}</span> seconds,</p>
        <p>and receive double what you order!</p>
        <button onclick="closePopup()">Wicked!!</button>
        <button onclick="closePopup()">Awesome!!</button>
    `;

    overlay.appendChild(popupBox);
    document.body.appendChild(overlay);

    // Countdown Logic
    const countdownElement = document.getElementById('countdown');
    let timer = countdown;

    const interval = setInterval(() => {
        timer--;
        countdownElement.textContent = timer;
        if (timer <= 0) {
            clearInterval(interval);
            closePopup();
        }
    }, 1000);
}

// Function to close the popup
function closePopup() {
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.remove();
    }
}

// Show the popup when the page loads
window.onload = function() {
    const countdownTime = 10; // Set your countdown time here
    showPopup(countdownTime);
};
