// Existing JavaScript content

// Update the clearAdvancedSettings function
function clearAdvancedSettings() {
    changeDescriptionInput.value = '';
    knowledgeRadios.forEach(radio => radio.checked = false);
    timelineRadios.forEach(radio => radio.checked = false);
    console.log('Advanced settings cleared');
    
    // Show a confirmation message to the user
    showPopup('Advanced settings have been cleared.');
}

// Add an event listener for the Clear All button
clearAdvancedButton.addEventListener('click', clearAdvancedSettings);

// Rest of the existing JavaScript content
