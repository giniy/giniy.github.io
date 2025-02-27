function trackVisitCount() {
    // Check if localStorage is supported
    if (typeof Storage !== "undefined") {
        // Get the current visit count from localStorage
        let visitCount = localStorage.getItem('visitCount');

        // If visitCount doesn't exist, initialize it to 1; otherwise, increment it
        visitCount = visitCount ? Number(visitCount) + 1 : 1;

        // Save the updated visit count to localStorage
        localStorage.setItem('visitCount', visitCount);

        // Display the visit count in the DOM
        const visitCountElement = document.getElementById('visitCount');
        if (visitCountElement) {
            visitCountElement.textContent = visitCount;
        } else {
            console.warn("Element with ID 'visitCount' not found in the DOM.");
        }
    } else {
        console.warn("localStorage is not supported in this browser.");
    }
}

// Call the function to track and display the visit count
trackVisitCount();