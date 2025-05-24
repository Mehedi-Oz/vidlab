document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS (if used)
  if (typeof AOS !== 'undefined') {
    AOS.init();
  }

  const navLinks = document.querySelectorAll('#floating-nav .nav-link');
  const sections = ['faculty', 'alumni', 'graduate', 'undergraduate']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  // Ensure "Faculty" is active initially
  const initialActiveLink = document.querySelector('#floating-nav .nav-link[href="#faculty"]');
  if (initialActiveLink) {
    initialActiveLink.classList.add('active');
  }

  // Handle click-based navigation
  navLinks.forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault();

      // Remove active class from all links
      navLinks.forEach(nav => nav.classList.remove('active'));

      // Add active class to clicked link
      this.classList.add('active');

      const targetId = this.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        // Scroll to section with offset to account for fixed navbar
        const offsetTop = targetSection.offsetTop - 80; // Adjust for navbar height
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // Function to get the currently visible section
  function getCurrentSection() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Check if we're at the bottom of the page
    const isAtBottom = (scrollTop + windowHeight) >= (documentHeight - 50);

    let currentSection = null;
    let maxVisibleArea = 0;

    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + scrollTop;
      const sectionBottom = rect.bottom + scrollTop;
      const sectionHeight = rect.height;

      // Calculate visible area of this section
      const viewportTop = scrollTop;
      const viewportBottom = scrollTop + windowHeight;

      const visibleTop = Math.max(sectionTop, viewportTop);
      const visibleBottom = Math.min(sectionBottom, viewportBottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);

      // For the last section (undergraduate), be more lenient
      if (index === sections.length - 1 && isAtBottom) {
        currentSection = section;
      }
      // For other sections, use the one with most visible area
      else if (visibleHeight > maxVisibleArea && visibleHeight > 50) { // Reduced from 100px to 50px for faster detection
        maxVisibleArea = visibleHeight;
        currentSection = section;
      }
    });

    return currentSection;
  }

  // Function to update active nav link
  function updateActiveNav() {
    const currentSection = getCurrentSection();

    if (currentSection) {
      // Remove active class from all links
      navLinks.forEach(nav => nav.classList.remove('active'));

      // Add active class to current section's link
      const activeLink = document.querySelector(`#floating-nav .nav-link[href="#${currentSection.id}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
      }
    }
  }

  // Optimized scroll handler with immediate execution + throttling
  let scrollTimeout;
  let isScrolling = false;

  function handleScroll() {
    // Execute immediately for responsive feel
    if (!isScrolling) {
      updateActiveNav();
      isScrolling = true;
    }

    // Then throttle subsequent calls
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      updateActiveNav();
      isScrolling = false;
    }, 50); // Reduced from 100ms to 50ms
  }

  // Add scroll event listener
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Also listen for resize events to recalculate positions
  window.addEventListener('resize', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateActiveNav, 50);
  });

  // Initial check after page loads - much faster
  setTimeout(() => {
    updateActiveNav();
  }, 100); // Reduced from 500ms to 100ms


  const galleryImages = document.querySelectorAll('.gallery-img');

  galleryImages.forEach((img) => {
    img.setAttribute('data-bs-toggle', 'modal');
    img.setAttribute('data-bs-target', '#galleryModal');
    img.addEventListener('click', () => {
      const modalImage = document.getElementById('modalImage');
      modalImage.src = img.src;
    });
  });
});

