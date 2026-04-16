// Video Modal Functionality
document.addEventListener('DOMContentLoaded', function () {
  const videoModal = document.getElementById('videoModal');
  const videoFrame = document.getElementById('videoFrame');
  const closeModal = document.getElementById('closeModal');
  const videoThumbnails = document.querySelectorAll('.video-thumbnail');

  // Open modal and play video
  videoThumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', function () {
      const videoUrl = this.getAttribute('data-video');

      // Add autoplay parameter to the video URL
      const autoplayUrl = videoUrl + '?autoplay=1&rel=0&modestbranding=1';

      videoFrame.src = autoplayUrl;
      videoModal.classList.add('active');

      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    });
  });

  // Close modal function
  function closeVideoModal() {
    videoModal.classList.remove('active');

    // Stop video by clearing the iframe src
    videoFrame.src = '';

    // Restore body scroll
    document.body.style.overflow = '';
  }

  // Close modal on close button click
  closeModal.addEventListener('click', closeVideoModal);

  // Close modal when clicking outside the video
  videoModal.addEventListener('click', function (e) {
    if (e.target === videoModal) {
      closeVideoModal();
    }
  });

  // Close modal on ESC key press
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && videoModal.classList.contains('active')) {
      closeVideoModal();
    }
  });
});
