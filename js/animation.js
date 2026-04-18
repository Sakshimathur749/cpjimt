// Banner entrance animation — triggers on every page load / refresh
document.addEventListener('DOMContentLoaded', function () {
  const content = document.querySelector('.home-banner-content');
  const images = document.querySelector('.home-banner-images');

  if (content) content.classList.add('banner-animate-content');
  if (images) images.classList.add('banner-animate-image');

  // Scroll-in animation helper — observes any set of elements
  function observeCards(selector, visibleClass, threshold) {
    var cards = document.querySelectorAll(selector);
    if (!cards.length) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add(visibleClass || 'card-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: threshold || 0.15 });
    cards.forEach(function (card) { observer.observe(card); });
  }

  // Programs Offered cards
  observeCards('.programs-offered-card', 'card-visible');

  // Why Love cards
  observeCards('.why-love-card', 'card-visible');

  // Gallery items — trigger when the grid comes into view
  var galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length) {
    var galleryObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        galleryItems.forEach(function (item) {
          item.classList.add('gallery-visible');
        });
        galleryObserver.disconnect();
      }
    }, { threshold: 0.1 });
    galleryObserver.observe(document.querySelector('.student-life-grid'));
  }

  // =====================
  // Gallery Lightbox
  // =====================
  var modal = document.getElementById('galleryModal');
  var modalImg = document.getElementById('galleryModalImg');
  var closeBtn = document.getElementById('galleryClose');
  var prevBtn = document.getElementById('galleryPrev');
  var nextBtn = document.getElementById('galleryNext');
  var backdrop = document.getElementById('galleryBackdrop');
  var counter = document.getElementById('galleryCounter');

  if (!modal) return;

  var images_list = [];
  var currentIndex = 0;

  // Build image list from gallery items
  document.querySelectorAll('.gallery-item').forEach(function (item) {
    var img = item.querySelector('.gallery-img');
    if (img) images_list.push(img.src);
  });

  function openModal(index) {
    currentIndex = index;
    modalImg.src = images_list[currentIndex];
    updateCounter();
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function showImage(index) {
    modalImg.classList.add('is-switching');
    setTimeout(function () {
      currentIndex = (index + images_list.length) % images_list.length;
      modalImg.src = images_list[currentIndex];
      updateCounter();
      modalImg.classList.remove('is-switching');
    }, 180);
  }

  function updateCounter() {
    counter.textContent = (currentIndex + 1) + ' / ' + images_list.length;
  }

  // Click on gallery item
  document.querySelectorAll('.gallery-item').forEach(function (item) {
    item.addEventListener('click', function () {
      openModal(parseInt(item.getAttribute('data-index')));
    });
  });

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  prevBtn.addEventListener('click', function () { showImage(currentIndex - 1); });
  nextBtn.addEventListener('click', function () { showImage(currentIndex + 1); });

  // Keyboard navigation
  document.addEventListener('keydown', function (e) {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'Escape') closeModal();
  });
});
