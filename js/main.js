/**
 * VETRERIA LA GIUSSANESE - INTERACTIVE APPLICATION LOGIC
 * High-performance Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initDualSelector();
  initProductFilter();
  initQuoteForm();
  initLightbox();
  initMobileMenu();
  initSmoothScroll();
});

/* --------------------------------------------------------------------------
   1. HEADER SCROLL & ACTIVE STATE
   -------------------------------------------------------------------------- */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    updateActiveNavLink();
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollPosition = window.scrollY + 120;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollPosition >= top && scrollPosition < top + height) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

/* --------------------------------------------------------------------------
   2. DUAL HUB SELECTOR NAVIGATION ("SERIE" & "SU MISURA")
   -------------------------------------------------------------------------- */
function initDualSelector() {
  const btnSerie = document.querySelectorAll('[data-target-split="serie"]');
  const btnSuMisura = document.querySelectorAll('[data-target-split="su-misura"]');

  btnSerie.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('serie');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  btnSuMisura.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('su-misura');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   3. SU MISURA CATEGORY FILTER
   -------------------------------------------------------------------------- */
function initProductFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productItems = document.querySelectorAll('.product-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      productItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          item.style.display = 'flex';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 20);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(15px)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   4. INTERACTIVE MULTI-SCENARIO QUOTE FORM
   -------------------------------------------------------------------------- */
function initQuoteForm() {
  const tabBtns = document.querySelectorAll('.scenario-tab-btn');
  const scenarioPanels = document.querySelectorAll('.scenario-panel');
  const summaryScenarioName = document.getElementById('summary-scenario-name');
  const summaryDetailsList = document.getElementById('summary-details-list');
  const formElement = document.getElementById('quote-form');

  if (!tabBtns.length || !formElement) return;

  // Tab switching logic
  tabBtns.forEach(tab => {
    tab.addEventListener('click', () => {
      const scenario = tab.getAttribute('data-scenario');
      switchScenario(scenario);
    });
  });

  function switchScenario(scenarioId) {
    tabBtns.forEach(t => {
      t.classList.toggle('active', t.getAttribute('data-scenario') === scenarioId);
    });

    scenarioPanels.forEach(panel => {
      const isActive = panel.id === `scenario-${scenarioId}`;
      panel.style.display = isActive ? 'block' : 'none';
    });

    const activeTab = document.querySelector(`.scenario-tab-btn[data-scenario="${scenarioId}"]`);
  }

  // Pre-fill / jump to scenario from CTA buttons throughout the page
  document.querySelectorAll('[data-open-scenario]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetScenario = btn.getAttribute('data-open-scenario');
      switchScenario(targetScenario);

      const formSection = document.getElementById('preventivo');
      if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  function getScenarioSummaryItems() {
    const activeTab = document.querySelector('.scenario-tab-btn.active');
    const scenario = activeTab ? activeTab.getAttribute('data-scenario') : 'docce';
    const activePanel = document.getElementById(`scenario-${scenario}`);
    if (!activePanel) return [];

    let items = [];

    if (scenario === 'parapetti') {
      const tipo = activePanel.querySelector('select[name="parapetti_tipo"]')?.value || 'Parapetto Esterno';
      const finitura = activePanel.querySelector('select[name="parapetti_finitura"]')?.value || 'Extrachiaro';
      const spessore = activePanel.querySelector('select[name="parapetti_spessore"]')?.value || '8+8 mm';
      const plastico = activePanel.querySelector('select[name="parapetti_plastico"]')?.value || 'SentryGlas';
      const termica = activePanel.querySelector('select[name="parapetti_termica"]')?.value || 'Tempera + Indurito';
      const taglio = activePanel.querySelector('select[name="parapetti_taglio"]')?.value || 'Squadrato';
      const metri = activePanel.querySelector('input[name="parapetti_metri"]')?.value || '5.0 m';
      const hQuota = activePanel.querySelector('input[name="parapetti_altezza"]')?.value || '1000 mm';
      const posa = activePanel.querySelector('select[name="parapetti_ferramenta"]')?.value || 'Profilo a terra';

      items = [
        { key: 'Applicazione', val: tipo },
        { key: 'Finitura Vetro', val: finitura },
        { key: 'Spessore', val: spessore },
        { key: 'Intercalare Plastico', val: plastico },
        { key: 'Tratt. Termico', val: termica },
        { key: 'Lavorazione Taglio', val: taglio },
        { key: 'Dimensioni stimate', val: `${metri} lin. x H ${hQuota}` },
        { key: 'Ferramenta / Posa', val: posa }
      ];
    } else if (scenario === 'docce') {
      const apertura = activePanel.querySelector('select[name="doccia_apertura"]')?.value || 'Battente in nicchia';
      const finitura = activePanel.querySelector('select[name="doccia_finitura"]')?.value || 'Trasparente extrachiaro';
      const spessore = activePanel.querySelector('select[name="doccia_spessore"]')?.value || '8 mm';
      const cerniere = activePanel.querySelector('select[name="doccia_ferramenta_finitura"]')?.value || 'Cromo';
      const anticalcare = activePanel.querySelector('select[name="doccia_anticalcare"]')?.value || 'Sì (Consigliato)';
      const l1 = activePanel.querySelector('input[name="doccia_l1"]')?.value || '800';
      const l2 = activePanel.querySelector('input[name="doccia_l2"]')?.value || '1200';
      const h = activePanel.querySelector('input[name="doccia_h"]')?.value || '2000';

      items = [
        { key: 'Tipo Apertura', val: apertura },
        { key: 'Finitura Cristallo', val: finitura },
        { key: 'Spessore Lastra', val: spessore },
        { key: 'Finitura Cerniere', val: cerniere },
        { key: 'Dimensioni Vano', val: `${l1} x ${l2} x H${h} mm` },
        { key: 'Anti-Calcare', val: anticalcare }
      ];
    } else if (scenario === 'specchi') {
      const finitura = activePanel.querySelector('select[name="specchio_finitura"]')?.value || 'Naturale Chiaro';
      const spessore = activePanel.querySelector('select[name="specchio_spessore"]')?.value || '5 mm';
      const pellicola = activePanel.querySelector('select[name="specchio_pellicola"]')?.value || 'Sì + Rifilo';
      const lavorazione = activePanel.querySelector('select[name="specchio_lavorazione"]')?.value || 'Filo Lucido Base';
      const taglio = activePanel.querySelector('select[name="specchio_taglio"]')?.value || 'Squadrato';
      const l = activePanel.querySelector('input[name="specchio_l"]')?.value || '1000';
      const h = activePanel.querySelector('input[name="specchio_h"]')?.value || '1800';
      const qta = activePanel.querySelector('input[name="specchio_qta"]')?.value || '1';

      items = [
        { key: 'Finitura Specchio', val: finitura },
        { key: 'Spessore', val: spessore },
        { key: 'Pellicola Sicurezza', val: pellicola },
        { key: 'Lavorazione Bordo', val: lavorazione },
        { key: 'Tipo Taglio', val: taglio },
        { key: 'Misure (LxH)', val: `${l} x ${h} mm (x${qta} pz)` }
      ];
    }

    return items;
  }

  // Handle Form Submit
  formElement.addEventListener('submit', (e) => {
    e.preventDefault();

    const clientName = document.getElementById('field-client-name')?.value || 'Cliente';
    const clientEmail = document.getElementById('field-client-email')?.value || '';
    const clientPhone = document.getElementById('field-client-phone')?.value || '';
    const clientCity = document.getElementById('field-client-city')?.value || 'Lombardia';

    if (!clientEmail && !clientPhone) {
      alert('Per favore inserisci un recapito (Email o Telefono) per ricevere il preventivo.');
      return;
    }

    const refNum = `PREV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const activeTab = document.querySelector('.scenario-tab-btn.active');
    const scenarioName = activeTab ? activeTab.getAttribute('data-label') : 'Preventivo';
    const summaryItems = getScenarioSummaryItems();

    // Show modal
    showQuoteSuccessModal({
      refNum,
      clientName,
      clientEmail,
      clientPhone,
      clientCity,
      scenarioName,
      items: summaryItems
    });
  });
}

function showQuoteSuccessModal(data) {
  const modal = document.getElementById('quote-success-modal');
  if (!modal) return;

  const recapEl = document.getElementById('modal-recap-content');
  if (recapEl) {
    const itemsHtml = (data.items || []).map(it => `
      <div style="display:flex; justify-content:space-between; gap:12px; margin-bottom:4px;">
        <span style="color:var(--c-grey-400);">${it.key}:</span>
        <span style="color:#ffffff; font-weight:500;">${it.val}</span>
      </div>
    `).join('');

    recapEl.innerHTML = `
      <p><strong>Riferimento:</strong> <span style="color:#ffffff;">${data.refNum}</span></p>
      <p><strong>Intestatario:</strong> ${data.clientName} (${data.clientCity})</p>
      <p><strong>Contatti:</strong> ${data.clientEmail || 'N/A'} | ${data.clientPhone || 'N/A'}</p>
      <p><strong>Tipologia:</strong> ${data.scenarioName}</p>
      <div style="margin-top:12px; padding-top:10px; border-top:1px dashed rgba(255,255,255,0.1); font-size:0.82rem;">
        ${itemsHtml}
      </div>
    `;
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  const closeBtn = document.getElementById('btn-close-quote-modal');
  if (closeBtn) {
    closeBtn.onclick = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    };
  }

  const printBtn = document.getElementById('btn-print-quote');
  if (printBtn) {
    printBtn.onclick = () => {
      window.print();
    };
  }
}

/* --------------------------------------------------------------------------
   5. LIGHTBOX MODAL FOR IMAGES
   -------------------------------------------------------------------------- */
function initLightbox() {
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.querySelector('.lightbox-close');

  if (!lightbox || !lightboxImg) return;

  document.querySelectorAll('[data-lightbox]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const imgSrc = el.getAttribute('href') || el.querySelector('img')?.src;
      if (imgSrc) {
        lightboxImg.src = imgSrc;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* --------------------------------------------------------------------------
   6. MOBILE MENU
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (!mobileBtn || !navLinks) return;

  mobileBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('mobile-open');
    if (isOpen) {
      navLinks.style.display = 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '100%';
      navLinks.style.left = '0';
      navLinks.style.width = '100%';
      navLinks.style.background = 'rgba(14, 16, 20, 0.98)';
      navLinks.style.padding = '24px';
      navLinks.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
      navLinks.style.boxShadow = '0 15px 30px rgba(0,0,0,0.8)';
    } else {
      navLinks.style.display = '';
    }
  });

  // Close when clicking link
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      if (navLinks.classList.contains('mobile-open')) {
        navLinks.classList.remove('mobile-open');
        navLinks.style.display = '';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   7. SMOOTH SCROLL WITH HEADER OFFSET
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 70;
        const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight + 10;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
