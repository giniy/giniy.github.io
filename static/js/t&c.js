    // Optional: Add additional JavaScript for interactive effects
// Example: Add a "back to top" button
document.addEventListener("DOMContentLoaded", function () {
    const backToTopButton = document.createElement("button");
    backToTopButton.innerText = "↑";
    backToTopButton.classList.add("back-to-top");
    document.body.appendChild(backToTopButton);

    backToTopButton.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            backToTopButton.style.display = "block";
        } else {
            backToTopButton.style.display = "none";
        }
    });
});