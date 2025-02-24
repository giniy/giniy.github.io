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
        const response = await fetch(encryptedFileUrl);
        if (!response.ok) throw new Error("Failed to fetch encrypted file");

        const encryptedData = await response.arrayBuffer();
        const keyMaterial = await getKeyMaterial(secretKey);
        const key = await deriveKey(keyMaterial);

        const iv = encryptedData.slice(0, 16); // Extract IV (first 16 bytes)
        const encryptedContent = encryptedData.slice(16);

        const decryptedData = await crypto.subtle.decrypt(
            { name: "AES-CBC", iv: iv },
            key,
            encryptedContent
        );

        return new Blob([decryptedData], { type: "audio/mp3" });

    } catch (error) {
        console.error("Error decrypting audio file:", error);
        return null;
    }
}

async function getKeyMaterial(secret) {
    const enc = new TextEncoder();
    return await crypto.subtle.importKey(
        "raw",
        enc.encode(secret),
        { name: "PBKDF2" },
        false,
        ["deriveBits", "deriveKey"]
    );
}

async function deriveKey(keyMaterial) {
    return await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: new TextEncoder().encode("your-salt-value"),
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-CBC", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );
}

async function playSong(encryptedFileUrl, songTitle, posterUrl, album, artist) {
    try {
        const secretKey = "7x!Lq9@Zv2$pTm5W#8Rn&Ks"; // Use the same key as used in encryption
        const decryptedBlob = await decryptAudioFile(encryptedFileUrl, secretKey);
        if (!decryptedBlob) throw new Error("Decryption failed");

        const audioPlayer = document.getElementById('audio-player');
        if (!audioPlayer) throw new Error("Audio player element not found");

        audioPlayer.src = URL.createObjectURL(decryptedBlob);
        audioPlayer.load();
        audioPlayer.play();

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