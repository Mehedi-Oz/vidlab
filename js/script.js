// // Initializes floating nav highlighting on scroll
// function initializeFloatingNav() {
//   const navLinks = document.querySelectorAll('#floating-nav .nav-link');
//   const sections = ['faculty', 'alumni', 'graduate', 'undergraduate']
//     .map(id => document.getElementById(id))
//     .filter(Boolean);

//   if (sections.length === 0) return;

//   const initialActiveLink = document.querySelector('#floating-nav .nav-link[href="#faculty"]');
//   if (initialActiveLink) {
//     initialActiveLink.classList.add('active');
//   }

//   navLinks.forEach(link => {
//     link.addEventListener('click', function (event) {
//       event.preventDefault();
//       navLinks.forEach(nav => nav.classList.remove('active'));
//       this.classList.add('active');
//       const targetId = this.getAttribute('href').substring(1);
//       const targetSection = document.getElementById(targetId);
//       if (targetSection) {
//         const offsetTop = targetSection.offsetTop - 80;
//         window.scrollTo({ top: offsetTop, behavior: 'smooth' });
//       }
//     });
//   });

//   function getCurrentSection() {
//     const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
//     const windowHeight = window.innerHeight;
//     const documentHeight = document.documentElement.scrollHeight;
//     const isAtBottom = (scrollTop + windowHeight) >= (documentHeight - 50);

//     let currentSection = null;
//     let maxVisibleArea = 0;

//     sections.forEach((section, index) => {
//       const rect = section.getBoundingClientRect();
//       const sectionTop = rect.top + scrollTop;
//       const sectionBottom = rect.bottom + scrollTop;
//       const visibleTop = Math.max(sectionTop, scrollTop);
//       const visibleBottom = Math.min(sectionBottom, scrollTop + windowHeight);
//       const visibleHeight = Math.max(0, visibleBottom - visibleTop);

//       if (index === sections.length - 1 && isAtBottom) {
//         currentSection = section;
//       } else if (visibleHeight > maxVisibleArea && visibleHeight > 50) {
//         maxVisibleArea = visibleHeight;
//         currentSection = section;
//       }
//     });

//     return currentSection;
//   }

//   function updateActiveNav() {
//     const currentSection = getCurrentSection();
//     if (currentSection) {
//       navLinks.forEach(nav => nav.classList.remove('active'));
//       const activeLink = document.querySelector(`#floating-nav .nav-link[href="#${currentSection.id}"]`);
//       if (activeLink) activeLink.classList.add('active');
//     }
//   }

//   window.addEventListener('scroll', () => {
//     updateActiveNav();
//   }, { passive: true });

//   window.addEventListener('resize', () => {
//     updateActiveNav();
//   });

//   setTimeout(updateActiveNav, 100);
// }

// // Initializes publication filters
// function initializeFilters() {
//   try {
//     const filterYear = document.getElementById('filterYear');
//     const filterType = document.getElementById('filterType');
//     const filterKeyword = document.getElementById('filterKeyword');
//     const publicationsList = document.getElementById('publicationsList');

//     if (!publicationsList) return;

//     const allPublicationEntries = Array.from(document.querySelectorAll('#publicationsList .publication-entry'));

//     const keywordMap = [
//       { value: 'Classification', display: 'Classification' },
//       { value: 'CNN', display: 'CNN' },
//       { value: 'Detection', display: 'Detection' },
//       { value: 'Deep-Learning', display: 'Deep Learning' },
//       { value: 'Transfer-Learning', display: 'Transfer Learning' },
//       { value: 'Other', display: 'Other' }
//     ];

//     function populateKeywordsDropdown() {
//       if (!filterKeyword) return;
//       filterKeyword.innerHTML = '<option selected>Keyword</option>';
//       keywordMap.forEach(({ value, display }) => {
//         const option = document.createElement('option');
//         option.value = value;
//         option.textContent = display;
//         filterKeyword.appendChild(option);
//       });
//     }

//     function applyFilters() {
//       const selectedYear = filterYear?.value && filterYear.value !== 'Year' ? filterYear.value : '';
//       const selectedType = filterType?.value && filterType.value !== 'Type' ? filterType.value.toLowerCase() : '';
//       const selectedKeyword = filterKeyword?.value && filterKeyword.value !== 'Keyword' ? filterKeyword.value : '';

//       allPublicationEntries.forEach(entry => {
//         const entryYear = entry.getAttribute('data-year') || '';
//         const entryType = (entry.getAttribute('data-type') || '').toLowerCase();
//         const entryKeywordsStr = entry.getAttribute('data-keywords') || '';
//         const entryKeywords = entryKeywordsStr.split(' ').map(kw => kw.trim()).filter(kw => kw);

//         let show = true;

//         // Year filter
//         if (selectedYear && entryYear !== selectedYear) {
//           show = false;
//         }

//         // Type filter
//         if (selectedType && show) {
//           if (selectedType === 'other') {
//             if (['journal', 'conference', 'thesis'].includes(entryType)) {
//               show = false;
//             }
//           } else {
//             if (entryType !== selectedType) {
//               show = false;
//             }
//           }
//         }

//         // Keyword filter
//         if (selectedKeyword && show) {
//           if (selectedKeyword === 'Other') {
//             // For "Other", show if it doesn't contain any of the specific keywords
//             const specificKeywords = ['Classification', 'CNN', 'Detection', 'Deep-Learning', 'Transfer-Learning'];
//             if (entryKeywords.some(kw => specificKeywords.includes(kw))) {
//               show = false;
//             }
//           } else {
//             // For specific keywords, check if entry contains the keyword
//             if (!entryKeywords.includes(selectedKeyword)) {
//               show = false;
//             }
//           }
//         }

//         entry.style.display = show ? 'block' : 'none';
//       });
//     }

//     // Initialize dropdown
//     populateKeywordsDropdown();

//     // Add event listeners
//     filterYear?.addEventListener('change', applyFilters);
//     filterType?.addEventListener('change', applyFilters);
//     filterKeyword?.addEventListener('change', applyFilters);

//     // Initial application
//     applyFilters();

//   } catch (err) {
//     console.error('Filter initialization error:', err);
//   }
// }

// // Initializes modal images
// function initializeGalleryModals() {
//   const modalImgHandler = (selector, modalId) => {
//     document.querySelectorAll(selector).forEach(img => {
//       img.setAttribute('data-bs-toggle', 'modal');
//       img.setAttribute('data-bs-target', `#${modalId}`);
//       img.addEventListener('click', () => {
//         const modalImage = document.getElementById(`modal${modalId === 'galleryModal' ? 'Image' : 'ResearchImage'}`);
//         if (modalImage) modalImage.src = img.src;
//       });
//     });
//   };
//   modalImgHandler('.gallery-img', 'galleryModal');
//   modalImgHandler('.research-image', 'researchModal');
// }

// // Initialize all on DOM ready
// document.addEventListener('DOMContentLoaded', () => {
//   initializeFloatingNav();
//   initializeFilters();
//   initializeGalleryModals();
// });


// Initializes floating nav highlighting on scroll
function initializeFloatingNav() {
  const navLinks = document.querySelectorAll('#floating-nav .nav-link');
  const sections = ['faculty', 'alumni', 'graduate', 'undergraduate']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  if (sections.length === 0) return;

  const initialActiveLink = document.querySelector('#floating-nav .nav-link[href="#faculty"]');
  if (initialActiveLink) {
    initialActiveLink.classList.add('active');
  }

  navLinks.forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      navLinks.forEach(nav => nav.classList.remove('active'));
      this.classList.add('active');
      const targetId = this.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });

  function getCurrentSection() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const isAtBottom = (scrollTop + windowHeight) >= (documentHeight - 50);

    let currentSection = null;
    let maxVisibleArea = 0;

    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + scrollTop;
      const sectionBottom = rect.bottom + scrollTop;
      const visibleTop = Math.max(sectionTop, scrollTop);
      const visibleBottom = Math.min(sectionBottom, scrollTop + windowHeight);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);

      if (index === sections.length - 1 && isAtBottom) {
        currentSection = section;
      } else if (visibleHeight > maxVisibleArea && visibleHeight > 50) {
        maxVisibleArea = visibleHeight;
        currentSection = section;
      }
    });

    return currentSection;
  }

  function updateActiveNav() {
    const currentSection = getCurrentSection();
    if (currentSection) {
      navLinks.forEach(nav => nav.classList.remove('active'));
      const activeLink = document.querySelector(`#floating-nav .nav-link[href="#${currentSection.id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  }

  window.addEventListener('scroll', () => {
    updateActiveNav();
  }, { passive: true });

  window.addEventListener('resize', () => {
    updateActiveNav();
  });

  setTimeout(updateActiveNav, 100);
}

// Initializes publication filters
function initializeFilters() {
  try {
    const filterYear = document.getElementById('filterYear');
    const filterType = document.getElementById('filterType');
    const filterKeyword = document.getElementById('filterKeyword');
    const publicationsList = document.getElementById('publicationsList');

    if (!publicationsList) return;

    const allPublicationEntries = Array.from(document.querySelectorAll('#publicationsList .publication-entry'));

    const keywordMap = [
      { value: 'Classification', display: 'Classification' },
      { value: 'CNN', display: 'CNN' },
      { value: 'Detection', display: 'Detection' },
      { value: 'Deep-Learning', display: 'Deep Learning' },
      { value: 'Transfer-Learning', display: 'Transfer Learning' },
      { value: 'Other', display: 'Other' }
    ];

    function populateKeywordsDropdown() {
      if (!filterKeyword) return;
      filterKeyword.innerHTML = '<option selected>Keyword</option>';
      keywordMap.forEach(({ value, display }) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = display;
        filterKeyword.appendChild(option);
      });
    }

    function applyFilters() {
      const selectedYear = filterYear?.value && filterYear.value !== 'Year' ? filterYear.value : '';
      const selectedType = filterType?.value && filterType.value !== 'Type' ? filterType.value.toLowerCase() : '';
      const selectedKeyword = filterKeyword?.value && filterKeyword.value !== 'Keyword' ? filterKeyword.value : '';

      allPublicationEntries.forEach(entry => {
        const entryYear = entry.getAttribute('data-year') || '';
        const entryType = (entry.getAttribute('data-type') || '').toLowerCase();
        const entryKeywordsStr = entry.getAttribute('data-keywords') || '';
        const entryKeywords = entryKeywordsStr.split(' ').map(kw => kw.trim()).filter(kw => kw);

        let show = true;

        // Year filter
        if (selectedYear && entryYear !== selectedYear) {
          show = false;
        }

        // Type filter
        if (selectedType && show) {
          if (selectedType === 'other') {
            if (['journal', 'conference', 'thesis'].includes(entryType)) {
              show = false;
            }
          } else {
            if (entryType !== selectedType) {
              show = false;
            }
          }
        }

        // Keyword filter
        if (selectedKeyword && show) {
          if (selectedKeyword === 'Other') {
            // For "Other", show if it doesn't contain any of the specific keywords
            const specificKeywords = ['Classification', 'CNN', 'Detection', 'Deep-Learning', 'Transfer-Learning'];
            if (entryKeywords.some(kw => specificKeywords.includes(kw))) {
              show = false;
            }
          } else {
            // For specific keywords, check if entry contains the keyword
            if (!entryKeywords.includes(selectedKeyword)) {
              show = false;
            }
          }
        }

        entry.style.display = show ? 'block' : 'none';
      });
    }

    // Initialize dropdown
    populateKeywordsDropdown();

    // Add event listeners
    filterYear?.addEventListener('change', applyFilters);
    filterType?.addEventListener('change', applyFilters);
    filterKeyword?.addEventListener('change', applyFilters);

    // Initial application
    applyFilters();

  } catch (err) {
    console.error('Filter initialization error:', err);
  }
}

// Initializes modal images
function initializeGalleryModals() {
  const modalImgHandler = (selector, modalId) => {
    document.querySelectorAll(selector).forEach(img => {
      img.setAttribute('data-bs-toggle', 'modal');
      img.setAttribute('data-bs-target', `#${modalId}`);
      img.addEventListener('click', () => {
        const modalImage = document.getElementById(`modal${modalId === 'galleryModal' ? 'Image' : 'ResearchImage'}`);
        if (modalImage) modalImage.src = img.src;
      });
    });
  };
  modalImgHandler('.gallery-img', 'galleryModal');
  modalImgHandler('.research-image', 'researchModal');
}

// Motion Animation Integration
function initializePageTransitions() {
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link, #floating-nav .nav-link');
  const contentContainer = document.getElementById('content-container') || document.body;

  if (contentContainer) {
    navLinks.forEach(link => {
      link.addEventListener('click', async function (event) {
        event.preventDefault();
        navLinks.forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');

        const href = this.getAttribute('href');
        if (href.startsWith('#')) {
          // Handle in-page navigation
          const targetSection = document.getElementById(href.substring(1));
          if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
          }
        } else {
          // Handle page navigation with animation
          await loadPage(href);
        }
      });
    });

    async function loadPage(url) {
      contentContainer.classList.add('fade-out');
      await new Promise(resolve => setTimeout(resolve, 300)); // Match animation duration

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Page load failed');
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newContent = doc.querySelector('#content-container') || doc.body;

        // Replace content
        contentContainer.innerHTML = newContent.innerHTML;

        // Reinitialize scripts and event listeners
        initializePage();
        contentContainer.classList.remove('fade-out');
        contentContainer.classList.add('fade-in');
        await new Promise(resolve => setTimeout(resolve, 300)); // Match animation duration
        contentContainer.classList.remove('fade-in');
      } catch (error) {
        console.error('Error loading page:', error);
        contentContainer.classList.remove('fade-out');
      }
    }

    function initializePage() {
      // Reinitialize all functionality
      initializeFloatingNav();
      initializeFilters();
      initializeGalleryModals();
      initializePageTransitions();
    }

    // Set initial active link
    document.querySelectorAll('.navbar-nav .nav-link, #floating-nav .nav-link').forEach(link => {
      if (link.getAttribute('href') === window.location.pathname || link.getAttribute('href') === `#${window.location.hash.substring(1)}`) {
        link.classList.add('active');
      }
    });
  }
}

// Initialize all on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initializeFloatingNav();
  initializeFilters();
  initializeGalleryModals();
  initializePageTransitions();
});