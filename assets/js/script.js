// // Initializes floating nav highlighting on scroll
// function initializeFloatingNav() {
//   const navLinks = document.querySelectorAll('#floating-nav .nav-link');
//   const sections = ['faculty', 'alumni', 'graduate', 'undergraduate']
//     .map(id => document.getElementById(id))
//     .filter(Boolean);

//   if (!sections.length) return;
//   const initialLink = document.querySelector('#floating-nav .nav-link[href="#faculty"]');
//   if (initialLink) initialLink.classList.add('active');

//   navLinks.forEach(link => {
//     link.addEventListener('click', event => {
//       event.preventDefault();
//       navLinks.forEach(n => n.classList.remove('active'));
//       link.classList.add('active');
//       const targetId = link.getAttribute('href').slice(1);
//       const target = document.getElementById(targetId);
//       if (target) window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
//     });
//   });

//   function updateActive() {
//     const scrollTop = window.pageYOffset;
//     const windowH = window.innerHeight;
//     const docH = document.documentElement.scrollHeight;
//     const atBottom = scrollTop + windowH >= docH - 50;
//     let current = null, maxArea = 0;

//     sections.forEach((sec, i) => {
//       const rect = sec.getBoundingClientRect();
//       const top = rect.top + scrollTop;
//       const bottom = rect.bottom + scrollTop;
//       const visible = Math.max(0, Math.min(bottom, scrollTop + windowH) - Math.max(top, scrollTop));
//       if ((i === sections.length - 1 && atBottom) || (visible > maxArea && visible > 50)) {
//         maxArea = visible; current = sec;
//       }
//     });
//     if (!current) return;
//     navLinks.forEach(n => n.classList.remove('active'));
//     const act = document.querySelector(`#floating-nav .nav-link[href="#${current.id}"]`);
//     if (act) act.classList.add('active');
//   }

//   window.addEventListener('scroll', updateActive, { passive: true });
//   window.addEventListener('resize', updateActive);
//   setTimeout(updateActive, 100);
// }

// // Initializes publication filters
// function initializeFilters() {
//   try {
//     const publicationsList = document.getElementById('publicationsList');
//     if (!publicationsList) return;

//     const allEntries = Array.from(publicationsList.querySelectorAll('.publication-entry'));
//     const dropdowns = {};
//     let currentFilters = { year: '', type: '', keyword: '' };

//     // Setup custom dropdowns
//     document.querySelectorAll('.custom-dropdown').forEach(element => {
//       const ft = element.dataset.filter;
//       const toggle = element.querySelector('.custom-dropdown-toggle');
//       const menu = element.querySelector('.custom-dropdown-menu');
//       dropdowns[ft] = { toggle, menu };

//       toggle.addEventListener('click', e => {
//         e.stopPropagation();
//         Object.values(dropdowns).forEach(d => d.menu.classList.remove('show'));
//         menu.classList.toggle('show');
//       });

//       menu.addEventListener('click', e => {
//         const item = e.target;
//         if (!item.classList.contains('custom-dropdown-item')) return;
//         if (item.dataset.value === '') return; // placeholder
//         currentFilters[ft] = item.dataset.value;
//         toggle.textContent = item.textContent;
//         menu.classList.remove('show');
//         applyFilters();
//       });
//     });
//     document.addEventListener('click', () => Object.values(dropdowns).forEach(d => d.menu.classList.remove('show')));

//     // Collect & sort values
//     const years = [...new Set(allEntries.map(e => e.dataset.year))].sort((a,b)=>Number(b)-Number(a));
//     let types = [...new Set(allEntries.map(e => e.dataset.type.toLowerCase()))];
//     const hasOther = types.includes('other');
//     if (hasOther) types = types.filter(t=>t!=='other');
//     types.sort(); if (hasOther) types.push('other');
//     const keywords = ['Classification','CNN','Detection','Deep-Learning','Transfer-Learning','Other'];

//     // Populate dropdown menus
//     function populate(ft, items, def) {
//       const menu = dropdowns[ft].menu;
//       menu.innerHTML = `<div class="custom-dropdown-item" data-value="">${def}</div>`;
//       items.forEach(v=>{
//         const div = document.createElement('div');
//         div.className = 'custom-dropdown-item';
//         div.dataset.value = v;
//         div.textContent = v.charAt(0).toUpperCase()+v.slice(1);
//         menu.appendChild(div);
//       });
//     }
//     populate('year', years, 'Year');
//     populate('type', types, 'Type');
//     populate('keyword', keywords, 'Keyword');

//     // Filter application with no-results message
//     function applyFilters() {
//       let found = 0;
//       allEntries.forEach(entry => {
//         const y = entry.dataset.year;
//         const t = entry.dataset.type.toLowerCase();
//         const ks = entry.dataset.keywords.split(' ');
//         let show = true;
//         if (currentFilters.year    && y!==currentFilters.year) show=false;
//         if (currentFilters.type    && t!==currentFilters.type) show=false;
//         if (currentFilters.keyword && !ks.includes(currentFilters.keyword)) show=false;
//         entry.style.display = show?'block':'none';
//         if (show) found++;
//       });
//       const msgId = 'noPublicationsMessage';
//       let msg = document.getElementById(msgId);
//       if (found===0) {
//         if (!msg) {
//           msg = document.createElement('p');
//           msg.id = msgId;
//           msg.textContent = 'No publications found matching your filters. Please try other filters.';
//           msg.className = 'text-center mt-4 text-muted';
//           publicationsList.appendChild(msg);
//         }
//         msg.style.display='block';
//       } else if (msg) {
//         msg.style.display='none';
//       }
//     }

//     // Reset button
//     const resetBtn = document.getElementById('resetFilters');
//     if (resetBtn) {
//       resetBtn.addEventListener('click', ()=>{
//         currentFilters = { year:'', type:'', keyword:'' };
//         Object.keys(dropdowns).forEach(ft=>{
//           const def = ft.charAt(0).toUpperCase()+ft.slice(1);
//           dropdowns[ft].toggle.textContent = def;
//         });
//         applyFilters();
//       });
//     }

//     // Initial filter
//     applyFilters();

//   } catch (e) { console.error('Filter init error:', e); }
// }

// // Initializes modal images
// function initializeGalleryModals() {
//   const handler = (sel, id)=>document.querySelectorAll(sel).forEach(img=>{
//     img.setAttribute('data-bs-toggle','modal');
//     img.setAttribute('data-bs-target',`#${id}`);
//     img.addEventListener('click',()=>{
//       const modalImg=document.getElementById(id==='galleryModal'?'modalImage':'modalResearchImage');
//       if(modalImg) modalImg.src = img.src;
//     });
//   });
//   handler('.gallery-img','galleryModal'); handler('.research-image','researchModal');
// }

// // Initializes gallery filters
// function initializeGalleryFilters() {
//   const btns=document.querySelectorAll('.gallery-filter-btn');
//   const secs=document.querySelectorAll('.filter-section');
//   function clr(){document.querySelectorAll('.gallery-section-heading').forEach(h=>h.remove());}
//   function add(){secs.forEach(s=>{const c=s.dataset.category;
//     const h=document.createElement('h6');
//     h.className='gallery-section-heading mt-4 mb-3 text-center';
//     h.textContent=c==='events'?'Events Images':'Researches Images';
//     s.parentNode.insertBefore(h,s);
//   });}
//   function filt(c){secs.forEach(s=>s.style.display=(c==='all'||s.dataset.category===c)?'flex':'none');
//     c==='all'?add():clr();}
//   btns.forEach(b=>b.addEventListener('click',()=>{
//     btns.forEach(x=>x.classList.remove('active')); b.classList.add('active');
//     filt(b.textContent.trim().toLowerCase());
//   })); filt('all');
// }

// // Motion Animation Integration
// function initializePageTransitions() {
//   const links=document.querySelectorAll('.navbar-nav .nav-link, #floating-nav .nav-link');
//   const cont=document.getElementById('content-container')||document.body;
//   links.forEach(link=>link.addEventListener('click',async e=>{
//     e.preventDefault(); links.forEach(n=>n.classList.remove('active')); link.classList.add('active');
//     const href=link.getAttribute('href');
//     if(href.startsWith('#')){
//       const tgt=document.getElementById(href.slice(1));
//       if(tgt) window.scrollTo({top:tgt.offsetTop-80,behavior:'smooth'});
//     } else { cont.classList.add('fade-out'); await new Promise(r=>setTimeout(r,300));
//       try { const res=await fetch(href); if(!res.ok) throw''; const html=await res.text();
//         const doc=new DOMParser().parseFromString(html,'text/html');
//         const newC=doc.querySelector('#content-container')||doc.body;
//         cont.innerHTML=newC.innerHTML;
//         initializeFloatingNav(); initializeFilters(); initializeGalleryModals(); initializeGalleryFilters(); cont.classList.remove('fade-out'); cont.classList.add('fade-in'); await new Promise(r=>setTimeout(r,300)); cont.classList.remove('fade-in');
//       } catch (err){console.error(err); cont.classList.remove('fade-out');}
//     }
//   }));
// }

// // Main init
// document.addEventListener('DOMContentLoaded',()=>{
//   initializeFloatingNav();
//   initializeFilters();
//   initializeGalleryModals();
//   initializeGalleryFilters();
//   initializePageTransitions();
// });




















// Initializes floating navigation (keeps track of scroll and highlights active section)
function initializeFloatingNav() {
  try {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('#floating-nav .nav-link');

    function updateActive() {
      let current = null;
      sections.forEach(sec => {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom > 100) {
          current = sec;
        }
      });
      if (!current) return;
      navLinks.forEach(n => n.classList.remove('active'));
      const act = document.querySelector(`#floating-nav .nav-link[href="#${current.id}"]`);
      if (act) act.classList.add('active');
    }

    window.addEventListener('scroll', updateActive, { passive: true });
    window.addEventListener('resize', updateActive);
    setTimeout(updateActive, 100);
  } catch (e) {
    console.error('Floating nav init error:', e);
  }
}

// Initializes publication filters
function initializeFilters() {
  try {
    const publicationsList = document.getElementById('publicationsList');
    if (!publicationsList) return;

    const allEntries = Array.from(publicationsList.querySelectorAll('.publication-entry'));
    const dropdowns = {};
    let currentFilters = { year: '', type: '', keyword: '' };

    // Setup custom dropdowns
    document.querySelectorAll('.custom-dropdown').forEach(element => {
      const ft = element.dataset.filter;
      const toggle = element.querySelector('.custom-dropdown-toggle');
      const menu = element.querySelector('.custom-dropdown-menu');
      dropdowns[ft] = { toggle, menu };

      toggle.addEventListener('click', e => {
        e.stopPropagation();
        Object.values(dropdowns).forEach(d => d.menu.classList.remove('show'));
        menu.classList.toggle('show');
      });

      menu.addEventListener('click', e => {
        const item = e.target;
        if (!item.classList.contains('custom-dropdown-item')) return;
        if (item.dataset.value === '') return; // placeholder
        currentFilters[ft] = item.dataset.value;
        toggle.textContent = item.textContent;
        menu.classList.remove('show');
        applyFilters();
      });
    });
    document.addEventListener('click', () => Object.values(dropdowns).forEach(d => d.menu.classList.remove('show')));

    // Collect & sort values
    const years = [...new Set(allEntries.map(e => e.dataset.year))].sort((a, b) => Number(b) - Number(a));
    let types = [...new Set(allEntries.map(e => e.dataset.type.toLowerCase()))];
    const hasOther = types.includes('other');
    if (hasOther) types = types.filter(t => t !== 'other');
    types.sort();
    if (hasOther) types.push('other');
    const keywords = ['Classification', 'CNN', 'Detection', 'Deep-Learning', 'Transfer-Learning', 'Other'];

    // Populate dropdown menus
    function populate(ft, items, def) {
      const menu = dropdowns[ft].menu;
      menu.innerHTML = `<div class="custom-dropdown-item" data-value="">${def}</div>`;
      items.forEach(v => {
        const div = document.createElement('div');
        div.className = 'custom-dropdown-item';
        div.dataset.value = v;
        div.textContent = v.charAt(0).toUpperCase() + v.slice(1);
        menu.appendChild(div);
      });
    }
    populate('year', years, 'Year');
    populate('type', types, 'Type');
    populate('keyword', keywords, 'Keyword');

    // Filter application with no-results message
    function applyFilters() {
      let found = 0;
      allEntries.forEach(entry => {
        const y = entry.dataset.year;
        const t = entry.dataset.type.toLowerCase();
        const ks = entry.dataset.keywords.split(' ');
        let show = true;
        if (currentFilters.year && y !== currentFilters.year) show = false;
        if (currentFilters.type && t !== currentFilters.type) show = false;
        if (currentFilters.keyword && !ks.includes(currentFilters.keyword)) show = false;
        entry.style.display = show ? 'block' : 'none';
        if (show) found++;
      });
      const msgId = 'noPublicationsMessage';
      let msg = document.getElementById(msgId);
      if (found === 0) {
        if (!msg) {
          msg = document.createElement('p');
          msg.id = msgId;
          msg.textContent = 'No publications found matching your filters. Please try other filters.';
          msg.className = 'text-center mt-4 text-muted';
          publicationsList.appendChild(msg);
        }
        msg.style.display = 'block';
      } else if (msg) {
        msg.style.display = 'none';
      }
    }

    // Reset button
    const resetBtn = document.getElementById('resetFilters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        currentFilters = { year: '', type: '', keyword: '' };
        Object.keys(dropdowns).forEach(ft => {
          const def = ft.charAt(0).toUpperCase() + ft.slice(1);
          dropdowns[ft].toggle.textContent = def;
        });
        applyFilters();
      });
    }

    // Initial filter
    applyFilters();
  } catch (e) {
    console.error('Filter init error:', e);
  }
}

// Initializes modal images
function initializeGalleryModals() {
  const handler = (sel, id) => document.querySelectorAll(sel).forEach(img => {
    img.setAttribute('data-bs-toggle', 'modal');
    img.setAttribute('data-bs-target', `#${id}`);
    img.addEventListener('click', () => {
      const modalImg = document.getElementById(id === 'galleryModal' ? 'modalImage' : 'modalResearchImage');
      if (modalImg) modalImg.src = img.src;
    });
  });
  handler('.gallery-img', 'galleryModal');
  handler('.research-image', 'researchModal');
}

// Initializes gallery filters
function initializeGalleryFilters() {
  const btns = document.querySelectorAll('.gallery-filter-btn');
  const secs = document.querySelectorAll('.filter-section');
  function clr() { document.querySelectorAll('.gallery-section-heading').forEach(h => h.remove()); }
  function add() {
    secs.forEach(s => {
      const c = s.dataset.category;
      const h = document.createElement('h6');
      h.className = 'gallery-section-heading mt-4 mb-3 text-center';
      h.textContent = c === 'events' ? 'Events Images' : 'Researches Images';
      s.parentNode.insertBefore(h, s);
    });
  }
  function filt(c) {
    secs.forEach(s => s.style.display = (c === 'all' || s.dataset.category === c) ? 'flex' : 'none');
    c === 'all' ? add() : clr();
  }
  btns.forEach(b => b.addEventListener('click', () => {
    btns.forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    filt(b.textContent.trim().toLowerCase());
  }));
  filt('all');
}

// Motion Animation Integration
function initializePageTransitions() {
  const links = document.querySelectorAll('.navbar-nav .nav-link, #floating-nav .nav-link');
  const cont = document.getElementById('content-container') || document.body;
  links.forEach(link => link.addEventListener('click', async e => {
    e.preventDefault();
    links.forEach(n => n.classList.remove('active'));
    link.classList.add('active');
    const href = link.getAttribute('href');
    if (href.startsWith('#')) {
      const tgt = document.getElementById(href.slice(1));
      if (tgt) window.scrollTo({ top: tgt.offsetTop - 80, behavior: 'smooth' });
    } else {
      cont.classList.add('fade-out');
      await new Promise(r => setTimeout(r, 300));
      try {
        const res = await fetch(href);
        if (!res.ok) throw '';
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const newC = doc.querySelector('#content-container') || doc.body;
        cont.innerHTML = newC.innerHTML;
        initializeFloatingNav();
        initializeFilters();
        initializeGalleryModals();
        initializeGalleryFilters();
        cont.classList.remove('fade-out');
        cont.classList.add('fade-in');
        await new Promise(r => setTimeout(r, 300));
        cont.classList.remove('fade-in');
      } catch (err) {
        console.error(err);
        cont.classList.remove('fade-out');
      }
    }
  }));
}

// Main init
document.addEventListener('DOMContentLoaded', () => {
  initializeFloatingNav();
  initializeFilters();
  initializeGalleryModals();
  initializeGalleryFilters();
  initializePageTransitions();
});

// Close navbar when clicking outside
document.addEventListener('click', function(event) {
  var navbar = document.getElementById('navbarResponsive');
  var toggler = document.querySelector('.navbar-toggler');
  if (
    navbar.classList.contains('show') &&
    !navbar.contains(event.target) &&
    !toggler.contains(event.target)
  ) {
    var bsCollapse = bootstrap.Collapse.getInstance(navbar);
    if (bsCollapse) {
      bsCollapse.hide();
    }
  }
});
