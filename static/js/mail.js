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
        alert("Email sent successfully!");
    } catch (error) {
        console.error("❌ Failed to send email:", error);
        alert("Failed to send email. Check the console for details.");
    }
});
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