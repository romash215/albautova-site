// Появление блоков при скролле
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: .1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Тень у шапки при прокрутке (на обеих страницах)
document.querySelectorAll('.nav').forEach(nav => {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
});

// Переключение страниц: главная <-> программа брендинга
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
  document.querySelectorAll('.reveal').forEach(el => {
    if (el.closest('.page').id === id) {
      el.classList.remove('in');
      io.observe(el);
    }
  });
}

document.addEventListener('click', e => {
  const t = e.target.closest('[data-go]');
  if (!t) return;
  e.preventDefault();
  const toBrand = t.dataset.go === 'brand';
  if (location.hash !== (toBrand ? '#brend' : '')) {
    history.pushState(null, '', toBrand ? '#brend' : location.pathname + location.search);
  }
  showPage(toBrand ? 'page-brand' : 'page-home');
});

// Прямая ссылка на программу брендинга: albautova.site/#brend
function pageFromHash() {
  return location.hash === '#brend' ? 'page-brand' : 'page-home';
}
if (location.hash === '#brend') showPage('page-brand');
window.addEventListener('popstate', () => showPage(pageFromHash()));

// Бургер-меню (мобильная навигация)
document.querySelectorAll('.nav').forEach(nav => {
  const burger = nav.querySelector('.burger');
  const menu = nav.querySelector('.mobile-menu');
  if (!burger || !menu) return;

  const closeMenu = () => {
    menu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  };
  const openMenu = () => {
    menu.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
  };

  burger.addEventListener('click', e => {
    e.stopPropagation();
    menu.classList.contains('open') ? closeMenu() : openMenu();
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('click', e => {
    if (!nav.contains(e.target)) closeMenu();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 880) closeMenu();
  });
});
