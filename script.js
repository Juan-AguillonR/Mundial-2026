const hamburger = document.getElementById('hamburger');
const navbar = document.getElementById('navbar');
if (hamburger && navbar) {
  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('active');
    navbar.classList.toggle('open');
    const isOpen = navbar.classList.contains('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });
  navbar.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('active');
      navbar.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
  document.addEventListener('click', function (e) {
    if (!navbar.contains(e.target) && !hamburger.contains(e.target)) {
      hamburger.classList.remove('active');
      navbar.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}


/* 2. HEADER SCROLLED */
const filter = document.querySelector('.filter');
window.addEventListener('scroll', function () {
  if (!filter) return;
  if (window.scrollY > 50) filter.classList.add('scrolled');
  else                      filter.classList.remove('scrolled');
});

/* 3. SCROLL TO TOP BUTTON */
const scrollToTopBtn = document.getElementById('scrollToTop');
if (scrollToTopBtn) {
  window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
      scrollToTopBtn.classList.add('show');
    } else {
      scrollToTopBtn.classList.remove('show');
    }
  });

  scrollToTopBtn.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}