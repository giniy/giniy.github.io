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
        // Function to play a song
        function playSong(songFile, songName, posterFile, artistName, albumName) {
            const audioPlayer = document.getElementById('audio-player');
            const nowPlaying = document.getElementById('now-playing');
            const songPoster = document.getElementById('song-poster');
            const songDetails = document.getElementById('song-details');

            // Set the song source
            audioPlayer.src = songFile;

            // Update the "Now Playing" text
            nowPlaying.textContent = "Now Playing: " + songName;

            // Update the song poster
            songPoster.src = posterFile;
            songPoster.style.display = "block";

            // Update the song details
            songDetails.innerHTML = `<strong>Artist:</strong> ${artistName}<br><strong>Album:</strong> ${albumName}`;

            // Play the song
            audioPlayer.play();
        }
            function buySong(songName) {
                // Replace the alert with your actual purchase page redirection logic
                alert('Redirecting to purchase page for ' + songName);
                window.location.href = 'https://example.com/buy/' + encodeURIComponent(songName);
            }