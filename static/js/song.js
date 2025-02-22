// Function to play a song
// Define audioPlayer and other variables globally
let audioPlayer;
let customPlayer;
let playPauseBtn;

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

// Define playSong globally
window.playSong = function (songUrl, songTitle, posterUrl, album, artist) {
    if (!audioPlayer) {
        console.error('audioPlayer is not initialized!');
        return;
    }
    // Set the audio source and load the song
    audioPlayer.src = songUrl;
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
  function buySong(songName, price) {
      // Ask user for their email
      var userEmail = prompt("Please enter your email to proceed with the download request.");

      // If the user cancels or enters an empty email, stop the process
      if (!userEmail || userEmail.trim() === "") {
          alert("Email is required to proceed.");
          return;
      }

      // Prepare the parameters for EmailJS
      var templateParams = {
          song: songName,
          price: price,
          user_email: userEmail,  // Include user's email
          message: "I want to download : " + songName + " for $" + price,
      };

      // Send email using EmailJS
      emailjs.send("service_wvya9qv", "template_x4ggdpv", templateParams)
          .then(function(response) {
              console.log("SUCCESS!", response.status, response.text);
              alert("Download request sent! We will contact you at " + userEmail);
          }, function(error) {
              console.log("FAILED...", error);
              alert("There was an error sending the email. Please try again later.");
          });
  }