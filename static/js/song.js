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
async function decryptAudioFile(encryptedData) {
    try {
        // Convert the secret key to a CryptoKey using PBKDF2
        const encoder = new TextEncoder();
        const keyData = encoder.encode("7x!Lq9@Zv2$pTm5W#8Rn&Ks"); // Your encryption key
        const salt = encryptedData.slice(8, 16); // Extract salt from the encrypted file

        const baseKey = await crypto.subtle.importKey(
            'raw', // Key format
            keyData,
            { name: 'PBKDF2' }, // Key derivation algorithm
            false, // Not extractable
            ['deriveKey'] // Usage
        );

        const cryptoKey = await crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: 100000, // Match the -iter value used in OpenSSL
                hash: 'SHA-256', // Hash function used by OpenSSL
            },
            baseKey,
            { name: 'AES-CBC', length: 256 }, // AES-256-CBC
            false, // Not extractable
            ['decrypt'] // Usage
        );

        // Extract the IV (first 16 bytes after the salt)
        const iv = encryptedData.slice(16, 32);
        const data = encryptedData.slice(32);

        // Decrypt the audio data
        const decryptedData = await crypto.subtle.decrypt(
            { name: 'AES-CBC', iv },
            cryptoKey,
            data
        );

        return decryptedData;
    } catch (error) {
        console.error('Decryption failed:', error);
        throw error;
    }
}

// Define playSong globally
window.playSong = async function (songUrl, songTitle, posterUrl, album, artist) {
    if (!audioPlayer) {
        console.error('audioPlayer is not initialized!');
        return;
    }

    // Check if the file is encrypted (.enc)
    if (songUrl.endsWith('.enc')) {
        try {
            // Fetch the encrypted audio file
            const response = await fetch(songUrl);
            const encryptedData = await response.arrayBuffer();

            // Decrypt the audio file
            const decryptedData = await decryptAudioFile(encryptedData);

            // Create a Blob from the decrypted data
            const blob = new Blob([decryptedData], { type: 'audio/mp3' });
            const url = URL.createObjectURL(blob);

            // Set the audio source and load the song
            audioPlayer.src = url;
        } catch (error) {
            console.error('Error decrypting or playing the audio file:', error);
            alert('Failed to decrypt or play the audio file.');
            return;
        }
    } else {
        // For non-encrypted files, set the source directly
        audioPlayer.src = songUrl;
    }

    // Load the audio player
    audioPlayer.load();

    // Show the custom audio player
    customPlayer.style.display = 'block';

    // Play the song
    audioPlayer.play();
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>'; // Pause icon

    // Update the "Now Playing" text (if you have this element)
    const nowPlaying = document.getElementById('now-playing');
    if (nowPlaying) {
        nowPlaying.textContent = `Now Playing: ${songTitle}`;
    }

    // Update the song poster (if you have this element)
    const songPoster = document.getElementById('song-poster');
    if (songPoster) {
        songPoster.src = posterUrl;
        songPoster.style.display = 'block';
    }

    // Update the song details (if you have this element)
    const songDetails = document.getElementById('song-details');
    if (songDetails) {
        songDetails.textContent = `Album: ${album} | Artist: ${artist}`;
    }
};

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