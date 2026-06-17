/**
 * GreenEarth — Main JavaScript
 * Handles navigation, scroll animations, and stat counters
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollAnimations();
  initStatCounters();
  initFormHandler();
});

/* --- Mobile Navigation --- */
function initNavigation() {
  const header = document.getElementById('header');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav__link');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    navToggle.setAttribute(
      'aria-expanded',
      navMenu.classList.contains('active')
    );
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');

      navLinks.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });
}

/* --- Scroll-triggered Animate.css --- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');

  const revealElement = (el) => {
    const animation = el.dataset.animation || 'animate__fadeInUp';
    el.classList.add(animation, 'animated');
    observer.unobserve(el);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          revealElement(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (inView) {
      revealElement(el);
    } else {
      observer.observe(el);
    }
  });
}

/* --- Animated Stat Counters --- */
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-card__number');
  let animated = false;

  const formatNumber = (num) => {
    if (num >= 1000) {
      return num.toLocaleString();
    }
    return num.toString();
  };

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2000;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      el.textContent = formatNumber(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = formatNumber(target);
      }
    };

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      if (animated) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animated = true;
          statNumbers.forEach(animateCounter);
          observer.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );

  const statsSection = document.getElementById('impact');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* --- Form Submission --- */
function initFormHandler() {
  const form = document.querySelector('.cta__form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    btn.textContent = 'Thank You!';
    btn.disabled = true;
    btn.style.opacity = '0.8';

    setTimeout(() => {
      form.reset();
      btn.textContent = originalText;
      btn.disabled = false;
      btn.style.opacity = '1';
    }, 2500);
  });
}
