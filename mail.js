(function() {
    emailjs.init("service_f3yw8gb"); // Replace with your EmailJS user ID
})();

document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    emailjs.send("service_f3yw8gb", "template_lcn60zm", {
        from_name: document.getElementById("name").value,
        from_email: document.getElementById("email").value,
        message: document.getElementById("message").value
    }).then(
        function(response) {
            alert("Email sent successfully!");
        },
        function(error) {
            alert("Failed to send email: " + error);
        }
    );
});