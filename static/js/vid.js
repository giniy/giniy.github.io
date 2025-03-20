document.addEventListener('DOMContentLoaded', function () {
    // Get all video thumbnails
    const thumbnails = document.querySelectorAll('.video-thumbnail');

    // Get the main video player element
    const mainVideo = document.getElementById('main-video');

    // Add click event listener to each thumbnail
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function () {
            // Get the video source from the data-video-src attribute
            const videoSrc = thumbnail.getAttribute('data-video-src');

            // Update the main video player's source
            mainVideo.querySelector('source').src = videoSrc;

            // Load the new video
            mainVideo.load();
            mainVideo.play();
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const thumbnails = document.querySelectorAll('.video-thumbnail');
    const mainVideo = document.getElementById('main-video');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const videoList = document.querySelector('.video-list');

    // Function to handle thumbnail clicks
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function () {
            const videoSrc = thumbnail.getAttribute('data-video-src');
            mainVideo.querySelector('source').src = videoSrc;
            mainVideo.load();
            mainVideo.play();

            // Update the title and channel below the video player
            const title = thumbnail.querySelector('h3').textContent;
            const channel = thumbnail.querySelector('p').textContent;
            document.querySelector('.video-player h3').textContent = title;
            document.querySelector('.video-player p').textContent = channel;
        });
    });

    // Function to handle search
    function filterVideos(query) {
        thumbnails.forEach(thumbnail => {
            const title = thumbnail.querySelector('h3').textContent.toLowerCase();
            const channel = thumbnail.querySelector('p').textContent.toLowerCase();

            if (title.includes(query) || channel.includes(query)) {
                thumbnail.style.display = 'block'; // Show matching thumbnails
            } else {
                thumbnail.style.display = 'none'; // Hide non-matching thumbnails
            }
        });
    }

    // Add click event listener to the search button
    searchButton.addEventListener('click', function () {
        const query = searchInput.value.trim().toLowerCase();
        filterVideos(query);
    });

    // Add real-time search as the user types
    searchInput.addEventListener('input', function () {
        const query = searchInput.value.trim().toLowerCase();
        filterVideos(query);
    });
});