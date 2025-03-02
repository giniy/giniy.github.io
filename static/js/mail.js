document.addEventListener("DOMContentLoaded", function () {
    trackVisitCount();
});

function trackVisitCount() {
    if (typeof Storage !== "undefined") {
        let visitCount = localStorage.getItem('visitCount');
        visitCount = visitCount ? parseInt(visitCount, 10) + 1 : 1;

        localStorage.setItem('visitCount', visitCount);

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