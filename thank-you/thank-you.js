/* ========================================
   THRIVE WITH JUHI PARMAR
   Thank You Page – Interactivity
   ======================================== */

function initThankYouPage() {

  // ──────────────────────────────────────
  // 1. Scroll Animations (IntersectionObserver)
  // ──────────────────────────────────────
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if (animatedElements.length > 0) {
    if ('IntersectionObserver' in window) {
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
          threshold: 0.05,
          rootMargin: '0px 0px -20px 0px'
        }
      );

      animatedElements.forEach(el => animObserver.observe(el));
    } else {
      // Fallback for browsers without IntersectionObserver
      animatedElements.forEach(el => el.classList.add('in-view'));
    }
  }

  // ──────────────────────────────────────
  // 2. Parse payment info from URL params
  //    (Razorpay redirect adds these)
  // ──────────────────────────────────────
  const urlParams = new URLSearchParams(window.location.search);
  const paymentId = urlParams.get('razorpay_payment_id');

  if (paymentId) {
    console.log('Payment confirmed:', paymentId);
  }

  // ──────────────────────────────────────
  // 3. Dynamic WhatsApp Link
  // ──────────────────────────────────────
  const whatsappCta = document.getElementById('whatsapp-cta');
  if (whatsappCta) {
    const customWaLink = urlParams.get('wa') || 
                         urlParams.get('whatsapp') || 
                         (window.__APP_CONFIG__ && window.__APP_CONFIG__.whatsapp_link);
    if (customWaLink) {
      whatsappCta.href = customWaLink;
    }
  }

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initThankYouPage);
} else {
  initThankYouPage();
}

