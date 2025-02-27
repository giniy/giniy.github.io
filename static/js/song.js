// Function to play a song
// Define audioPlayer and other variables globally
let audioPlayer;
let customPlayer;
let playPauseBtn;
emailjs.init("ZZLSDWRpVQ47uOfh2"); // Replace with actual EmailJS Public Key
// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize audioPlayer and other elements
    audioPlayer = document.getElementById('audio-player');
    customPlayer = document.querySelector('.custom-audio-player');
    playPauseBtn = document.getElementById('play-pause-btn');
    if (!audioPlayer) {
        console.error('audioPlayer element not found!');
        return;
    }
    // Play/Pause functionality
    playPauseBtn.addEventListener('click', () => {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>'; // Pause icon
        } else {
            audioPlayer.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>'; // Play icon
        }
    });
    // Update progress bar
    const progressBar = document.querySelector('.progress-bar');
    const progressContainer = document.querySelector('.progress-container');
    audioPlayer.addEventListener('timeupdate', () => {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.style.width = `${progress}%`;
        // Update time display
        const currentTimeDisplay = document.getElementById('current-time');
        const durationDisplay = document.getElementById('duration');
        currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
        if (!isNaN(audioPlayer.duration)) {
            durationDisplay.textContent = formatTime(audioPlayer.duration);
        }
    });
    // Seek functionality
    progressContainer.addEventListener('click', (e) => {
        const clickX = e.offsetX;
        const width = progressContainer.clientWidth;
        const seekTime = (clickX / width) * audioPlayer.duration;
        audioPlayer.currentTime = seekTime;
    });
    // Mute/Unmute functionality
    const muteBtn = document.getElementById('mute-btn');
    muteBtn.addEventListener('click', () => {
        if (audioPlayer.muted) {
            audioPlayer.muted = false;
            muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>'; // Volume up icon
        } else {
            audioPlayer.muted = true;
            muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>'; // Volume mute icon
        }
    });
});
// Format time (MM:SS)
function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// playSong function



window.playSong = function(songUrl, songTitle, posterUrl, album, artist, lyricsFile) {
    if (!audioPlayer) {
        console.error('audioPlayer is not initialized!');
        return;
    }

    // Remove previous lyrics event listener before adding a new one
    audioPlayer.removeEventListener("timeupdate", handleLyricsUpdate);

    // Set the audio source and load the song
    audioPlayer.src = songUrl;
    audioPlayer.load();
    customPlayer.style.display = 'block';
    audioPlayer.play();
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>'; 

    // Update UI elements
    document.getElementById('now-playing').textContent = `Now Playing: ${songTitle}`;
    
    const songPoster = document.getElementById('song-poster');
    songPoster.src = posterUrl;
    songPoster.style.display = 'block';

    document.getElementById('song-details').textContent = `Album: ${album} | Artist: ${artist}`;

    // Reset lyrics display
    const lyricsContainer = document.getElementById('lyrics-container');
    lyricsContainer.innerHTML = "Loading lyrics...";

    // Fetch and parse the LRC file
    fetch(lyricsFile)
        .then(response => {
            if (!response.ok) throw new Error("Lyrics file not found");
            return response.text();
        })
        .then(data => {
            const lyricsArray = parseLRC(data);
            if (lyricsArray.length > 0) {
                displayLyrics(lyricsArray);
            } else {
                lyricsContainer.textContent = "Lyrics not available for this audio";
            }
        })
        .catch(() => {
            lyricsContainer.textContent = "Lyrics unavailable for this audio";
        });
};


// Function to parse LRC file and remove timestamps but keep all language text and [ ] braces

// Function to parse LRC file and remove timestamps but keep all language text and [ ] braces
function parseLRC(lrcText) {
    const lines = lrcText.split("\n");
    let lyricsArray = [];

    // Regex to match timestamps like [01:13.70] but NOT remove [ ] braces
    const timeRegex = /\[(\d+):(\d+\.\d+)\]/g;

    lines.forEach(line => {
        let cleanLine = line.replace(timeRegex, "").trim(); // Remove timestamps, keep braces

        // Keep all Unicode letters, matras (diacritics), spaces, and [ ] braces; remove special characters
        cleanLine = cleanLine.replace(/[^\p{L}\p{M}\s\[\]]/gu, "").replace(/\s+/g, " ").trim();

        if (cleanLine) {
            // Extract the first timestamp to use as the time reference
            const match = line.match(timeRegex);
            if (match) {
                const firstTimestamp = match[0].match(/(\d+):(\d+\.\d+)/);
                if (firstTimestamp) {
                    const minutes = parseInt(firstTimestamp[1]);
                    const seconds = parseFloat(firstTimestamp[2]);
                    let timeInSeconds = minutes * 60 + seconds;

                    // Show lyrics 2 seconds earlier
                    timeInSeconds = Math.max(0, timeInSeconds - 2); 

                    lyricsArray.push({ time: timeInSeconds, text: cleanLine });
                }
            }
        }
    });

    return lyricsArray;
}


// Global reference for event listener (to remove old one)
let handleLyricsUpdate;

// Function to display lyrics in sync with timestamps (real-time display)
// Function to display lyrics in sync with timestamps (real-time display)
function displayLyrics(lyricsArray) {
    const lyricsContainer = document.getElementById('lyrics-container');
    if (!lyricsContainer) return;

    let currentIndex = 0;

    // Remove old listener before adding a new one
    audioPlayer.removeEventListener("timeupdate", handleLyricsUpdate);

    handleLyricsUpdate = function () {
        const currentTime = audioPlayer.currentTime;

        // Find the current lyric line with a delay
        while (currentIndex < lyricsArray.length - 1 && lyricsArray[currentIndex + 1].time <= currentTime + 2) { // Add 2 seconds delay
            currentIndex++;
        }

        // Update the lyrics display (only letters and spaces)
        lyricsContainer.innerHTML = lyricsArray[currentIndex].text;
    };

    // Attach event listener
    audioPlayer.addEventListener("timeupdate", handleLyricsUpdate);
}

// end playSong


document.addEventListener('DOMContentLoaded', () => {
    // Get the visitCount element
    const visitCountElement = document.getElementById('visitCount');
    // Check if the element exists
    if (!visitCountElement) {
        console.error('visitCount element not found!');
        return;
    }

    // Update the visit count
    let visitCount = localStorage.getItem('visitCount') || 0;
    visitCount = parseInt(visitCount) + 1;
    localStorage.setItem('visitCount', visitCount);
    visitCountElement.textContent = visitCount;
});
// Paypal integration
// function buySong(songName, price) {
//     let userConfirmed = confirm('Do you want to proceed with purchasing ' + songName + '?');
//     if (userConfirmed) {
//         alert('Redirecting to purchase page for ' + songName);
//         window.location.href = 'purchase.html?songName=' + encodeURIComponent(songName) + '&price=' + encodeURIComponent(price);
//     } else {
//         alert('Purchase canceled.');
//     }
// }
function showAlert(message, type) {
    let alertBox = document.createElement("div");
    alertBox.classList.add("alert", type);
    alertBox.textContent = message;
    document.body.appendChild(alertBox);
    setTimeout(() => {
        alertBox.style.opacity = "1";
        alertBox.style.transform = "translate(-50%, -50%) scale(1.1)";
    }, 10);
    setTimeout(() => {
        alertBox.style.opacity = "0";
        alertBox.style.transform = "translate(-50%, -50%) scale(0.8)";
        setTimeout(() => alertBox.remove(), 700);
    }, 4000);
}

function showEmailModal(songName, price) {
    let modal = document.createElement("div");
    modal.classList.add("modal-content");
    modal.innerHTML = `

        <p>Please enter your email to proceed with the download request:</p>

        <input type="email" id="userEmail" placeholder="Enter your email" required>

        <div class="modal-buttons">

            <button onclick="submitEmail('${songName}', '${price}')">Send</button>

            <button onclick="closeModal()">Cancel</button>

        </div>

    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add("show"), 10);
    modal.style.display = "block";
}

function closeModal() {
    let modal = document.querySelector(".modal-content");
    if (modal) {
        modal.classList.remove("show");
        setTimeout(() => modal.remove(), 300);
    }
}

function submitEmail(songName, price) {
    var userEmail = document.getElementById("userEmail").value;
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userEmail || userEmail.trim() === "") {
        showAlert("Email is required to proceed.", "error");
        return;
    }
    if (!emailPattern.test(userEmail)) {
        showAlert("Please enter a valid email address.", "error");
        return;
    }
    closeModal();
    buySong(songName, price, userEmail);
}

function buySong(songName, price, userEmail = null) {
    if (!userEmail) {
        showEmailModal(songName, price);
        return;
    }
    var templateParams = {
        song: songName,
        price: price,
        user_email: userEmail,
        message: "I want to download : " + songName + " for $" + price,
    };
    emailjs.send("service_wvya9qv", "template_x4ggdpv", templateParams)
        .then(function(response) {
            console.log("SUCCESS!", response.status, response.text);
            showAlert("Download request sent! We will contact you at " + userEmail, "success");
        }, function(error) {
            console.log("FAILED...", error);
            showAlert("There was an error sending the email. Please try again later.", "error");
        });
}