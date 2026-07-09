const loader = document.querySelector('.loader');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const backToTop = document.querySelector('.back-to-top');
const jobSearchInput = document.getElementById('jobSearchInput');
const heroSearch = document.getElementById('heroSearch');
const jobCards = document.querySelectorAll('.job-card');
const faqItems = document.querySelectorAll('.faq-item');
const testimonialItems = document.querySelectorAll('.testimonial');
const prevButton = document.querySelector('.carousel-btn.prev');
const nextButton = document.querySelector('.carousel-btn.next');
const contactForm = document.getElementById('contactForm');
const newsletterForm = document.getElementById('newsletterForm');

let testimonialIndex = 0;
let testimonialTimer;

window.addEventListener('load', () => {
  setTimeout(() => loader.classList.add('is-hidden'), 600);
});

const applyTheme = (theme) => {
  document.body.setAttribute('data-theme', theme);
  themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  localStorage.setItem('vertex-theme', theme);
};

const storedTheme = localStorage.getItem('vertex-theme');
if (storedTheme) {
  applyTheme(storedTheme);
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  applyTheme('dark');
} else {
  applyTheme('light');
}

themeToggle.addEventListener('click', () => {
  const theme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(theme);
});

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const counter = entry.target;
    const target = Number(counter.getAttribute('data-target'));
    let current = 0;
    const duration = 1400;
    const start = performance.now();

    const tick = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      current = Math.floor(progress * target);
      counter.textContent = current.toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    counterObserver.unobserve(counter);
  });
}, { threshold: 0.6 });

document.querySelectorAll('.counter').forEach((counter) => counterObserver.observe(counter));

const filterJobs = (term) => {
  const normalized = term.toLowerCase().trim();
  jobCards.forEach((card) => {
    const searchable = [
      card.dataset.title,
      card.dataset.company,
      card.dataset.location,
      card.dataset.category,
      card.dataset.type,
    ].join(' ').toLowerCase();
    card.classList.toggle('is-hidden', !searchable.includes(normalized));
  });
};

jobSearchInput.addEventListener('input', (event) => filterJobs(event.target.value));

heroSearch.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = document.getElementById('jobTitle').value.trim().toLowerCase();
  const location = document.getElementById('jobLocation').value.trim().toLowerCase();
  const category = document.getElementById('jobCategory').value.trim().toLowerCase();
  const combined = `${title} ${location} ${category}`;
  filterJobs(combined);
});

const showTestimonial = (index) => {
  testimonialItems.forEach((item, idx) => item.classList.toggle('active', idx === index));
};

const rotateTestimonials = () => {
  testimonialIndex = (testimonialIndex + 1) % testimonialItems.length;
  showTestimonial(testimonialIndex);
};

const resetTimer = () => {
  clearInterval(testimonialTimer);
  testimonialTimer = setInterval(rotateTestimonials, 5000);
};

prevButton.addEventListener('click', () => {
  testimonialIndex = (testimonialIndex - 1 + testimonialItems.length) % testimonialItems.length;
  showTestimonial(testimonialIndex);
  resetTimer();
});

nextButton.addEventListener('click', () => {
  testimonialIndex = (testimonialIndex + 1) % testimonialItems.length;
  showTestimonial(testimonialIndex);
  resetTimer();
});

showTestimonial(0);
resetTimer();

faqItems.forEach((item) => {
  item.querySelector('.faq-question').addEventListener('click', () => {
    const isOpen = item.classList.contains('active');
    faqItems.forEach((faq) => faq.classList.remove('active'));
    if (!isOpen) item.classList.add('active');
  });
});

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const formMessage = document.querySelector('.form-message');

  if (!name || !email || !message) {
    formMessage.textContent = 'Please fill out all fields.';
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    formMessage.textContent = 'Please enter a valid email.';
    return;
  }

  formMessage.textContent = 'Thanks! We will contact you shortly.';
  contactForm.reset();
});

newsletterForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.getElementById('newsletterEmail').value.trim();
  const message = document.querySelector('.newsletter-message');
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    message.textContent = 'Please enter a valid email address.';
    return;
  }

  message.textContent = 'You are subscribed to premium job alerts.';
  newsletterForm.reset();
});

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('show', window.scrollY > 400);
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
