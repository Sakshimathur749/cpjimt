// ============================================================
// MOBILE MENU LOGIC
// ============================================================
document.addEventListener("DOMContentLoaded", function () {
  const openBtn = document.getElementById("mobMenuOpenBtn");
  const overlay = document.getElementById("mobMenuOverlay");
  const drawer = document.getElementById("mobMenuDrawer");
  const panels = document.getElementById("mobMenuPanels");

  if (!openBtn || !drawer || !panels) return;

  // Track navigation history
  let navigationStack = [];

  function openMenu() {
    drawer.classList.add("open");
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";

    // Reset to root panel
    const rootPanel = document.querySelector('.mob-panel[data-level="0"]');
    if (rootPanel) {
      navigationStack = [rootPanel];
      showPanel(rootPanel);
    }
  }

  function closeMenu() {
    drawer.classList.remove("open");
    overlay.classList.remove("open");
    document.body.style.overflow = "";

    // Reset after animation
    setTimeout(() => {
      navigationStack = [];
      document.querySelectorAll(".mob-panel").forEach((p) => {
        p.classList.remove("active");
        p.style.display = "none";
      });
      const rootPanel = document.querySelector('.mob-panel[data-level="0"]');
      if (rootPanel) {
        rootPanel.classList.add("active");
        rootPanel.style.display = "flex";
      }
      if (panels) panels.style.transform = "translateX(0)";
    }, 300);
  }

  function showPanel(targetPanel) {
    if (!targetPanel) return;

    // Hide all panels
    document.querySelectorAll(".mob-panel").forEach((p) => {
      p.classList.remove("active");
      p.style.display = "none";
    });

    // Show and activate target panel
    targetPanel.style.display = "flex";
    // Force reflow
    targetPanel.offsetHeight;
    targetPanel.classList.add("active");
  }

  openBtn.addEventListener("click", openMenu);
  overlay.addEventListener("click", closeMenu);

  // Close button clicks
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("mob-close-btn")) {
      closeMenu();
    }
  });

  // Forward navigation (clicking menu items with children)
  document.addEventListener("click", function (e) {
    const row = e.target.closest(".mob-menu-row.has-child");
    if (!row) return;

    const targetId = row.getAttribute("data-target");
    const targetPanel = document.getElementById(targetId);

    if (!targetPanel) {
      console.error("Target panel not found:", targetId);
      return;
    }

    // Add to navigation stack
    navigationStack.push(targetPanel);

    // Show the target panel
    showPanel(targetPanel);
  });

  // Back button navigation
  document.addEventListener("click", function (e) {
    const backBtn = e.target.closest(".mob-back-btn");
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
    rootPanel.style.display = "flex";
    rootPanel.classList.add("active");
  }
  document.querySelectorAll('.mob-panel:not([data-level="0"])').forEach((p) => {
    p.style.display = "none";
  });
});

// ============================================================
// VIDEO MODAL
// ============================================================
document.addEventListener("DOMContentLoaded", function () {
  const videoModal = document.getElementById("videoModal");
  if (!videoModal) return;

  const videoFrame = document.getElementById("videoFrame");
  const closeModal = document.getElementById("closeModal");
  const videoThumbnails = document.querySelectorAll(".video-thumbnail");

  videoThumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", function () {
      const videoUrl = this.getAttribute("data-video");
      videoFrame.src = videoUrl + "?autoplay=1&rel=0&modestbranding=1";
      videoModal.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  function closeVideoModal() {
    videoModal.classList.remove("active");
    videoFrame.src = "";
    document.body.style.overflow = "";
  }

  closeModal.addEventListener("click", closeVideoModal);
  videoModal.addEventListener("click", function (e) {
    if (e.target === videoModal) closeVideoModal();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && videoModal.classList.contains("active"))
      closeVideoModal();
  });
});

// ============================================================
// COUNTER ANIMATION
// ============================================================
document.addEventListener("DOMContentLoaded", function () {
  const counters = document.querySelectorAll(".home-banner-stat-number");
  const statsSection = document.querySelector(".stats-section-main");

  if (!counters.length || !statsSection) return;

  let hasAnimated = false;

  function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/\D/g, ""));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    const suffix = element.textContent.replace(/[0-9]/g, ""); // Get the '+' sign

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
      counters.forEach((counter) => animateCounter(counter));
    }
  }

  // Check on scroll
  window.addEventListener("scroll", checkScroll);

  // Check on load in case section is already visible
  checkScroll();
});
// ============================================================
// ARROW FIX
// ============================================================
document.querySelectorAll(".arrow-icon").forEach((icon) => {
  icon.addEventListener("click", function (e) {
    e.stopPropagation();
    this.classList.toggle("rotate");
  });
});

// ============================================================
// VIDEO GALLERY
// ============================================================
(function () {
  const grid = document.getElementById("gallery-grid");
  if (!grid) return;

  const showingText = document.getElementById("showing-text");
  const remainingCount = document.getElementById("remaining-count");
  const progressBar = document.getElementById("showing-progress");
  const bottomWrap = document.getElementById("bottom-wrap");

  const events = [
    /* SAME DATA */
  ];

  const PER_LOAD = 12;
  const TOTAL = events.length;
  let shown = 0;

  function updateUI() {
    if (!showingText || !remainingCount) return;

    const remaining = TOTAL - shown;

    showingText.textContent = `Showing ${shown} of ${TOTAL} videos`;
    remainingCount.textContent = remaining;

    if (progressBar) {
      progressBar.style.width = (shown / TOTAL) * 100 + "%";
    }

    if (remaining <= 0 && bottomWrap) {
      bottomWrap.style.display = "none";
    }
  }

  function loadMore() {
    if (!grid) return;

    const next = events.slice(shown, shown + PER_LOAD);
    next.forEach((ev) => {
      grid.insertAdjacentHTML("beforeend", `<div>${ev.title}</div>`);
    });

    shown += next.length;
    updateUI();
  }

  loadMore();
})();

// ============================================================
// BLOG
// ============================================================
(function () {
  const list = document.getElementById("blogCardsList");
  if (!list) return;
  const blogData = [
    {
      image: "images/blog-card-img-1.webp",
      title: "MBA in Marketing Career Scope and Opportunities",
      excerpt:
        "Every person wishing to build a great career for themselves in the marketing domain chooses an MBA in marketing. The curriculum of this post graduation course teaches you the skills and knowledge of understanding consumer behaviour, building brands from scratch, maintaining...",
    },
    {
      image: "images/blog-card-img-2.webp",
      title: "LLB Course Structure and Subjects Explained",
      excerpt:
        "The Bachelor of Laws (LLB) course is the first preference of any student who decides to build a career in the legal profession, whether it be as an advocate, legal advisor, corporate lawyer, or in judicial services. Before enrolling in...",
    },
    {
      image: "images/blog-card-img-1.webp",
      title: "Importance of Internship for BBA Students",
      excerpt:
        "A huge number of students pursue a Bachelor of Business Administration (BBA) degree to gain foundational knowledge of management, finance, marketing, and business operations in hopes of building a bigger career in those domains. However, to set the base of...",
    },
    {
      image: "images/blog-card-img-2.webp",
      title: "How to Become a Successful Lawyer After LLB",
      excerpt:
        "Becoming a lawyer is a dream of almost every student who has taken or wishes to take admission in the best law colleges in Delhi or any other city. To fulfill that dream, completing the LLB degree is so important...",
    },
  ];

  blogData.forEach((item, index) => {
    const isEven = index % 2 !== 0;
    list.innerHTML += `
          <div class="blog-card">
            <div class="blog-card__img-wrap">
              <img src="${item.image}" alt="${item.title}" class="blog-card__img" />
            </div>
            <div class="blog-card__content">
              <h3 class="blog-card__title font-poppins">${item.title}</h3>
              <p class="blog-card__excerpt font-robots">${item.excerpt}</p>
              <a href="#" class="blog-card__link font-poppins">Read More</a>
            </div>
          </div>`;
  });
})();

// ============================================================
// FORM
// ============================================================
(function () {
  const form = document.getElementById("grievanceForm");
  if (!form) return;

  const fileInput = document.getElementById("gf-doc");
  const fileName = document.getElementById("gf-file-name");

  if (fileInput && fileName) {
    fileInput.addEventListener("change", function () {
      fileName.textContent = this.files[0]?.name || "No file chosen";
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Form Submitted");
  });
})();

// ============================================================
// ADVISORY
// ============================================================
(function () {
  const grid = document.getElementById("board-grid");
  const pagination = document.getElementById("pagination");

  if (!grid || !pagination) return;
  const members = [
    {
      name: "Prof. (Dr.) Sanjiv Mittal",
      role: "Vice Chancellor",
      univ: "Sambalpur University, Orissa",
    },
    {
      name: "Prof.(Dr.) R. K. Mittal",
      role: "Vice Chancellor",
      univ: "CSJM Bhopal",
    },
    { name: "Prof.(Dr.) Neena Sinha", role: "Professor", univ: "UGNB, GGS/PU" },
    {
      name: "Prof.(Dr.) Amit Prakash Singh",
      role: "Professor",
      univ: "UBCT, GGS/PU",
    },
    { name: "Prof.(Dr.) P. C. Parida", role: "Director", univ: "NUEBS, Delhi" },
    {
      name: "Prof.(Dr.) Anuradha Jain",
      role: "Principal",
      univ: "VIPS, GGS/PU",
    },
    {
      name: "Prof.(Dr.) Namita Rajput",
      role: "Principal",
      univ: "Aurobindo College, University of Delhi",
    },
    {
      name: "Dr. Urvashi Sharma",
      role: "Associate Professor",
      univ: "Department of Economics, University of Delhi",
    },
    {
      name: "Prof. (Dr.) Sudhir Kr. Jain",
      role: "Professor",
      univ: "Department of Management Studies, IIT Delhi",
    },
    {
      name: "Prof. (Dr.) Alok Kumar",
      role: "Dean",
      univ: "Banaras Hindu University, Varanasi",
    },
    {
      name: "Prof. (Dr.) Sunita Kashyap",
      role: "Professor",
      univ: "Jawaharlal Nehru University, Delhi",
    },
    {
      name: "Dr. Rakesh Sharma",
      role: "Associate Professor",
      univ: "Indian Institute of Management, Lucknow",
    },
  ];

  let page = 1;
  function getPerPage() {
    if (window.innerWidth < 992) {
      return 8;
    }
    return 9;
  }
  function render() {
    const PER_PAGE = getPerPage();
    const slice = members.slice((page - 1) * PER_PAGE, page * PER_PAGE);
    const total = Math.ceil(members.length / PER_PAGE);

    // Cards
    grid.innerHTML = slice
      .map(
        (m) => `
    <div class="col-12 col-sm-6 col-lg-4 d-flex">
      <div class="member-card bg-white h-100 w-100">
        <div class="member-img bg-shad-12"></div>
        <div class="member-content">
          <p class="mb-1 fw-600 text-black fw-600 member-head font-poppins">${m.name}</p>
          <p class="mb-2 mb-md-4 fw-400 text-black fw-400 member-subhead font-poppins">${m.role}</p>
          <p class="mb-0 fw-600 color-3 font-poppins member-subhead">${m.univ}</p>
        </div>
      </div>
    </div>
  `,
      )
      .join("");

    // Pagination
    const btn = (p, label, disabled = false, active = false) =>
      `<li class="page-item${disabled ? " disabled" : ""}${active ? " active" : ""}">
      <a class="page-link" href="#" data-page="${p}">${label}</a>
    </li>`;

    let pHtml = btn(page - 1, "Prev", page === 1);
    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || Math.abs(i - page) <= 1) {
        pHtml += btn(i, i, false, i === page);
      } else if (Math.abs(i - page) === 2) {
        pHtml += `<li class="page-item disabled"><a class="page-link">...</a></li>`;
      }
    }
    pHtml += btn(page + 1, "Next", page === total);

    const ul = document.getElementById("pagination");
    ul.innerHTML = pHtml;
    ul.querySelectorAll("[data-page]").forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const p = +a.dataset.page;
        if (p >= 1 && p <= total && p !== page) {
          page = p;
          render();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
    });
  }

  render();
})();

// ============================================================
// DROPDOWN
// ============================================================
document.querySelectorAll(".dropdown-submenu > a").forEach(function (element) {
  element.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    let parent = this.closest(".dropdown-submenu");
    if (!parent) return;

    let isOpen = parent.classList.contains("open");

    document.querySelectorAll(".dropdown-submenu").forEach(function (sub) {
      sub.classList.remove("open");
    });

    if (!isOpen) parent.classList.add("open");
  });
});

document.querySelectorAll(".dropdown").forEach(function (dropdown) {
  dropdown.addEventListener("hidden.bs.dropdown", function () {
    document.querySelectorAll(".dropdown-submenu").forEach(function (sub) {
      sub.classList.remove("open");
    });
  });
});

// ============================================================
// Advisory Section
// ============================================================
(function () {
  const grid = document.getElementById("board-grid");
  const pagination = document.getElementById("pagination");

  if (!grid || !pagination) return;

  const members = [
    {
      name: "Prof. (Dr.) Sanjiv Mittal",
      role: "Vice Chancellor",
      univ: "Sambalpur University, Orissa",
    },
    {
      name: "Prof.(Dr.) R. K. Mittal",
      role: "Vice Chancellor",
      univ: "CSJM Bhopal",
    },
    { name: "Prof.(Dr.) Neena Sinha", role: "Professor", univ: "UGNB, GGS/PU" },
    {
      name: "Prof.(Dr.) Amit Prakash Singh",
      role: "Professor",
      univ: "UBCT, GGS/PU",
    },
    { name: "Prof.(Dr.) P. C. Parida", role: "Director", univ: "NUEBS, Delhi" },
    {
      name: "Prof.(Dr.) Anuradha Jain",
      role: "Principal",
      univ: "VIPS, GGS/PU",
    },
    {
      name: "Prof.(Dr.) Namita Rajput",
      role: "Principal",
      univ: "Aurobindo College, University of Delhi",
    },
    {
      name: "Dr. Urvashi Sharma",
      role: "Associate Professor",
      univ: "Department of Economics, University of Delhi",
    },
    {
      name: "Prof. (Dr.) Sudhir Kr. Jain",
      role: "Professor",
      univ: "Department of Management Studies, IIT Delhi",
    },
    {
      name: "Prof. (Dr.) Alok Kumar",
      role: "Dean",
      univ: "Banaras Hindu University, Varanasi",
    },
    {
      name: "Prof. (Dr.) Sunita Kashyap",
      role: "Professor",
      univ: "Jawaharlal Nehru University, Delhi",
    },
    {
      name: "Dr. Rakesh Sharma",
      role: "Associate Professor",
      univ: "Indian Institute of Management, Lucknow",
    },
  ];

  let page = 1;

  function getPerPage() {
    if (window.innerWidth < 992) {
      return 8;
    }
    return 9;
  }
  function render() {
    const PER_PAGE = getPerPage();
    const slice = members.slice((page - 1) * PER_PAGE, page * PER_PAGE);
    const total = Math.ceil(members.length / PER_PAGE);

    // Cards
    document.getElementById("board-grid").innerHTML = slice
      .map(
        (m) => `
    <div class="col-12 col-sm-6 col-lg-4 d-flex">
      <div class="member-card bg-white h-100 w-100">
        <div class="member-img bg-shad-12"></div>
        <div class="member-content">
          <p class="mb-1 fw-600 text-black fw-600 member-head font-poppins">${m.name}</p>
          <p class="mb-2 mb-md-4 fw-400 text-black fw-400 member-subhead font-poppins">${m.role}</p>
          <p class="mb-0 fw-600 color-3 font-poppins member-subhead">${m.univ}</p>
        </div>
      </div>
    </div>
  `,
      )
      .join("");

    // Pagination
    const btn = (p, label, disabled = false, active = false) =>
      `<li class="page-item${disabled ? " disabled" : ""}${active ? " active" : ""}">
      <a class="page-link" href="#" data-page="${p}">${label}</a>
    </li>`;

    let pHtml = btn(page - 1, "Prev", page === 1);
    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || Math.abs(i - page) <= 1) {
        pHtml += btn(i, i, false, i === page);
      } else if (Math.abs(i - page) === 2) {
        pHtml += `<li class="page-item disabled"><a class="page-link">...</a></li>`;
      }
    }
    pHtml += btn(page + 1, "Next", page === total);

    const ul = document.getElementById("pagination");
    ul.innerHTML = pHtml;
    ul.querySelectorAll("[data-page]").forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const p = +a.dataset.page;
        if (p >= 1 && p <= total && p !== page) {
          page = p;
          render();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
    });
  }
  render();
})();
// ============================================================
// GALLERY (FIXED)
// ============================================================
(function () {
  const grid = document.getElementById("gallery-grid");
  const showingText = document.getElementById("showing-text");

  if (!grid) return;

  const events = [
    {
      title: "Legal Aid Awareness Drive",
      date: "March 8, 2025",
      cat: "Legal & Outreach",
      img: "images/image 44.webp",
      year: "2026",
    },
    {
      title: "USAR – Winter Fest",
      date: "February 15, 2025",
      cat: "Cultural",
      img: "images/image 45.webp",
      year: "2026",
    },
    {
      title: "Republic Day Celebration",
      date: "January 26, 2025",
      cat: "National Event",
      img: "images/image 46.webp",
      year: "2026",
    },
    {
      title: "Land Celebration",
      date: "August 15, 2024",
      cat: "Cultural",
      img: "images/image 47.webp",
      year: "2026",
    },
    {
      title: "Diwali Celebration",
      date: "October 31, 2024",
      cat: "Cultural",
      img: "images/image 48.webp",
      year: "2026",
    },
    {
      title: "Parent Teacher Meeting",
      date: "October 26, 2024",
      cat: "Academic",
      img: "images/image 49.webp",
      year: "2026",
    },
    {
      title: "Blood Donation Camp",
      date: "September 27, 2024",
      cat: "Health & Welfare",
      img: "images/image 44.webp",
      year: "2026",
    },
    {
      title: "Health Mela",
      date: "September 18, 2024",
      cat: "Health & Wellness",
      img: "images/image 45.webp",
      year: "2026",
    },
    {
      title: "Angrezon 2025 / Fresher's Welcome",
      date: "September 2, 2024",
      cat: "Programme & Events",
      img: "images/image 46.webp",
      year: "2026",
    },
    {
      title: "Orientation 2025",
      date: "August 12, 2024",
      cat: "Legal & Outreach",
      img: "images/image 47.webp",
      year: "2026",
    },
    {
      title: "Career Expo 2025",
      date: "May 18, 2025",
      cat: "Career & Industry",
      img: "images/image 48.webp",
      year: "2026",
    },
    {
      title: "Mock Interview",
      date: "May 5, 2025",
      cat: "Programme & Events",
      img: "images/image 49.webp",
      year: "2026",
    },
    {
      title: "Tree Plantation Drive",
      date: "June 5, 2025",
      cat: "Environment",
      img: "images/image 44.webp",
      year: "2026",
    },
    {
      title: "Sports Meet 2025",
      date: "March 20, 2025",
      cat: "Sports",
      img: "images/image 45.webp",
      year: "2026",
    },
    {
      title: "NSS Special Camp",
      date: "November 10, 2024",
      cat: "NSS",
      img: "images/image 46.webp",
      year: "2026",
    },
    {
      title: "Cultural Fest",
      date: "December 5, 2024",
      cat: "Cultural",
      img: "images/image 47.webp",
      year: "2026",
    },
    {
      title: "Alumni Meet 2025",
      date: "January 15, 2025",
      cat: "Alumni",
      img: "images/image 48.webp",
      year: "2026",
    },
    {
      title: "Seminar on AI & Future",
      date: "February 10, 2025",
      cat: "Academic",
      img: "images/image 49.webp",
      year: "2026",
    },
  ];
  const PER_LOAD = 12;
  const TOTAL = events.length;
  let shown = 0;
  const colors = [
    { bg: "#DBEAFE", text: "#014C88" },
    { bg: "#F3E8FF", text: "#8200DB" },
    { bg: "#FEF3C6", text: "#BB4D00" },
    { bg: "#DCFCE7", text: "#008236" },
    { bg: "#CBFBF1", text: "#00786F" },
  ];
  const calIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" class="mr-2">
<g clip-path="url(#clip0_2983_4968)">
<path d="M9.5 2H2.5C1.94772 2 1.5 2.44772 1.5 3V10C1.5 10.5523 1.94772 11 2.5 11H9.5C10.0523 11 10.5 10.5523 10.5 10V3C10.5 2.44772 10.0523 2 9.5 2Z" stroke="#014C88"/>
<path d="M8 1V3" stroke="#014C88"/>
<path d="M4 1V3" stroke="#014C88"/>
<path d="M1.5 5H10.5" stroke="#014C88"/>
</g>
<defs>
<clipPath id="clip0_2983_4968">
  <rect width="12" height="12" fill="white"/>
</clipPath>
</defs>
</svg>`;

  function cardHTML(ev, idx) {
    const colorObj = colors[Math.floor(Math.random() * colors.length)];

    const bg = colorObj.bg;
    const text = colorObj.text;
    const imgTag = ev.img
      ? `<img src="${ev.img}" class="h-100 w-100 object-fit-cover border-radius-t-16" alt="${ev.title}">`
      : `<div class="img-placeholder" style="background:${colors};"></div>`;
    return `
<div class="col-12 col-md-4 col-lg-3 d-flex">
  <div class="card-item p-0 bg-white h-100 border-radius-16">
    <div class="event-card position-relative">
    ${imgTag}
    <div class=""><span class="position-absolute font-poppins badge-cat fw-600" style="background:${bg}; color:${text}">${ev.cat}</span> 
        <span class="position-absolute badge-year text-white">${ev.year}</span></div>
</div>
<div class="overlay p-3 d-flex flex-column gap-1 gap-md-2">
  <p class="event-title color-4 font-poppins fw-700 mb-0">${ev.title}</p>
  <p class="event-date color-6 font-robots fw-400 pt-2">${calIcon} ${ev.date}</p>
</div>
  </div>
</div>`;
  }
  function updateUI() {
    const remaining = TOTAL - shown;
    document.getElementById("showing-text").textContent =
      `Showing ${shown} of ${TOTAL} videos`;
    document.getElementById("remaining-count").textContent = remaining;

    const progressBar = document.getElementById("showing-progress");

    if (progressBar) {
      let percent = (shown / TOTAL) * 100;
      progressBar.style.width = percent + "%";
    }

    if (remaining <= 0) {
      document.getElementById("bottom-wrap").style.display = "none";
    }
  }
  window.loadMore = function () {
    const grid = document.getElementById("gallery-grid");
    const next = events.slice(shown, shown + PER_LOAD);
    next.forEach((ev, i) =>
      grid.insertAdjacentHTML("beforeend", cardHTML(ev, shown + i)),
    );
    shown += next.length;
    updateUI();
  };

  loadMore();
})();
