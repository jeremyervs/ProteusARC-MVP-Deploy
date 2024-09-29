// Add this code at the beginning of the DOMContentLoaded event listener

const hamburgerIcon = document.querySelector('.hamburger-icon');
const menuContainer = document.querySelector('.menu-container');
const userGuideLink = document.getElementById('userGuideLink');

hamburgerIcon.addEventListener('click', () => {
    menuContainer.classList.toggle('active');
});

userGuideLink.addEventListener('click', (e) => {
    e.preventDefault();
    fetch('/user-guide')
        .then(response => response.text())
        .then(content => {
            const userGuidePopup = document.createElement('div');
            userGuidePopup.className = 'user-guide-popup';
            userGuidePopup.innerHTML = `
                <div class="user-guide-content">
                    <h2>User Guide</h2>
                    <div class="user-guide-text">${content}</div>
                    <button class="close-user-guide">Close</button>
                </div>
            `;
            document.body.appendChild(userGuidePopup);

            const closeButton = userGuidePopup.querySelector('.close-user-guide');
            closeButton.addEventListener('click', () => {
                document.body.removeChild(userGuidePopup);
            });
        })
        .catch(error => console.error('Error loading user guide:', error));
});

// Rest of the existing code...
