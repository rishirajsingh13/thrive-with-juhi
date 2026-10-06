/* ========================================
   THRIVE WITH JUHI PARMAR
   Thank You Page – Interactivity
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ──────────────────────────────────────
  // 1. Scroll Animations (IntersectionObserver)
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
  // 2. Parse payment info from URL params
  //    (Razorpay redirect adds these)
  // ──────────────────────────────────────
  const urlParams = new URLSearchParams(window.location.search);
  const paymentId = urlParams.get('razorpay_payment_id');

  // If a payment ID is present, we could display it or log it.
  // For now, the confirmation text is static. Extend this
  // when backend verification is in place.
  if (paymentId) {
    console.log('Payment confirmed:', paymentId);
  }

});
