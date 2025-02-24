async function fetchGitHubRepos() {
    const username = "techcure"; // Change this to your GitHub username
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
    const repos = await response.json();
    const repoList = document.getElementById("repo-list");
    repoList.innerHTML = ""; 
    repos.forEach(repo => {
        const repoCard = document.createElement("div");
        repoCard.classList.add("repo-card");
        repoCard.innerHTML = `
            <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
            <p>${repo.description ? repo.description : "No description available"}</p>`;
        repoList.appendChild(repoCard);
    });
}
fetchGitHubRepos();


// Get visit count from local storage

let visitCount = localStorage.getItem('visitCount');
    // If it's the first visit, set visitCount to 1
    if (!visitCount) {
        visitCount = 1;
    } else {
        visitCount = parseInt(visitCount) + 1; // Increment the visit count
    }
    // Store updated visit count in local storage
    localStorage.setItem('visitCount', visitCount);

    // Display visit count on the webpage
document.getElementById('visitCount').textContent = visitCount;