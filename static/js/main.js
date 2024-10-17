document.addEventListener('DOMContentLoaded', function() {
    // Existing code...

    // Get Common Overlay Element
    const overlay = document.getElementById('overlay');

    // Get Pop-up Elements
    const directionsPopup = document.getElementById('directionsPopup');
    const exportOptionsPopup = document.getElementById('exportOptionsPopup');

    // Get Trigger Buttons
    const viewDirections = document.getElementById('viewDirections');
    const exportButton = document.getElementById('exportButton');

    // Get Close Buttons
    const closePopups = document.querySelectorAll('.close-popup');

    // Variable to keep track of the last focused element
    let lastFocusedElement = null;

    // Function to Show a Pop-up
    function showPopup(popup) {
        lastFocusedElement = document.activeElement;
        overlay.classList.add('active');
        popup.classList.remove('hidden');
        // Set focus to the first focusable element in the pop-up
        const focusableElements = popup.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length) {
            focusableElements[0].focus();
        }
        // Prevent scrolling on the body
        document.body.style.overflow = 'hidden';
    }

    // Function to Hide a Pop-up
    function hidePopup(popup) {
        popup.classList.add('hidden');
        // If no other pop-ups are visible, hide the overlay
        const anyVisible = document.querySelectorAll('.popup-content:not(.hidden)');
        if (anyVisible.length === 0) {
            overlay.classList.remove('active');
            // Restore scrolling
            document.body.style.overflow = '';
        }
        // Return focus to the last focused element
        if (lastFocusedElement) {
            lastFocusedElement.focus();
            lastFocusedElement = null;
        }
    }

    // Event Listener to Open View Directions Pop-up
    if (viewDirections) {
        viewDirections.addEventListener('click', function() {
            showPopup(directionsPopup);
        });
    }

    // Event Listener to Open Export Options Pop-up
    if (exportButton) {
        exportButton.addEventListener('click', function() {
            showPopup(exportOptionsPopup);
        });
    }

    // Event Listeners to Close Pop-ups
    closePopups.forEach(btn => {
        btn.addEventListener('click', function() {
            const popup = this.closest('.popup-content');
            hidePopup(popup);
        });
    });

    // Event Listener to Close Pop-ups When Clicking on the Overlay
    if (overlay) {
        overlay.addEventListener('click', function(event) {
            // Ensure that clicks on the overlay itself (not on the pop-up content) close the pop-up
            if (event.target === overlay) {
                const visiblePopups = document.querySelectorAll('.popup-content:not(.hidden)');
                visiblePopups.forEach(popup => hidePopup(popup));
            }
        });
    }

    // Optional: Close Pop-up with the 'Esc' Key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const visiblePopups = document.querySelectorAll('.popup-content:not(.hidden)');
            visiblePopups.forEach(popup => hidePopup(popup));
        }
    });

    // Remove blue background from title of change text box when typing
    const changeTitleInput = document.getElementById('changeTitle');
    if (changeTitleInput) {
        changeTitleInput.addEventListener('focus', function() {
            this.style.backgroundColor = 'var(--card-bg)';
        });
        changeTitleInput.addEventListener('blur', function() {
            this.style.backgroundColor = '';
        });
    }

    // Existing code...
});
