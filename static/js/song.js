// Function to play a song
// Define audioPlayer and other variables globally
let audioPlayer;
let customPlayer;
let playPauseBtn;
emailjs.init("ZZLSDWRpVQ47uOfh2"); // Replace with actual EmailJS Public Key

// Encryption key (replace with your actual key)

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

// Function to decrypt an encrypted audio file


async function decryptAudioFile(encryptedFileUrl, secretKey) {
    try {
        // Fetch the encrypted file
        const response = await fetch(encryptedFileUrl);
        const encryptedData = await response.arrayBuffer();

        // Convert secretKey to a usable format
        const encoder = new TextEncoder();
        const keyMaterial = await window.crypto.subtle.importKey(
            "raw",
            encoder.encode(secretKey),
            { name: "PBKDF2" },
            false,
            ["deriveKey"]
        );

        // Derive AES Key
        const aesKey = await window.crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: encoder.encode("random-salt-1234"),  // Change this salt value
                iterations: 100000,
                hash: "SHA-256"
            },
            keyMaterial,
            { name: "AES-CBC", length: 256 },
            true,
            ["decrypt"]
        );

        // Extract IV from the encrypted data (First 16 bytes)
        const iv = new Uint8Array(encryptedData.slice(0, 16));
        const encryptedContent = new Uint8Array(encryptedData.slice(16));

        // Decrypt
        const decryptedAudio = await window.crypto.subtle.decrypt(
            { name: "AES-CBC", iv: iv },
            aesKey,
            encryptedContent
        );

        // Convert decrypted data to a Blob URL
        const blob = new Blob([decryptedAudio], { type: "audio/mp3" });
        return URL.createObjectURL(blob);

    } catch (error) {
        console.error("Error decrypting audio file:", error);
        throw new Error("Decryption failed");
    }
}

// Function to play the decrypted song
async function playSong(encryptedFileUrl, songTitle, posterUrl, album, artist) {
    try {
        const decryptedUrl = await decryptAudioFile(encryptedFileUrl, "7x!Lq9@Zv2$pTm5W#8Rn&Ks");

        audioPlayer.src = decryptedUrl;
        audioPlayer.load();
        audioPlayer.play();

        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>'; 

        // Update UI
        document.getElementById('now-playing').textContent = `Now Playing: ${songTitle}`;
        document.getElementById('song-poster').src = posterUrl;
        document.getElementById('song-details').textContent = `Album: ${album} | Artist: ${artist}`;

    } catch (error) {
        console.error("Error decrypting or playing the audio file:", error);
    }
}





// Visit count functionality
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

// Email and download functionality
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
        .then(function (response) {
            console.log("SUCCESS!", response.status, response.text);
            showAlert("Download request sent! We will contact you at " + userEmail, "success");
        }, function (error) {
            console.log("FAILED...", error);
            showAlert("There was an error sending the email. Please try again later.", "error");
        });
}