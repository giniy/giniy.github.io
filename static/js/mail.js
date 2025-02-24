document.addEventListener("DOMContentLoaded", function() {
emailjs.init("ZZLSDWRpVQ47uOfh2"); // Replace with actual EmailJS Public Key
});


document.getElementById("contactForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent form from reloading the page
    try {
        const response = await emailjs.send("service_f3yw8gb", "template_lcn60zm", {
            from_name: document.getElementById("name").value,
            from_email: document.getElementById("email").value,
            message: document.getElementById("message").value
        });
        console.log("✅ Email sent successfully!", response);
        showAlert("✅ Email sent successfully!");

    } catch (error) {
        console.error("❌ Failed to send email:", error);
        showAlert("❌ Failed to send email. Check the console for details.");
    }
});

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