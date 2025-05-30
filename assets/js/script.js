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
    const filterYear    = document.getElementById('filterYear');
    const filterType    = document.getElementById('filterType');
    const filterKeyword = document.getElementById('filterKeyword');
    const publicationsList = document.getElementById('publicationsList');
    if (!publicationsList) return;

    const allEntries = Array.from(publicationsList.querySelectorAll('.publication-entry'));

    // 1) Extract unique years & types:
    const yearsSet = new Set();
    const typesSet = new Set();
    allEntries.forEach(e => {
      yearsSet.add(e.dataset.year);
      typesSet.add(e.dataset.type.toLowerCase());
    });

    // 2) Sort years descending (put “Other” last):
    const years = Array.from(yearsSet)
      .filter(y => y !== 'Other')
      .sort((a, b) => Number(b) - Number(a));
    if (yearsSet.has('Other')) years.push('Other');

    // 3) Sort types alphabetically, but keep “other” at end
    const types = Array.from(typesSet)
      .filter(t => t !== 'other')
      .sort();
    if (typesSet.has('other')) types.push('other');

    // 4) Populate the dropdowns
    function populateSelect(selectEl, items, defaultLabel) {
      selectEl.innerHTML = `<option selected>${defaultLabel}</option>`;
      items.forEach(v => {
        const opt = document.createElement('option');
        opt.value = v;
        // capitalize first letter
        opt.textContent = v.charAt(0).toUpperCase() + v.slice(1);
        selectEl.appendChild(opt);
      });
    }

    populateSelect(filterYear,  years, 'Year');
    populateSelect(filterType,  types, 'Type');

    // existing keyword logic
    const keywordMap = [
      { value: 'Classification', display: 'Classification' },
      { value: 'CNN',            display: 'CNN' },
      { value: 'Detection',      display: 'Detection' },
      { value: 'Deep-Learning',  display: 'Deep Learning' },
      { value: 'Transfer-Learning', display: 'Transfer Learning' },
      { value: 'Other',          display: 'Other' }
    ];
    function populateKeywordsDropdown() {
      filterKeyword.innerHTML = '<option selected>Keyword</option>';
      keywordMap.forEach(({value, display}) => {
        const o = document.createElement('option');
        o.value = value;
        o.textContent = display;
        filterKeyword.appendChild(o);
      });
    }

    function applyFilters() {
      const selYear    = filterYear.value    !== 'Year'    ? filterYear.value    : '';
      const selType    = filterType.value    !== 'Type'    ? filterType.value.toLowerCase() : '';
      const selKeyword = filterKeyword.value !== 'Keyword' ? filterKeyword.value : '';

      let visibleCount = 0;
      allEntries.forEach(entry => {
        const eYear = entry.dataset.year;
        const eType = entry.dataset.type.toLowerCase();
        const eKeys = entry.dataset.keywords.split(' ').map(k=>k.trim());
        let show = true;

        if (selYear    && eYear  !== selYear)      show = false;
        if (selType    && eType  !== selType)      show = false;
        if (selKeyword && !eKeys.includes(selKeyword)) show = false;

        entry.style.display = show ? 'block' : 'none';
        if (show) visibleCount++;
      });

      // no-results message...
      const msgId = 'noPublicationsMessage';
      let msg = document.getElementById(msgId);
      if (!visibleCount) {
        if (!msg) {
          msg = document.createElement('p');
          msg.id = msgId;
          msg.className = 'text-center mt-4 text-muted';
          msg.textContent = 'No publications found matching your filters. Please try other filters.';
          publicationsList.appendChild(msg);
        }
        msg.style.display = 'block';
      } else if (msg) {
        msg.style.display = 'none';
      }
    }

    // wire up
    populateKeywordsDropdown();
    [filterYear, filterType, filterKeyword].forEach(sel => sel.addEventListener('change', applyFilters));

    // initial apply
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

// Initializes gallery filtering with dynamic headings
function initializeGalleryFilters() {
  const buttons = document.querySelectorAll('.gallery-filter-btn');
  const sections = document.querySelectorAll('.filter-section');

  function clearHeadings() {
    document.querySelectorAll('.gallery-section-heading').forEach(h => h.remove());
  }

  function addHeadings() {
    clearHeadings();
    sections.forEach(section => {
      const category = section.dataset.category;
      const heading = document.createElement('h6');
      heading.classList.add('gallery-section-heading', 'mt-4', 'mb-3',  'text-center');
      heading.textContent = category === 'events' ? 'Events Images' : 'Researches Images';
      section.parentNode.insertBefore(heading, section);
    });
  }

  function filterSections(cat) {
    sections.forEach(sec => {
      if (cat === 'all' || sec.dataset.category === cat) {
        sec.style.display = 'flex';
      } else {
        sec.style.display = 'none';
      }
    });
    if (cat === 'all') addHeadings();
    else clearHeadings();
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.textContent.trim().toLowerCase();
      filterSections(cat);
    });
  });

  // show all on load with headings
  filterSections('all');
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
          const targetSection = document.getElementById(href.substring(1));
          if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
          }
        } else {
          await loadPage(href);
        }
      });
    });

    async function loadPage(url) {
      contentContainer.classList.add('fade-out');
      await new Promise(resolve => setTimeout(resolve, 300));

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Page load failed');
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newContent = doc.querySelector('#content-container') || doc.body;

        contentContainer.innerHTML = newContent.innerHTML;

        initializePage();
        contentContainer.classList.remove('fade-out');
        contentContainer.classList.add('fade-in');
        await new Promise(resolve => setTimeout(resolve, 300));
        contentContainer.classList.remove('fade-in');
      } catch (error) {
        console.error('Error loading page:', error);
        contentContainer.classList.remove('fade-out');
      }
    }

    function initializePage() {
      initializeFloatingNav();
      initializeFilters();
      initializeGalleryModals();
      initializeGalleryFilters();
      initializePageTransitions();
    }

    document.querySelectorAll('.navbar-nav .nav-link, #floating-nav .nav-link').forEach(link => {
      if (link.getAttribute('href') === window.location.pathname || link.getAttribute('href') === `#${window.location.hash.substring(1)}`) {
        link.classList.add('active');
      }
    });
  }
}

// Main init
document.addEventListener('DOMContentLoaded', () => {
  initializeFloatingNav();
  initializeFilters();
  initializeGalleryModals();
  initializeGalleryFilters();
  initializePageTransitions();
});
