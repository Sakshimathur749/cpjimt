// ============================================================
// MOBILE MENU LOGIC
// ============================================================
document.addEventListener('DOMContentLoaded', function () {
  const openBtn = document.getElementById('mobMenuOpenBtn');
  const overlay = document.getElementById('mobMenuOverlay');
  const drawer = document.getElementById('mobMenuDrawer');
  const panels = document.getElementById('mobMenuPanels');

  if (!openBtn || !drawer) return;

  function openMenu() {
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    // reset to level 0
    setTimeout(() => {
      document.querySelectorAll('.mob-panel').forEach(p => p.classList.remove('active'));
      const root = document.querySelector('.mob-panel[data-level="0"]');
      if (root) root.classList.add('active');
      if (panels) panels.style.transform = 'translateX(0)';
    }, 300);
  }

  openBtn.addEventListener('click', openMenu);
  overlay.addEventListener('click', closeMenu);

  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('mob-close-btn')) closeMenu();
  });

  document.addEventListener('click', function (e) {
    const row = e.target.closest('.mob-menu-row.has-child');
    if (!row) return;
    const targetId = row.getAttribute('data-target');
    const targetPanel = document.getElementById(targetId);
    if (!targetPanel) return;
    const currentLevel = parseInt(row.closest('.mob-panel').getAttribute('data-level'));
    document.querySelectorAll('.mob-panel').forEach(p => p.classList.remove('active'));
    targetPanel.classList.add('active');
    panels.style.transform = `translateX(-${(currentLevel + 1) * 100}%)`;
  });

  document.addEventListener('click', function (e) {
    const backBtn = e.target.closest('.mob-back-btn');
    if (!backBtn) return;
    const currentPanel = backBtn.closest('.mob-panel');
    const currentLevel = parseInt(currentPanel.getAttribute('data-level'));
    currentPanel.classList.remove('active');
    const prevLevel = currentLevel - 1;
    panels.style.transform = `translateX(-${prevLevel * 100}%)`;
    // activate the parent panel at prevLevel
    const allPanels = document.querySelectorAll(`.mob-panel[data-level="${prevLevel}"]`);
    if (allPanels.length === 1) {
      allPanels[0].classList.add('active');
    }
  });
});

// ============================================================
// VIDEO MODAL
// ============================================================
document.addEventListener('DOMContentLoaded', function () {
  const videoModal = document.getElementById('videoModal');
  if (!videoModal) return;

  const videoFrame = document.getElementById('videoFrame');
  const closeModal = document.getElementById('closeModal');
  const videoThumbnails = document.querySelectorAll('.video-thumbnail');

  videoThumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', function () {
      const videoUrl = this.getAttribute('data-video');
      videoFrame.src = videoUrl + '?autoplay=1&rel=0&modestbranding=1';
      videoModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeVideoModal() {
    videoModal.classList.remove('active');
    videoFrame.src = '';
    document.body.style.overflow = '';
  }

  closeModal.addEventListener('click', closeVideoModal);
  videoModal.addEventListener('click', function (e) {
    if (e.target === videoModal) closeVideoModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && videoModal.classList.contains('active')) closeVideoModal();
  });
});

// ============================================================
// COUNTER ANIMATION
// ============================================================
document.addEventListener('DOMContentLoaded', function () {
  const counters = document.querySelectorAll('.home-banner-stat-number');
  const statsSection = document.querySelector('.stats-section-main');

  if (!counters.length || !statsSection) return;

  let hasAnimated = false;

  function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/\D/g, ''));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    const suffix = element.textContent.replace(/[0-9]/g, ''); // Get the '+' sign

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target.toLocaleString() + suffix;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current).toLocaleString() + suffix;
      }
    }, 16);
  }

  function checkScroll() {
    if (hasAnimated) return;

    const sectionTop = statsSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (sectionTop < windowHeight * 0.8) {
      hasAnimated = true;
      counters.forEach(counter => animateCounter(counter));
    }
  }

  // Check on scroll
  window.addEventListener('scroll', checkScroll);

  // Check on load in case section is already visible
  checkScroll();
});
