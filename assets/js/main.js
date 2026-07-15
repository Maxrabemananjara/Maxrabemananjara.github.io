(function(){
  const storageKey = 'portfolio-theme-v2';
  const viewKey = 'portfolio-view';
  const defaultView = 'projects';
  const body = document.body;
  const root = document.documentElement;
  const themeButtons = Array.from(document.querySelectorAll('.theme-btn'));
  const navLinks = Array.from(document.querySelectorAll('nav a[data-view]'));
  const views = Array.from(document.querySelectorAll('.view-page'));
  const siteNav = document.getElementById('site-nav');
  const menuToggle = document.querySelector('.mobile-menu-toggle');

  function setMobileMenu(open){
    body.classList.toggle('mobile-menu-open', open);
    if(menuToggle){ menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false'); }
  }

  function closeMobileMenu(){
    setMobileMenu(false);
  }

  function applyTheme(theme){
    const safeTheme = theme === 'dark' ? 'dark' : 'light';
    body.setAttribute('data-theme', safeTheme);
    root.setAttribute('data-theme', safeTheme);
    themeButtons.forEach(function(button){
      button.textContent = safeTheme === 'dark' ? 'DARK' : 'LIGHT';
      button.classList.toggle('is-dark', safeTheme === 'dark');
      button.classList.toggle('is-light', safeTheme === 'light');
    });
    try { localStorage.setItem(storageKey, safeTheme); } catch(e) {}
  }

  function applyView(view){
    const safeView = views.some(v => v.dataset.page === view) ? view : defaultView;
    views.forEach(v => {
      if(v.dataset.page === safeView){ v.removeAttribute('hidden'); }
      else { v.setAttribute('hidden', ''); }
    });
    navLinks.forEach(link => {
      if(link.dataset.view === safeView) link.classList.add('active');
      else link.classList.remove('active');
    });
    try { localStorage.setItem(viewKey, safeView); } catch(e) {}
    closeMobileMenu();
    window.scrollTo(0,0);
    document.dispatchEvent(new CustomEvent('portfolio:viewchange', { detail: { view: safeView } }));
  }

  const savedTheme = (() => {
    try { return localStorage.getItem(storageKey); } catch(e) { return null; }
  })();
  const hashViewMap = {
    'accueil': 'about',
    'a-propos': 'about',
    'experience': 'experience',
    'formation': 'experience',
    'projets': 'projects',
    'portfolio': 'projects',
    'contact': 'contact'
  };
  const initialHash = (window.location.hash || '').replace(/^#/, '');

  applyTheme(savedTheme === 'dark' ? 'dark' : 'light');
  applyView(hashViewMap[initialHash] || defaultView);

  themeButtons.forEach(function(button){
    button.addEventListener('click', function(){
      const current = body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  });

  navLinks.forEach(link => {
    link.addEventListener('click', function(e){
      e.preventDefault();
      applyView(link.dataset.view);
    });
  });

  document.querySelectorAll('[data-view-target]').forEach(link => {
    link.addEventListener('click', function(e){
      e.preventDefault();
      const targetView = link.getAttribute('data-view-target');
      if(targetView){ applyView(targetView); }
    });
  });

  if(menuToggle){
    menuToggle.addEventListener('click', function(){
      setMobileMenu(!body.classList.contains('mobile-menu-open'));
    });
  }

  document.addEventListener('click', function(e){
    if(!body.classList.contains('mobile-menu-open')) return;
    if(siteNav && siteNav.contains(e.target)) return;
    if(menuToggle && menuToggle.contains(e.target)) return;
    closeMobileMenu();
  });

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeMobileMenu();
  });
})();

(function(){
  var overlay=document.getElementById('project1-zoom-overlay');
  var panel=document.getElementById('project1-zoom-panel');
  var image=document.getElementById('project1-zoom-image');
  var caption=document.getElementById('project1-zoom-caption');
  var closeBtn=document.getElementById('project1-zoom-close');
  var savedScroll=0;
  function openZoom(src, alt, cap){
    savedScroll=window.pageYOffset || document.documentElement.scrollTop || 0;
    image.src=src;
    image.alt=alt || '';
    caption.textContent=cap || '';
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden','false');
    document.body.classList.add('project1-zoom-lock');
  }
  function closeZoom(){
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden','true');
    document.body.classList.remove('project1-zoom-lock');
    image.removeAttribute('src');
    window.scrollTo(0, savedScroll);
  }
  window.project1OpenZoom=openZoom;
  window.project1CloseZoom=closeZoom;
  var triggers=document.querySelectorAll('.project-shot img.project1-zoom-target, .project-card > img, .project-card .project-card-image img, .project-card .project-image img');
  triggers.forEach(function(node){
    node.addEventListener('click', function(ev){
      ev.preventDefault();
      ev.stopPropagation();
      var fig=node.closest('.project-shot');
      var img=fig ? fig.querySelector('img.project1-zoom-target') : node;
      if(!img) return;
      openZoom(img.getAttribute('src'), img.getAttribute('alt'), node.getAttribute('data-zoom-caption') || img.getAttribute('data-zoom-caption') || '');
    });
  });
  closeBtn.addEventListener('click', function(ev){ ev.preventDefault(); ev.stopPropagation(); closeZoom(); });
  overlay.addEventListener('click', function(ev){ if(ev.target===overlay){ closeZoom(); } });
  panel.addEventListener('click', function(ev){ ev.stopPropagation(); });
  document.addEventListener('keydown', function(ev){ if(ev.key==='Escape' && overlay.classList.contains('is-open')){ closeZoom(); } });
})();

(function(){
  var cardsRoot=document.querySelector('.view-page[data-page="projects"] .project-cards');
  if(cardsRoot){ cardsRoot.classList.remove('is-carousel-ready'); }
})();

(function(){
  var cardsRoot=document.querySelector('.view-page[data-page="formation"] .formation-cards');
  if(!cardsRoot) return;
  var cards=Array.prototype.slice.call(cardsRoot.querySelectorAll(':scope > .card'));
  if(!cards.length) return;
  var perPage=2;
  var totalPages=Math.max(1, Math.ceil(cards.length/perPage));
  cardsRoot.classList.add('is-carousel-ready');
  var track=document.createElement('div');
  track.className='formation-carousel-track';
  for(var i=0;i<totalPages;i++){
    var page=document.createElement('div');
    page.className='formation-carousel-page';
    cards.slice(i*perPage,(i+1)*perPage).forEach(function(card){ page.appendChild(card); });
    track.appendChild(page);
  }
  cardsRoot.innerHTML='';
  cardsRoot.appendChild(track);
  var nav=document.createElement('div');
  nav.className='formation-carousel-nav';
  var prev=document.createElement('button');
  prev.type='button';
  prev.className='formation-carousel-arrow formation-carousel-prev';
  prev.setAttribute('aria-label','Formation precedente');
  prev.innerHTML='&#8249;';
  var dots=document.createElement('div');
  dots.className='formation-carousel-dots';
  var next=document.createElement('button');
  next.type='button';
  next.className='formation-carousel-arrow formation-carousel-next';
  next.setAttribute('aria-label','Formation suivante');
  next.innerHTML='&#8250;';
  nav.appendChild(prev);
  nav.appendChild(dots);
  nav.appendChild(next);
  cardsRoot.insertAdjacentElement('afterend', nav);
  var pageIndex=0;
  var dotButtons=[];
  for(var d=0; d<totalPages; d++){
    var dot=document.createElement('button');
    dot.type='button';
    dot.className='formation-carousel-dot';
    dot.setAttribute('aria-label','Aller a la vue formation '+(d+1));
    (function(index){ dot.addEventListener('click', function(){ goTo(index); }); })(d);
    dots.appendChild(dot);
    dotButtons.push(dot);
  }
  function refresh(){
    track.style.transform='translateX(-'+(pageIndex*100)+'%)';
    prev.disabled=pageIndex===0;
    next.disabled=pageIndex===totalPages-1;
    dotButtons.forEach(function(dot, idx){ dot.classList.toggle('is-active', idx===pageIndex); });
  }
  function goTo(index){
    pageIndex=Math.max(0, Math.min(totalPages-1, index));
    refresh();
  }
  prev.addEventListener('click', function(){ goTo(pageIndex-1); });
  next.addEventListener('click', function(){ goTo(pageIndex+1); });
  refresh();
})();

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const selectors = [
    'header .brand',
    'header .header-signature',
    '.view-page[data-page="about"] .about-profile-section .photo-wrap',
    '.view-page[data-page="about"] .about-profile-section .photo-card',
    '.view-page[data-page="about"] .about-profile-section h1',
    '.view-page[data-page="about"] .about-profile-section .hero-copy > *',
    '.view-page[data-page="about"] .about-profile-section .cta-row',
    '.view-page[data-page="about"] .about-profile-section .stats',
    '.view-page[data-page="about"] .about-profile-section .stats > *',
    '.view-page[data-page="about"] .stack-section .stack-title',
    '.view-page[data-page="about"] .stack-grid .stack-item',
    '.view-page[data-page="about"] .about-story-block .about-story-title',
    '.view-page[data-page="about"] .about-story-block .about-story-copy > div',
    '.view-page[data-page="about"] section.block .section-kicker',
    '.view-page[data-page="about"] section.block .section-title',
    '.view-page[data-page="about"] section.block .section-desc',
    '.view-page[data-page="about"] section.block .shell',
    '.view-page[data-page="about"] .cards .card',
    '.view-page[data-page="about"] .cards .card .card-visual',
    '.view-page[data-page="about"] .cards .card .card-copy',
    '.view-page[data-page="experience"] .section-kicker',
    '.view-page[data-page="experience"] .section-title',
    '.view-page[data-page="experience"] .section-desc',
    '.view-page[data-page="experience"] .cards .card',
    '.view-page[data-page="experience"] .cards .card .card-media',
    '.view-page[data-page="experience"] .cards .card .card-body',
    '.view-page[data-page="experience"] .timeline-shell',
    '.view-page[data-page="experience"] .timeline-item',
    '.view-page[data-page="formation"] .timeline-shell',
    '.view-page[data-page="formation"] .timeline-item',
    '.view-page[data-page="formation"] .section-kicker',
    '.view-page[data-page="formation"] .section-title',
    '.view-page[data-page="formation"] .section-desc',
    '.view-page[data-page="formation"] .shell',
    '.view-page[data-page="formation"] .cards .card',
    '.view-page[data-page="formation"] .cards .card .card-media',
    '.view-page[data-page="formation"] .cards .card .card-body',
    '.view-page[data-page="projects"] .section-kicker',
    '.view-page[data-page="projects"] .section-title',
    '.view-page[data-page="projects"] .project-cards .project-card',
    '.view-page[data-page="projects"] .project-card .card-media',
    '.view-page[data-page="projects"] .project-card .card-body',
    '.view-page[data-page="projects"] .detail-shell',
    '.view-page[data-page="projects"] .detail-gallery',
    '.view-page[data-page="projects"] .detail-gallery img',
    '.view-page[data-page="projects"] .detail-text',
    '.view-page[data-page="projects"] .recommendation-box',
    '.view-page[data-page="experience"] .experience-accomplishments-title',
    '.view-page[data-page="experience"] .accomplishment-item',
    '.view-page .shell > hr'
  ];
  const items = Array.from(document.querySelectorAll(selectors.join(','))).filter((el) => !el.classList.contains('no-scroll-reveal'));
  if (!items.length) return;

  items.forEach((el) => {
    el.classList.add('scroll-reveal');
    if (el.matches('header .brand, header .header-signature, .view-page[data-page="about"] .about-profile-section .photo-wrap, .view-page[data-page="about"] .about-profile-section .photo-card, .view-page[data-page="about"] .stack-grid .stack-item:nth-child(odd), .view-page[data-page="about"] .about-story-block:nth-child(odd) .about-story-title, .view-page[data-page="about"] .about-story-block:nth-child(odd) .about-story-copy > div, .view-page[data-page="about"] .cards .card:nth-child(odd), .view-page[data-page="experience"] .cards .card:nth-child(odd), .view-page[data-page="experience"] .timeline-item:nth-child(odd), .view-page[data-page="experience"] .accomplishment-item:nth-child(odd), .view-page[data-page="formation"] .cards .card:nth-child(odd), .view-page[data-page="formation"] .timeline-item:nth-child(odd), .view-page[data-page="projects"] .project-cards .project-card:nth-child(odd), .view-page[data-page="projects"] .detail-gallery')) {
      el.classList.add('from-left');
    } else if (el.matches('.view-page[data-page="about"] .about-profile-section h1, .view-page[data-page="about"] .about-story-block:nth-child(even) .about-story-title, .view-page[data-page="about"] .about-story-block:nth-child(even) .about-story-copy > div, .view-page[data-page="about"] .cards .card:nth-child(even), .view-page[data-page="experience"] .cards .card:nth-child(even), .view-page[data-page="experience"] .timeline-item:nth-child(even), .view-page[data-page="experience"] .accomplishment-item:nth-child(even), .view-page[data-page="formation"] .cards .card:nth-child(even), .view-page[data-page="formation"] .timeline-item:nth-child(even), .view-page[data-page="projects"] .project-cards .project-card:nth-child(even), .view-page[data-page="projects"] .detail-text')) {
      el.classList.add('from-right');
    }
  });

  if (reduceMotion) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -6% 0px'
  });

  function visibleItemsFor(view) {
    return items.filter((el) => {
      const page = el.closest('.view-page');
      return !page || page.dataset.page === view;
    });
  }

  function replayViewAnimations(view, options) {
    const settings = options || {};
    const activeItems = visibleItemsFor(view);
    if (!activeItems.length) return;
    activeItems.forEach((el, index) => {
      observer.unobserve(el);
      el.classList.remove('is-visible');
      el.style.transitionDelay = Math.min(index * 0.06, 0.54).toFixed(2) + 's';
    });
    const activate = () => {
      activeItems.forEach((el) => observer.observe(el));
    };
    if (settings.immediate) {
      requestAnimationFrame(() => requestAnimationFrame(activate));
      return;
    }
    setTimeout(() => {
      requestAnimationFrame(() => requestAnimationFrame(activate));
    }, settings.delay || 120);
  }

  function replayInitialAbout() {
    const initialView = document.querySelector('.view-page[data-page="about"]:not([hidden])') || document.querySelector('.view-page:not([hidden])');
    if (!initialView) return;
    window.scrollTo(0, 0);
    replayViewAnimations(initialView.dataset.page || 'about', { delay: 180 });
  }

  if (document.readyState === 'complete') {
    replayInitialAbout();
  } else {
    window.addEventListener('load', replayInitialAbout, { once: true });
  }

  document.addEventListener('portfolio:viewchange', function (event) {
    replayViewAnimations((event.detail && event.detail.view) || 'about', { immediate: true });
  });
})();

(function(){
  var intro=document.getElementById('about-intro');
  if(!intro) return;
  var reduceMotion=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function activeAboutView(){
    var view=intro.closest('.view-page');
    return !!view && !view.hasAttribute('hidden');
  }
  function updateAboutIntro(){
    if(!activeAboutView()){
      intro.style.opacity='1';
      intro.style.transform='translate3d(0,0,0) scale(1)';
      intro.style.filter='blur(0px)';
      return;
    }
    if(reduceMotion){
      intro.style.opacity='1';
      intro.style.transform='translate3d(0,0,0) scale(1)';
      intro.style.filter='blur(0px)';
      return;
    }
    var rect=intro.getBoundingClientRect();
    var range=Math.max(intro.offsetHeight * 0.82, 320);
    var progress=Math.min(Math.max(-rect.top / range, 0), 1);
    var eased=1 - Math.pow(1 - progress, 2.2);
    intro.style.opacity=(1 - eased).toFixed(3);
    intro.style.transform='translate3d(0,' + (-28 * eased).toFixed(2) + 'px,0) scale(' + (1 + 0.045 * eased).toFixed(4) + ')';
    intro.style.filter='blur(' + (2.2 * eased).toFixed(2) + 'px)';
  }
  window.addEventListener('scroll', updateAboutIntro, {passive:true});
  window.addEventListener('resize', updateAboutIntro);
  document.addEventListener('portfolio:viewchange', function(){
    requestAnimationFrame(function(){
      requestAnimationFrame(updateAboutIntro);
    });
  });
  if(document.readyState==='complete') updateAboutIntro();
  else window.addEventListener('load', updateAboutIntro, {once:true});
})();
(function(){
  var projectView=document.querySelector('.view-page[data-page="projects"]');
  if(!projectView) return;
  var listView=projectView.querySelector('.project-list-view');
  var details=Array.prototype.slice.call(projectView.querySelectorAll('.project-detail'));
  var openLinks=Array.prototype.slice.call(projectView.querySelectorAll('[data-project-target]'));
  var backLinks=Array.prototype.slice.call(projectView.querySelectorAll('[data-project-back]'));
  if(!details.length || !listView) return;
  function setHash(hash){
    if(!window.history || !window.history.pushState) return;
    window.history.pushState(null, '', hash);
  }
  function showList(updateHash){
    projectView.classList.remove('is-project-detail');
    listView.removeAttribute('hidden');
    details.forEach(function(detail){
      detail.classList.remove('is-active');
      detail.setAttribute('hidden', '');
    });
    if(updateHash) setHash('#portfolio-list');
    window.scrollTo(0,0);
  }
  function showProject(id, updateHash){
    var detail=details.filter(function(item){ return item.id === id; })[0];
    if(!detail) return false;
    projectView.classList.add('is-project-detail');
    listView.setAttribute('hidden', '');
    details.forEach(function(item){
      if(item===detail){
        item.removeAttribute('hidden');
        item.classList.add('is-active');
      } else {
        item.classList.remove('is-active');
        item.setAttribute('hidden', '');
      }
    });
    if(updateHash) setHash('#'+id);
    window.scrollTo(0,0);
    document.dispatchEvent(new CustomEvent('portfolio:projectchange', { detail: { project: id } }));
    return true;
  }
  openLinks.forEach(function(link){
    link.addEventListener('click', function(event){
      if(showProject(link.getAttribute('data-project-target'), true)){
        event.preventDefault();
      }
    });
  });
  projectView.addEventListener('click', function(event){
    var link=event.target.closest ? event.target.closest('[data-project-target]') : null;
    if(!link || !projectView.contains(link) || openLinks.indexOf(link) !== -1) return;
    if(showProject(link.getAttribute('data-project-target'), true)){
      event.preventDefault();
    }
  });
  backLinks.forEach(function(link){
    link.addEventListener('click', function(event){
      event.preventDefault();
      showList(true);
    });
  });
  document.addEventListener('portfolio:viewchange', function(event){
    if(event.detail && event.detail.view === 'projects'){
      showList(false);
    }
  });
  function handleProjectHash(){
    var startId=(location.hash || '').slice(1);
    if(startId && showProject(startId, false)) return;
    if(startId === 'portfolio-list') showList(false);
  }
  if(location.hash){
    handleProjectHash();
  } else {
    showList(false);
  }
  window.addEventListener('hashchange', handleProjectHash);
})();


(function(){
  var frames = Array.prototype.slice.call(document.querySelectorAll('iframe[data-default-powerbi-page]'));
  if(!frames.length) return;
  function sendPage(frame){
    var pageName = frame.getAttribute('data-default-powerbi-page');
    if(!pageName || !frame.contentWindow) return;
    try {
      frame.contentWindow.postMessage(JSON.stringify({ action: 'setPage', pageName: pageName }), '*');
    } catch(e) {}
  }
  frames.forEach(function(frame){
    frame.addEventListener('load', function(){
      setTimeout(function(){ sendPage(frame); }, 900);
      setTimeout(function(){ sendPage(frame); }, 2200);
      setTimeout(function(){ sendPage(frame); }, 4200);
    });
    setTimeout(function(){ sendPage(frame); }, 1800);
    setTimeout(function(){ sendPage(frame); }, 3600);
  });
  document.addEventListener('portfolio:projectchange', function(event){
    if(!event.detail || event.detail.project !== 'projet-analyse-mobilite-rhone-detail') return;
    frames.forEach(function(frame){
      setTimeout(function(){ sendPage(frame); }, 900);
      setTimeout(function(){ sendPage(frame); }, 2200);
    });
  });
})();


(function(){
  const form = document.querySelector('[data-contact-form]');
  if(!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    const name = (document.getElementById('contact-name') || {}).value || '';
    const email = (document.getElementById('contact-email') || {}).value || '';
    const message = (document.getElementById('contact-message') || {}).value || '';
    const english = document.documentElement.lang === 'en';
    const subject = encodeURIComponent((english ? 'Message from the portfolio - ' : 'Message depuis le portfolio - ') + (name.trim() || 'Contact'));
    const body = encodeURIComponent(english
      ? 'Name: ' + name.trim() + '\nEmail: ' + email.trim() + '\n\nMessage:\n' + message.trim()
      : 'Nom : ' + name.trim() + '\nEmail : ' + email.trim() + '\n\nMessage :\n' + message.trim());
    window.location.href = 'mailto:mandrindra23@yahoo.fr?subject=' + subject + '&body=' + body;
  });
})();

(function(){
  const languageKey = 'portfolio-language';
  const languageButtons = Array.from(document.querySelectorAll('.language-btn'));
  const htmlEntries = [];
  const attributeEntries = [];

  function addHTML(selector, englishValues){
    const elements = Array.from(document.querySelectorAll(selector));
    if(elements.length !== englishValues.length) return;
    elements.forEach(function(element, index){
      htmlEntries.push({ element: element, fr: element.innerHTML, en: englishValues[index] });
    });
  }

  function addAttribute(selector, attribute, englishValues){
    const elements = Array.from(document.querySelectorAll(selector));
    if(elements.length !== englishValues.length) return;
    elements.forEach(function(element, index){
      attributeEntries.push({
        element: element,
        attribute: attribute,
        fr: element.getAttribute(attribute) || '',
        en: englishValues[index]
      });
    });
  }

  addHTML('.site-nav a[data-view]', ['About', 'Portfolio', 'Experience', 'Contact']);
  addHTML('.about-intro-text', [
    'This portfolio presents projects covering distinct themes, from <span class="portfolio-domain-accent">data engineering</span> to management control, <span class="portfolio-domain-accent">data analysis</span>, data visualization and web development, with one shared goal: turning a specific subject into a <span class="portfolio-domain-accent">clear, useful and decision-oriented solution</span>.'
  ]);
  addHTML('.about-profile-section .hero-copy p', [
    '<strong>I am Mandrindra RABEMANANJARA</strong>, a <strong>data engineer</strong> with a background in <strong>management control</strong>. With <strong>8 years of experience</strong> in strongly <strong>data-oriented</strong> business environments, I design analyses, reports and decision-support tools that help drive performance.',
    'I work across the entire <strong>decision-making data chain</strong>: requirements gathering, user stories, agile delivery, data structuring, pipeline development, automation, quality control and production deployment, using <strong>Python</strong> and <strong>SQL</strong>, cloud-data platforms such as <strong>Microsoft Fabric</strong>, <strong>AWS</strong> and <strong>GCP</strong>, and orchestration and automation tools including <strong>n8n</strong> and <strong>GitHub Actions</strong>.',
    'In management control, I work on budgeting cycles, closing periods, forecasts, workforce reporting, performance analysis and data visualization, using data from <strong>ERP</strong> and <strong>HRIS</strong> systems and transforming it into reports and dashboards with <strong>Advanced Excel / VBA</strong>, <strong>Power BI</strong>, <strong>Qlik</strong>, <strong>Looker</strong> and <strong>MyReport</strong>, with a focus on <strong>reliability</strong>, <strong>clarity</strong> and <strong>decision support</strong>.'
  ]);
  addHTML('.about-profile-section .cta-row > a:not(.btn-github)', ['✉ Contact me', 'View experience →']);
  addHTML('.stack-section .stack-title', ['Technical stack', 'Business tools &amp; ERP']);
  addHTML('.expertise-metric-label span', ['years of experience', 'years of experience', 'years of experience']);

  addHTML('#experience > .section-inner > .section-title', ['Organizations that trusted me']);
  addHTML('.experience-company-cards .card-subtitle', [
    'Lyon-based foundation for mental health, disability and social care',
    'Public-interest foundation supporting vulnerable people',
    'Global IT consulting and digital services group',
    'Leader in digital engineering, IT and engineering',
    'Public-interest organization dedicated to asylum and integration',
    'Madagascar’s National Investment Company'
  ]);
  addHTML('.experience-company-cards .card-text', [
    'The ARHM Foundation works in mental health and disability. Its complementary activities—prevention, research, care and inclusion—aim to improve the care pathway and quality of life of the people it supports across the Lyon metropolitan area, the Rhône department and southern Saône-et-Loire.',
    'Rooted in the Rhône department and the Lyon metropolitan area, the ACOLEA Foundation promotes social justice, equal rights and support for vulnerable children, young people, families and adults.',
    'CGI is one of the world’s largest IT and professional services consulting firms, helping organizations with digital transformation and performance improvement.',
    'Akkodis combines technological expertise, digital engineering and consulting to accelerate digital transformation, innovation and skills development within organizations.',
    'Forum Réfugiés works in France and internationally to welcome and support refugees, defend the right to asylum and promote the rule of law.',
    'SONAPAR supports Madagascar’s economic development through private equity, providing equity and quasi-equity financing solutions for companies and value-creating projects.'
  ]);
  addHTML('.experience-company-cards .company-link', ['Learn more', 'Learn more', 'Learn more', 'Learn more', 'Learn more', 'Learn more']);
  addHTML('.experience-accomplishments-title', ['Achievements']);
  addHTML('.accomplishment-heading', [
    'Post-merger restructuring',
    'Integration of core business tools',
    'Creation of a management control department',
    'Transformation of financial tools',
    'Financial recovery and budget management',
    'Strategic management and group visibility'
  ]);
  addHTML('.accomplishment-copy', [
    'Active participation in the restructuring following the merger of Modis and Akka Technologies, which created AKKODIS. Contributed to team reorganization, stronger internal synergies and the implementation of a more coherent financial and operational organization aligned with the priorities of the new group.',
    'Contributed to the integration of billing software and an ERP system as the management-control business representative. Participated in requirements gathering, testing, acceptance and functional adjustments, while redesigning the analytical chart of accounts to make financial management more reliable.',
    'Created and structured a dedicated management control department to support growth and strengthen performance management. The team now consists of three people.',
    'Modernized financial tools by deploying automated solutions that significantly reduced reporting lead times. This transformation also strengthened key-indicator monitoring, giving management a clearer, more reliable and more responsive view of performance.',
    'Contributed to turning around a loss-making financial position and restoring a positive net result. Implemented structured cash-flow monitoring that sustainably eliminated bank overdrafts and stabilized the financial position.',
    'Deployed quarterly forecasts and structured concise financial reporting for the Board of Directors. This approach provided a clear, shared and decision-oriented view of the group’s financial and strategic objectives.'
  ]);
  addHTML('.formation-integrated-title', ['Education']);
  addHTML('.formation-timeline .timeline-company', [
    'Wild Code School',
    'INSEEC U — Lyon, France',
    'New Jersey City University — New Jersey, United States'
  ]);
  addHTML('.formation-timeline .timeline-role', [
    'Data Engineer / Data Analyst program',
    'Master’s degree in Audit and Management Control',
    'Bachelor of Science in Finance'
  ]);
  addHTML('.formation-timeline .timeline-project', [
    'Intensive data, automation and analytics program, developing practical skills in Python, SQL, Power BI, ETL, Docker and data visualization tools.',
    'Program focused on performance management, financial analysis, audit, corporate finance and IFRS standards.',
    'Program focused on financial management, planning, risk, international markets and US GAAP.'
  ]);
  addHTML('.formation-timeline .timeline-tag', [
    'Python', 'SQL', 'Power BI', 'ETL', 'Docker', 'Machine Learning',
    'Audit', 'Management Control', 'Performance', 'Corporate Finance',
    'Finance', 'Risk management', 'US GAAP', 'International Markets'
  ]);
  addHTML('.formation-timeline .timeline-highlight', [
    '<strong>Approach:</strong> project-based training in data engineering, analytics and business intelligence tools.',
    '<strong>Contribution:</strong> strengthened expertise in audit, financial performance and IFRS standards.',
    '<strong>Contribution:</strong> consolidated a strong foundation in international finance and US GAAP.'
  ]);
  addHTML('.formation-cards .card-subtitle', [
    'Bachelor of Science – Finance · 2016',
    'Master’s degree in Finance – Audit &amp; Management Control · 2018',
    'RNCP certification – Data Analyst · 2026'
  ]);
  addHTML('.formation-cards .card-text', [
    'New Jersey City University (NJCU) is a public university in Jersey City, immediately adjacent to New York City. Founded in 1927, it offers a broad range of programs in business, science, education and professional studies, with a strong focus on applied learning and career readiness. Located in one of the most diverse cities in the United States, it provides a dynamic international environment that encourages openness, adaptability and an understanding of varied economic contexts.',
    'INSEEC is a recognized French business school specializing in management, finance and marketing, with a strong focus on employability and international environments. Present in several major cities, it offers career-oriented programs developed in close collaboration with companies and encourages a practical approach to management, performance and decision-making challenges. Its positioning combines academic rigor with exposure to operational realities.',
    'Wild Code School specializes in technology and data careers and is known for intensive, certified and highly practical programs. Available across several French campuses and remotely, its teaching model is built around real-world projects, personalized support and continuous adaptation to market needs. Its approach emphasizes rapid skills development, employability and mastery of tools that can be applied directly in the workplace.'
  ]);
  addHTML('.formation-cards .formation-link', ['Learn more', 'Learn more', 'Learn more']);

  addHTML('.project-cards .card-title', [
    'Automated dashboard for cancelled trains',
    'Rhône Mobility Analysis',
    'Web development: multi-view portfolio website'
  ]);
  addHTML('.project-cards .card-subtitle', [
    'Data engineering · Microsoft Fabric · GitHub Actions · GitHub Pages',
    'Data Analysis · Power BI · Dataviz · Python · Open Data',
    'Front-end · GitHub Pages · Vanilla JavaScript · Responsive'
  ]);
  addHTML('.project-cards .card-text', [
    'Designed a complete data pipeline for SNCF cancelled-train data published on data.gouv.fr: ingestion, quality control, Bronze / Silver / Gold modeling and automated publication of a business dashboard updated daily.',
    'Analyzed mobility across the Rhône department and Lyon metropolitan area using open data: Python preparation, analytical-model design and delivery through a clear Power BI report focused on territory, travel patterns and geographic concentration.',
    'Developed a static, responsive, multi-view portfolio website with vanilla HTML, CSS and JavaScript, published through GitHub Pages.'
  ]);
  addHTML('.project-cards .project-open-link span', ['Learn more', 'Learn more', 'Learn more']);
  addHTML('.project-card .project-button[href^="https://maxrabemananjara.github.io/"] > span:last-child', ['Website', 'Website']);
  addHTML('.project-back-button', ['← Back to portfolio', '← Back to portfolio', '← Back to portfolio']);

  addHTML('.trains-article-header .section-kicker', ['DATA ENGINEERING PROJECT']);
  addHTML('.trains-article-header h1', ['Open Data mobility:<br>automated monitoring of<br>cancelled trains']);
  addHTML('.trains-article-lead', ['Transforming raw public data into actionable, validated indicators available through a web dashboard.']);
  addHTML('.trains-article-meta', ['Project: <strong>Data Engineering / BI / Open Data</strong>']);
  addHTML('.trains-article-section > h2', ['CONTEXT', 'PROPOSED SOLUTION', 'DELIVERY', 'RESULT', 'TECHNICAL STACK', 'EXTERNAL LINKS']);
  addHTML('.trains-article-section > p', [
    'Mobility data is often available as public files that are accessible but difficult to use directly. This project starts from a concrete case: the list of cancelled trains published on data.gouv.fr. The goal is not simply to display figures, but to build a data pipeline that turns these files into clear, validated and reusable information.',
    'The solution is based on an automated pipeline: source-data retrieval, schema validation, cleaning, standardization, deduplication and analytical-model construction. The architecture follows a Bronze / Silver / Gold approach to separate raw, validated and analysis-ready data.',
    'Microsoft Fabric provides the technical foundation for organizing the Lakehouse zones, while GitHub Actions and GitHub Pages handle updates and publication of the public dashboard.',
    'The dashboard tracks cancellations over a selected period, filters by station or train type, and identifies the most affected stations or routes. Its charts show volumes, daily trends, distribution by train type and time slots.'
  ]);
  addHTML('.trains-article-facts span', ['Source', 'Architecture', 'Delivery']);
  addHTML('.trains-article-facts strong', [
    'Public data published on data.gouv.fr',
    'Bronze / Silver / Gold with Microsoft Fabric',
    'Public dashboard published through GitHub Pages'
  ]);
  addHTML('.trains-article-figure figcaption', [
    'Project workflow: from open-data source to public delivery.',
    'Business dashboard: KPIs, trends, affected stations and monitoring filters.'
  ]);
  addHTML('.trains-proof-section li', [
    'Transformed raw public data into clear, actionable business indicators.',
    'Structured a <strong>Bronze / Silver / Gold</strong> architecture to separate raw, validated and analysis-ready data.',
    'Implemented quality checks for the schema, mandatory fields, dates, times and duplicates.',
    'Built an analytical model organized around facts, dimensions and KPIs.',
    'Published an accessible web dashboard with automated updates.'
  ]);
  addHTML('.trains-links-section .project-button:not(.project-button-secondary)', ['View dashboard']);

  addHTML('.mobilite-article-header .section-kicker', ['BI PROJECTS · DATA ANALYSIS · DATAVIZ · BUSINESS INSIGHTS']);
  addHTML('.mobilite-article-header h1', ['Transforming public data into an actionable Power BI solution']);
  addHTML('.mobilite-article-meta', ['Project: <strong>Data Analysis / Dataviz / Power BI</strong>']);
  addHTML('.mobilite-article-lead', [
    'This project analyzes mobility across the Rhône department and the Lyon metropolitan area using public sources. The aim is not to present a simple visualization, but to demonstrate a complete process: data preparation with Python, design of an analytical model and delivery through a clear Power BI report.',
    'The final report explores the area from three perspectives: overall volume, travel patterns over time and geographic concentration. Technical details remain available in the GitHub repository so that the project can be audited.'
  ]);
  addHTML('.mobilite-article-section > h2', [
    'PROJECT APPROACH', 'PROCESSING PIPELINE', 'POWER BI MODELING', 'POWER BI REPORT', 'TECHNICAL STACK', 'CONCLUSION'
  ]);
  addHTML('.mobilite-article-section > p:not(.mobilite-powerbi-caption)', [
    'The project’s value lies in the connection between Python, Power BI and business-oriented delivery. Each step has a distinct role: preparing the data correctly, building a coherent model and producing a clear view of the territory.',
    'The workflow presents the project’s overall logic: starting with scattered public data, validating and transforming it with Python, then structuring it in a Power BI model designed for territorial analysis.',
    'The prepared data is organized using a data-warehouse approach. Fact tables retain the detail of journeys, counts, weather, roadworks and stations, while dimensions structure dates, municipalities, time slots, areas and fares.',
    'This organization avoids an overly heavy single table and feeds Power BI through clear relationships, consistent filters and reliable indicators.',
    'The Power BI report brings together three pages: overview, time analysis and geographic analysis. The embedded report below lets users navigate directly between pages while preserving the dashboard’s filters and interactions.',
    'The analysis highlights mobility concentrated around a small number of recurring hubs. From January to March 2026, the model covers 74,795 journeys; March is the strongest month after a slight dip in February.',
    'The most visible flows notably involve Villeurbanne, Bron, Saint-Priest, Écully and Bourgoin-Jallieu. The time analysis confirms two dominant periods: 08:00–12:00 and 16:00–20:00, mainly on working days.',
    'The report therefore turns scattered open sources into a functional view of the area: identifying the busiest zones, understanding peak periods and highlighting routes that warrant deeper analysis.'
  ]);
  addHTML('.mobilite-step-grid span', ['1 · Python preparation', '2 · Power BI modeling', '3 · Visual storytelling']);
  addHTML('.mobilite-step-grid p', [
    'Collected open sources, performed profiling, checked volumes, duplicates, empty values and formats, and added time or geographic enrichments.',
    'Built a constellation analytical model with facts, dimensions, technical keys and consistent relationships for stable filtering.',
    'Delivered three pages—overview, time analysis and geographic analysis—to guide interpretation of the territory.'
  ]);
  addHTML('.mobilite-article-figure figcaption', [
    'Summary workflow: open sources, Python profiling, data preparation, analytical model and Power BI dashboard.',
    'Power BI model extract: fact tables, dimensions and analytical relationships.'
  ]);
  addHTML('.mobilite-powerbi-caption', ['Interactive Power BI report: overview, time analysis and geographic analysis.']);

  addHTML('.portfolio-web-article-header h1', ['Web development:<br>multi-view portfolio website']);
  addHTML('.portfolio-web-article-lead', [
    'This project covers the development of the personal portfolio website published through GitHub Pages. Its purpose is not merely to create a showcase page, but to design a professional platform that structures an identity, highlights projects and presents a career path through clear navigation and a responsive experience.'
  ]);
  addHTML('.portfolio-web-article-meta', ['Project: <strong>Front-end / GitHub Pages / Portfolio</strong>']);
  addHTML('.portfolio-web-article-section > h2', ['CONTEXT', 'TECHNICAL IMPLEMENTATION', 'RESULT', 'TECHNICAL STACK', 'EXTERNAL LINKS']);
  addHTML('.portfolio-web-article-section > p', [
    'The project follows a technically streamlined approach: building a fast, scalable static website while maintaining a clear presentation of content and achievements.',
    'The website must be easy for a recruiter to read while demonstrating genuine technical ability: structuring a web interface, organizing project content, managing interactions, integrating external resources and publishing a polished result without a heavy framework.',
    'The result is a fast, clear, responsive and maintainable web portfolio that presents a professional profile, detailed projects and external resources through a consistent interface. New project cards can be added progressively without changing the existing architecture.'
  ]);
  addHTML('.portfolio-web-context-summary span', ['FOUNDATION', 'PUBLICATION', 'EXPERIENCE']);
  addHTML('.portfolio-web-context-summary strong', [
    'Vanilla HTML / CSS / JavaScript',
    'GitHub Pages',
    'Responsive · Light/Dark · multi-view'
  ]);
  addHTML('.portfolio-web-article-figure figcaption', [
    'Editorial and technical architecture of the portfolio: internal views, detailed projects and web publication.'
  ]);
  addHTML('.portfolio-web-article-section > ul > li', [
    'Built a complete static website with vanilla HTML5, CSS3 and JavaScript.',
    'Implemented multi-view navigation without full-page reloads.',
    'Created a Light/Dark system with CSS variables and local persistence.',
    'Added a responsive mobile menu.',
    'Designed project cards with three distinct actions.',
    'Integrated detailed project pages.',
    'Embedded Power BI through an iframe.',
    'Published through GitHub Pages without a framework or mandatory build step.',
    'Organized local assets: images, SVG files, backgrounds and documents.'
  ]);
  addHTML('.portfolio-web-tech-grid .stack-name', [
    'HTML5', 'CSS3', 'Vanilla JavaScript', 'GitHub Pages', 'Power BI iframe', 'Responsive design', 'Light / Dark mode'
  ]);
  addHTML('.portfolio-web-links-section .project-button:not(.project-button-secondary) > span:last-child', ['Website']);

  addHTML('.contact-form-heading', ['Contact me']);
  addHTML('.contact-form label', ['Name', 'Email', 'Your message']);
  addHTML('.contact-submit', ['Send']);
  addHTML('.model-footer-copy', ['© 2026 Mandrindra Rabemananjara. All rights reserved.']);
  addHTML('.model-footer-nav a', ['About', 'Portfolio', 'Experience', 'Contact']);
  addHTML('.model-footer-title', ['Contact details']);

  addAttribute('.language-switch', 'aria-label', ['Choose language']);
  addAttribute('.header-signature', 'aria-label', ['Mandrindra Rabemananjara emblem']);
  addAttribute('.header-signature img', 'alt', ['Mandrindra Rabemananjara emblem']);
  addAttribute('.site-nav', 'aria-label', ['Main navigation']);
  addAttribute('.mobile-menu-toggle', 'aria-label', ['Open menu']);
  addAttribute('.about-intro-light', 'alt', ['Connected background image in light mode']);
  addAttribute('.about-intro-dark', 'alt', ['Connected background image in dark mode']);
  addAttribute('.about-profile-section .photo-card img', 'alt', ['Professional portrait of Mandrindra Rabemananjara']);
  addAttribute('.expertise-metrics-grid', 'aria-label', ['Key experience']);
  addAttribute('.accomplishment-icon', 'alt', [
    'Post-merger restructuring',
    'Integration of core business tools',
    'Creation of a management control department',
    'Transformation of financial tools',
    'Financial recovery and budget management',
    'Strategic management and group visibility'
  ]);
  addAttribute('.project-card > .card-media img', 'alt', [
    'Automated dashboard for cancelled trains',
    'Rhône Mobility Analysis',
    'Web development: multi-view portfolio website'
  ]);
  addAttribute('.trains-article-cover img', 'alt', ['Editorial map, KPIs and delivery pipeline']);
  addAttribute('.trains-article-cover img', 'data-caption', ['Cover image']);
  addAttribute('.trains-article-cover img', 'data-zoom-caption', ['Cover image']);
  addAttribute('.trains-article-figure img[src*="img-trains-supprimes-02"]', 'alt', ['Project workflow: from open data to public delivery']);
  addAttribute('.trains-article-figure img[src*="img-trains-supprimes-02"]', 'data-caption', ['Project workflow']);
  addAttribute('.trains-article-figure img[src*="img-trains-supprimes-02"]', 'data-zoom-caption', ['Project workflow']);
  addAttribute('.trains-article-figure img[src*="img-trains-supprimes-03"]', 'alt', ['Business dashboard: KPIs, trends, affected stations and monitoring filters']);
  addAttribute('.trains-article-figure img[src*="img-trains-supprimes-03"]', 'data-caption', ['Business dashboard']);
  addAttribute('.trains-article-figure img[src*="img-trains-supprimes-03"]', 'data-zoom-caption', ['Business dashboard']);
  addAttribute('.project-tech-grid', 'aria-label', ['Project technical stack']);
  addAttribute('.trains-links-section .project-github-link', 'aria-label', ['View GitHub']);
  addAttribute('.trains-links-section .project-github-link', 'title', ['View GitHub']);

  addAttribute('.mobilite-article-cover img', 'alt', ['Rhône Mobility Analysis']);
  addAttribute('.mobilite-article-cover img', 'data-caption', ['Rhône Mobility Analysis']);
  addAttribute('.mobilite-article-cover img', 'data-zoom-caption', ['Rhône Mobility Analysis']);
  addAttribute('.mobilite-article-figure img[src*="img-mobilite-rhone-02"]', 'alt', ['Summary workflow: open sources, Python profiling, data preparation, analytical model and Power BI dashboard.']);
  addAttribute('.mobilite-article-figure img[src*="img-mobilite-rhone-02"]', 'data-caption', ['Summary workflow: open sources, Python profiling, data preparation, analytical model and Power BI dashboard.']);
  addAttribute('.mobilite-article-figure img[src*="img-mobilite-rhone-02"]', 'data-zoom-caption', ['Summary workflow: open sources, Python profiling, data preparation, analytical model and Power BI dashboard.']);
  addAttribute('.mobilite-article-figure img[src*="img-mobilite-rhone-03"]', 'alt', ['Power BI model extract: fact tables, dimensions and analytical relationships.']);
  addAttribute('.mobilite-article-figure img[src*="img-mobilite-rhone-03"]', 'data-caption', ['Power BI model extract: fact tables, dimensions and analytical relationships.']);
  addAttribute('.mobilite-article-figure img[src*="img-mobilite-rhone-03"]', 'data-zoom-caption', ['Power BI model extract: fact tables, dimensions and analytical relationships.']);
  addAttribute('.mobilite-powerbi-embed', 'aria-label', ['Interactive Power BI report: Rhône Mobility Analysis']);
  addAttribute('.mobilite-tech-grid', 'aria-label', ['Project technical stack']);

  addAttribute('.portfolio-web-article-cover img', 'alt', ['Web development: multi-view portfolio website']);
  addAttribute('.portfolio-web-article-cover img', 'data-caption', ['Web development: multi-view portfolio website']);
  addAttribute('.portfolio-web-article-cover img', 'data-zoom-caption', ['Web development: multi-view portfolio website']);
  addAttribute('.portfolio-web-article-figure img[src*="img-portfolio-web-02"]', 'alt', ['Portfolio technical stack and workflow']);
  addAttribute('.portfolio-web-article-figure img[src*="img-portfolio-web-02"]', 'data-caption', ['Portfolio technical stack and workflow']);
  addAttribute('.portfolio-web-article-figure img[src*="img-portfolio-web-02"]', 'data-zoom-caption', ['Portfolio technical stack and workflow']);
  addAttribute('.portfolio-web-context-summary', 'aria-label', ['Web portfolio project summary']);
  addAttribute('.portfolio-web-tech-grid', 'aria-label', ['Project technical stack']);
  addAttribute('.portfolio-web-links-section .project-github-link', 'aria-label', ['View GitHub']);
  addAttribute('.portfolio-web-links-section .project-github-link', 'title', ['View GitHub']);
  addAttribute('.contact-form', 'aria-label', ['Contact form']);
  addAttribute('.model-footer-mr', 'aria-label', ['Back to home']);
  addAttribute('.model-footer-emblem', 'aria-label', ['Back to home']);
  addAttribute('.model-footer-nav', 'aria-label', ['Footer navigation']);
  addAttribute('#project1-zoom-panel', 'aria-label', ['Project image zoom']);
  addAttribute('#project1-zoom-close', 'aria-label', ['Close zoom']);
  addAttribute('.formation-carousel-prev', 'aria-label', ['Previous education slide']);
  addAttribute('.formation-carousel-next', 'aria-label', ['Next education slide']);
  addAttribute('.formation-carousel-dot', 'aria-label', ['Go to education slide 1', 'Go to education slide 2']);

  function applyLanguage(language){
    const safeLanguage = language === 'en' ? 'en' : 'fr';
    document.documentElement.lang = safeLanguage;
    document.body.setAttribute('data-language', safeLanguage);
    htmlEntries.forEach(function(entry){
      entry.element.innerHTML = safeLanguage === 'en' ? entry.en : entry.fr;
    });
    attributeEntries.forEach(function(entry){
      entry.element.setAttribute(entry.attribute, safeLanguage === 'en' ? entry.en : entry.fr);
    });
    document.querySelectorAll('[data-lang-src-fr][data-lang-src-en]').forEach(function(image){
      image.setAttribute('src', image.getAttribute(safeLanguage === 'en' ? 'data-lang-src-en' : 'data-lang-src-fr'));
    });
    languageButtons.forEach(function(button){
      const active = button.getAttribute('data-language') === safeLanguage;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    try { localStorage.setItem(languageKey, safeLanguage); } catch(e) {}
    document.dispatchEvent(new CustomEvent('portfolio:languagechange', { detail: { language: safeLanguage } }));
  }

  let savedLanguage = 'fr';
  try { savedLanguage = localStorage.getItem(languageKey) === 'en' ? 'en' : 'fr'; } catch(e) {}
  applyLanguage(savedLanguage);

  languageButtons.forEach(function(button){
    button.addEventListener('click', function(){
      applyLanguage(button.getAttribute('data-language'));
    });
  });
})();
