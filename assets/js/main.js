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
    const subject = encodeURIComponent('Message depuis le portfolio - ' + (name.trim() || 'Contact'));
    const body = encodeURIComponent('Nom : ' + name.trim() + '\nEmail : ' + email.trim() + '\n\nMessage :\n' + message.trim());
    window.location.href = 'mailto:mandrindra23@yahoo.fr?subject=' + subject + '&body=' + body;
  });
})();
