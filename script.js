/* ========================================
   THRIVE WITH JUHI PARMAR
   Landing Page Interactivity
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ──────────────────────────────────────
  // 1. Sticky Top Bar & Mobile Bottom Bar
  // ──────────────────────────────────────
  const stickyTopBar = document.getElementById('sticky-top-bar');
  const stickyBottomBar = document.getElementById('sticky-bottom-bar');
  const heroSection = document.getElementById('hero');
  const offerSection = document.getElementById('offer');

  let heroScrolledPast = false;
  let offerInView = false;

  const refreshStickyBars = () => {
    if (stickyTopBar) {
      stickyTopBar.classList.toggle('visible', heroScrolledPast);
    }
    if (stickyBottomBar) {
      // Show mobile bottom bar only when past hero AND not actively looking at the offer card
      stickyBottomBar.classList.toggle('visible', heroScrolledPast && !offerInView);
    }
  };

  if (heroSection) {
    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        heroScrolledPast = !entry.isIntersecting;
        refreshStickyBars();
      },
      { threshold: 0, rootMargin: '-60px 0px 0px 0px' }
    );
    heroObserver.observe(heroSection);
  }

  if (offerSection) {
    const offerObserver = new IntersectionObserver(
      ([entry]) => {
        offerInView = entry.isIntersecting;
        refreshStickyBars();
      },
      { threshold: 0.1 }
    );
    offerObserver.observe(offerSection);
  }

  // ──────────────────────────────────────
  // 2. FAQ Accordion
  // ──────────────────────────────────────
  const faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');
    const answerInner = item.querySelector('.faq__answer-inner');

    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other FAQ items
      faqItems.forEach(other => {
        if (other !== item && other.classList.contains('active')) {
          other.classList.remove('active');
          const otherAnswer = other.querySelector('.faq__answer');
          if (otherAnswer) otherAnswer.style.maxHeight = '0';
          other.querySelector('.faq__question')?.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      item.classList.toggle('active');
      if (!isActive) {
        answer.style.maxHeight = answerInner.scrollHeight + 'px';
        question.setAttribute('aria-expanded', 'true');
      } else {
        answer.style.maxHeight = '0';
        question.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // ──────────────────────────────────────
  // 3. Curriculum Accordion
  // ──────────────────────────────────────
  const curriculumItems = document.querySelectorAll('.curriculum__item');

  curriculumItems.forEach(item => {
    const header = item.querySelector('.curriculum__item-header');
    const body = item.querySelector('.curriculum__item-body');
    const bodyInner = item.querySelector('.curriculum__item-body-inner');

    if (!header || !body) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other curriculum items
      curriculumItems.forEach(other => {
        if (other !== item && other.classList.contains('active')) {
          other.classList.remove('active');
          const otherBody = other.querySelector('.curriculum__item-body');
          if (otherBody) otherBody.style.maxHeight = '0';
          other.querySelector('.curriculum__item-header')?.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      item.classList.toggle('active');
      if (!isActive) {
        body.style.maxHeight = bodyInner.scrollHeight + 'px';
        header.setAttribute('aria-expanded', 'true');
      } else {
        body.style.maxHeight = '0';
        header.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // ──────────────────────────────────────
  // 4. Scroll Animations (IntersectionObserver)
  // ──────────────────────────────────────
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if (animatedElements.length > 0) {
    const animObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            animObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    animatedElements.forEach(el => animObserver.observe(el));
  }

  // ──────────────────────────────────────
  // 5. Smooth Scroll for Anchor Links
  // ──────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = stickyTopBar ? stickyTopBar.offsetHeight + 20 : 20;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ──────────────────────────────────────
  // 6. Keyboard Accessibility for Accordions
  // ──────────────────────────────────────
  const allAccordionTriggers = document.querySelectorAll('.faq__question, .curriculum__item-header');

  allAccordionTriggers.forEach(trigger => {
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger.click();
      }
    });
  });

});
