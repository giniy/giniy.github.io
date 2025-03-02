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
    document.addEventListener("DOMContentLoaded", function () {
        fetchGitHubRepos();
    });

    async function fetchGitHubRepos() {
        const username = "gniis";  
        try {
            const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
            const repos = await response.json();
            repos.forEach(repo => {
                const repoCard = document.createElement("div");
                repoCard.classList.add("repo-card");
                repoCard.innerHTML = `
                    <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
                    <p>${repo.description ? repo.description : "No description available"}</p>`;
            });
        } catch (error) {
            console.error("Failed to fetch GitHub repositories:", error);
        }
    }