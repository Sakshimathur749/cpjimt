// ============================================================
// MOBILE MENU LOGIC
// ============================================================
document.addEventListener('DOMContentLoaded', function () {
  const openBtn = document.getElementById('mobMenuOpenBtn');
  const overlay = document.getElementById('mobMenuOverlay');
  const drawer = document.getElementById('mobMenuDrawer');
  const panels = document.getElementById('mobMenuPanels');

  if (!openBtn || !drawer || !panels) return;

  // Track navigation history
  let navigationStack = [];

  function openMenu() {
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Reset to root panel
    const rootPanel = document.querySelector('.mob-panel[data-level="0"]');
    if (rootPanel) {
      navigationStack = [rootPanel];
      showPanel(rootPanel);
    }
  }

  function closeMenu() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';

    // Reset after animation
    setTimeout(() => {
      navigationStack = [];
      document.querySelectorAll('.mob-panel').forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none';
      });
      const rootPanel = document.querySelector('.mob-panel[data-level="0"]');
      if (rootPanel) {
        rootPanel.classList.add('active');
        rootPanel.style.display = 'flex';
      }
      if (panels) panels.style.transform = 'translateX(0)';
    }, 300);
  }

  function showPanel(targetPanel) {
    if (!targetPanel) return;

    // Hide all panels
    document.querySelectorAll('.mob-panel').forEach(p => {
      p.classList.remove('active');
      p.style.display = 'none';
    });

    // Show and activate target panel
    targetPanel.style.display = 'flex';
    // Force reflow
    targetPanel.offsetHeight;
    targetPanel.classList.add('active');
  }

  openBtn.addEventListener('click', openMenu);
  overlay.addEventListener('click', closeMenu);

  // Close button clicks
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('mob-close-btn')) {
      closeMenu();
    }
  });

  // Forward navigation (clicking menu items with children)
  document.addEventListener('click', function (e) {
    const row = e.target.closest('.mob-menu-row.has-child');
    if (!row) return;

    const targetId = row.getAttribute('data-target');
    const targetPanel = document.getElementById(targetId);

    if (!targetPanel) {
      console.error('Target panel not found:', targetId);
      return;
    }

    // Add to navigation stack
    navigationStack.push(targetPanel);

    // Show the target panel
    showPanel(targetPanel);
  });

  // Back button navigation
  document.addEventListener('click', function (e) {
    const backBtn = e.target.closest('.mob-back-btn');
    if (!backBtn) return;

    // Remove current panel from stack
    if (navigationStack.length > 1) {
      navigationStack.pop();

      // Show previous panel
      const previousPanel = navigationStack[navigationStack.length - 1];
      showPanel(previousPanel);
    }
  });

  // Initialize: show only root panel
  const rootPanel = document.querySelector('.mob-panel[data-level="0"]');
  if (rootPanel) {
    rootPanel.style.display = 'flex';
    rootPanel.classList.add('active');
  }
  document.querySelectorAll('.mob-panel:not([data-level="0"])').forEach(p => {
    p.style.display = 'none';
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
