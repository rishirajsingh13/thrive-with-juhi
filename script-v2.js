/* ==========================================================================
   THRIVE WITH JUHI PARMAR - VERSION 2 INTERACTIVITY
   Mobile-first CRO upgrades: Countdown timer, progressive disclosure,
   strikethrough animations, and pre-expanded accordions.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ─────────────────────────────────────────────────────────────
  // 1. DYNAMIC COUNTDOWN TIMER (Urgency & Conversions)
  // ─────────────────────────────────────────────────────────────
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  // Sticky dock countdown tag (compact)
  const stickyUrgencyEl = document.getElementById('sticky-urgency-timer');

  // Target deadline: Set to October 21, 2026, 23:59:59 IST or dynamically 2 days 14 hours ahead for continuous preview
  const getTargetDate = () => {
    // Current date reference
    const now = new Date();
    // Default cohort registration close: 21 Oct 2026
    let target = new Date('2026-10-21T23:59:59+05:30');
    // If target has passed or is far, create a realistic 3-day countdown
    if (now >= target) {
      target = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000));
    }
    return target;
  };

  const targetDate = getTargetDate();

  const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    if (distance <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minsEl) minsEl.textContent = '00';
      if (secsEl) secsEl.textContent = '00';
      if (stickyUrgencyEl) stickyUrgencyEl.textContent = 'Registration closing soon';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const pad = (n) => String(n).padStart(2, '0');

    if (daysEl) daysEl.textContent = pad(days);
    if (hoursEl) hoursEl.textContent = pad(hours);
    if (minsEl) minsEl.textContent = pad(minutes);
    if (secsEl) secsEl.textContent = pad(seconds);

    if (stickyUrgencyEl) {
      stickyUrgencyEl.textContent = `Closes in ${days}d ${hours}h · ₹499`;
    }
  };

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ─────────────────────────────────────────────────────────────
  // 2. PAIN POINTS: SHOW 5 / SHOW ALL 10 PROGRESSIVE DISCLOSURE
  // ─────────────────────────────────────────────────────────────
  const togglePainPointsBtn = document.getElementById('toggle-pain-points');
  const painPointsMore = document.getElementById('pain-points-more');

  if (togglePainPointsBtn && painPointsMore) {
    togglePainPointsBtn.addEventListener('click', () => {
      const isExpanded = painPointsMore.classList.contains('is-expanded');
      if (isExpanded) {
        painPointsMore.classList.remove('is-expanded');
        togglePainPointsBtn.innerHTML = 'View All 10 Quiet Struggles <span class="arrow">↓</span>';
        togglePainPointsBtn.setAttribute('aria-expanded', 'false');
      } else {
        painPointsMore.classList.add('is-expanded');
        togglePainPointsBtn.innerHTML = 'Show Fewer <span class="arrow">↑</span>';
        togglePainPointsBtn.setAttribute('aria-expanded', 'true');
      }
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 3. STRIKETHROUGH SCROLL REVEAL ("You've Tried...")
  // ─────────────────────────────────────────────────────────────
  const struckItems = document.querySelectorAll('.tried-list-v2__item');
  if (struckItems.length > 0) {
    const strikeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, idx) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('is-struck');
            }, idx * 120);
            strikeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    struckItems.forEach((el) => strikeObserver.observe(el));
  }

  // ─────────────────────────────────────────────────────────────
  // 4. ACCORDIONS: FAQ (Pre-expand FAQ #1)
  // ─────────────────────────────────────────────────────────────
  const faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach((item, index) => {
    const question = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');
    const answerInner = item.querySelector('.faq__answer-inner');

    if (!question || !answer || !answerInner) return;

    // Pre-expand first FAQ item to resolve top objections immediately
    if (index === 0) {
      item.classList.add('active');
      answer.style.maxHeight = answerInner.scrollHeight + 'px';
      question.setAttribute('aria-expanded', 'true');
    }

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other FAQs
      faqItems.forEach((other) => {
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

  // ─────────────────────────────────────────────────────────────
  // 5. ACCORDIONS: CURRICULUM (Pre-expand Day 1 Item 1)
  // ─────────────────────────────────────────────────────────────
  const curriculumItems = document.querySelectorAll('.curriculum__item');

  curriculumItems.forEach((item, index) => {
    const header = item.querySelector('.curriculum__item-header');
    const body = item.querySelector('.curriculum__item-body');
    const bodyInner = item.querySelector('.curriculum__item-body-inner');

    if (!header || !body || !bodyInner) return;

    // Pre-expand the very first lesson so users see real curriculum immediately
    if (index === 0) {
      item.classList.add('active');
      body.style.maxHeight = bodyInner.scrollHeight + 'px';
      header.setAttribute('aria-expanded', 'true');
    }

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close sibling items within the same day container
      const dayContainer = item.closest('.curriculum__day');
      if (dayContainer) {
        dayContainer.querySelectorAll('.curriculum__item').forEach((other) => {
          if (other !== item && other.classList.contains('active')) {
            other.classList.remove('active');
            const otherBody = other.querySelector('.curriculum__item-body');
            if (otherBody) otherBody.style.maxHeight = '0';
            other.querySelector('.curriculum__item-header')?.setAttribute('aria-expanded', 'false');
          }
        });
      }

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

  // ─────────────────────────────────────────────────────────────
  // 6. STICKY TOP BAR & MOBILE BOTTOM BAR OBSERVERS
  // ─────────────────────────────────────────────────────────────
  const stickyTopBar = document.getElementById('sticky-top-bar');
  const stickyBottomBar = document.getElementById('sticky-bottom-bar-v2');
  const heroSection = document.getElementById('hero');

  // Bottom sticky CTA is ALWAYS present on mobile from first fold per user instruction
  if (stickyBottomBar) {
    stickyBottomBar.classList.add('visible');
  }

  let heroPast = false;
  const updateBars = () => {
    if (stickyTopBar) {
      stickyTopBar.classList.toggle('visible', heroPast);
    }
  };

  if (heroSection) {
    const heroObs = new IntersectionObserver(
      ([entry]) => {
        heroPast = !entry.isIntersecting;
        updateBars();
      },
      { threshold: 0, rootMargin: '-60px 0px 0px 0px' }
    );
    heroObs.observe(heroSection);
  }

  // ─────────────────────────────────────────────────────────────
  // 7. SNAPPY SCROLL REVEALS
  // ─────────────────────────────────────────────────────────────
  const animEls = document.querySelectorAll('.animate-on-scroll');
  if (animEls.length > 0) {
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -20px 0px'
      }
    );

    animEls.forEach((el) => revealObs.observe(el));
  }

  // ─────────────────────────────────────────────────────────────
  // 8. ACCESSIBILITY KEYBOARD TRIGGERS
  // ─────────────────────────────────────────────────────────────
  document.querySelectorAll('.faq__question, .curriculum__item-header').forEach((btn) => {
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 9. SMOOTH SCROLLING FOR INTERNAL LINKS
  // ─────────────────────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = (stickyTopBar && window.innerWidth > 768) ? stickyTopBar.offsetHeight + 16 : 16;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});
