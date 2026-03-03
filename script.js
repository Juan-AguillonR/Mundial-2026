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