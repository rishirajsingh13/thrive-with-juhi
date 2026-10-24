// Zero-dependency build script for Vercel and local environments
// Injects environment variables into landing pages and thank-you page

const fs = require('fs');
const path = require('path');

function loadDotEnv(filePath) {
  const env = {};
  if (!fs.existsSync(filePath)) return env;

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const match = trimmed.match(/^([\w.-]+)\s*=\s*(.*)$/);
    if (match) {
      let key = match[1];
      let val = match[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      env[key] = val;
    }
  }
  return env;
}

function getVal(env, keys, defaultVal = '') {
  for (const k of keys) {
    if (env[k] !== undefined && String(env[k]).trim() !== '') {
      return String(env[k]).trim();
    }
  }
  return defaultVal;
}

function parsePrice(val, defaultVal) {
  const str = (val !== undefined && val !== null && String(val).trim() !== '') ? String(val).trim() : defaultVal;
  const digitsOnly = str.replace(/[^0-9]/g, '');
  return {
    raw: digitsOnly || str,
    formatted: digitsOnly ? `₹${digitsOnly}` : str
  };
}

function parseDateRange(rawDate) {
  if (!rawDate || typeof rawDate !== 'string') return {};
  const rangeRegex = /(\d{1,2})(?:st|nd|rd|th)?\s*[-–—to]+\s*(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+)(?:\s+(\d{4}))?/i;
  const match = rawDate.trim().match(rangeRegex);

  if (match) {
    const d1 = parseInt(match[1], 10);
    const d2 = parseInt(match[2], 10);
    const mStr = match[3];
    const yr = match[4] ? parseInt(match[4], 10) : new Date().getFullYear();

    // Auto-calculate registration close date as 1 day before start date
    const closeDay = d1 > 1 ? d1 - 1 : 1;

    return {
      day1_date: `${d1} ${mStr}`,
      day2_date: `${d2} ${mStr}`,
      close_date: `${closeDay} ${mStr}`,
      year: yr
    };
  }

  return {
    day1_date: rawDate,
    day2_date: rawDate,
    close_date: rawDate,
    year: new Date().getFullYear()
  };
}

function runBuild() {
  const rootDir = __dirname;

  // 1. Load from .env and .env.local
  const envFile = path.join(rootDir, '.env');
  const envLocalFile = path.join(rootDir, '.env.local');

  const fileEnv = Object.assign({}, loadDotEnv(envFile), loadDotEnv(envLocalFile));

  // Merge process.env on top so Vercel Dashboard env vars take precedence
  const env = Object.assign({}, fileEnv, process.env);

  // 2. Extract and sanitize variables
  const hasProcEnvDate = Boolean(process.env.EVENT_DATE || process.env.WEBINAR_DATE || process.env.DATE);
  const event_date = getVal(env, ['EVENT_DATE', 'WEBINAR_DATE', 'DATE'], '22–23 Oct');
  const dateParts = parseDateRange(event_date);

  const day1_date = (hasProcEnvDate && !process.env.EVENT_DAY1_DATE && !process.env.EVENT_DAY1)
    ? dateParts.day1_date
    : getVal(env, ['EVENT_DAY1_DATE', 'EVENT_DAY1', 'DAY1_DATE'], dateParts.day1_date || '22 Oct');

  const day2_date = (hasProcEnvDate && !process.env.EVENT_DAY2_DATE && !process.env.EVENT_DAY2)
    ? dateParts.day2_date
    : getVal(env, ['EVENT_DAY2_DATE', 'EVENT_DAY2', 'DAY2_DATE'], dateParts.day2_date || '23 Oct');

  const registration_closes_date = (hasProcEnvDate && !process.env.REGISTRATION_CLOSES_DATE && !process.env.EVENT_CLOSE_DATE)
    ? dateParts.close_date
    : getVal(env, ['REGISTRATION_CLOSES_DATE', 'EVENT_CLOSE_DATE', 'CLOSE_DATE'], dateParts.close_date || '21 Oct');

  const timezone = getVal(env, ['EVENT_TIMEZONE', 'TIMEZONE'], 'IST');
  const day1_time = getVal(env, ['EVENT_DAY1_TIME', 'DAY1_TIME'], '10:00 AM – 11:00 AM');
  const day2_time = getVal(env, ['EVENT_DAY2_TIME', 'DAY2_TIME'], '10:00 AM – 11:30 AM');
  const event_time = getVal(env, ['EVENT_TIME', 'WEBINAR_TIME', 'TIME'], 'Day 1: 10–11 AM · Day 2: 10–11:30 AM IST');

  const priceVal = getVal(env, ['EVENT_PRICE', 'PRICE', 'WEBINAR_PRICE'], '99');
  const originalPriceVal = getVal(env, ['EVENT_ORIGINAL_PRICE', 'ORIGINAL_PRICE', 'REGULAR_PRICE'], '999');

  const priceObj = parsePrice(priceVal, '99');
  const origPriceObj = parsePrice(originalPriceVal, '999');

  // Compute discount
  let defaultDiscount = '90% OFF';
  const pNum = parseInt(priceObj.raw, 10);
  const oNum = parseInt(origPriceObj.raw, 10);
  if (!isNaN(pNum) && !isNaN(oNum) && oNum > pNum) {
    const pct = Math.round(((oNum - pNum) / oNum) * 100);
    defaultDiscount = `${pct}% OFF`;
  }
  const hasProcEnvDiscount = Boolean(process.env.EVENT_DISCOUNT || process.env.DISCOUNT);
  const savings_badge = hasProcEnvDiscount ? process.env.EVENT_DISCOUNT || process.env.DISCOUNT : (env.EVENT_DISCOUNT || env.DISCOUNT || defaultDiscount);

  // WhatsApp group link for thank you page
  const whatsapp_link = getVal(env, ['WHATSAPP_LINK', 'WHATSAPP_GROUP_URL', 'EVENT_WHATSAPP_URL'], 'https://chat.whatsapp.com/DbON8aN8LckGfnUa5a6YAL?mode=gi_t');

  // Payment link overrides (optional)
  const payment_url = getVal(env, ['EVENT_PAYMENT_URL', 'PAYMENT_URL'], '');
  const organic_payment_url = getVal(env, ['EVENT_ORGANIC_PAYMENT_URL', 'ORGANIC_PAYMENT_URL'], '');

  // 3. Config map for injection
  const config = {
    event_date,
    webinar_date: event_date,
    day1_date,
    day2_date,
    registration_closes_date,
    registration_closes_text: `Registration closes ${registration_closes_date}`,
    timezone,
    day1_time,
    day2_time,
    event_time,
    webinar_time: event_time,
    day1_pill: `Day 1 Focus · ${day1_time} ${timezone}`,
    day2_pill: `Day 2 Focus · ${day2_time} ${timezone}`,
    event_date_badge: `📅 ${event_date}`,
    event_time_badge: `⏰ ${event_time}`,
    offer_urgency_badge: `⚡ Limited Live Seats · Registration Closes ${registration_closes_date}`,
    offer_price_note: `Registration closes ${registration_closes_date} · No prior experience needed`,
    sticky_urgency: `⚡ Closes ${registration_closes_date} · Limited Seats`,
    price_raw: priceObj.raw,
    price_formatted: priceObj.formatted,
    original_price_raw: origPriceObj.raw,
    original_price_formatted: origPriceObj.formatted,
    savings_badge,
    whatsapp_link
  };

  // 4. Update Landing Pages
  const landingPages = [
    'return-to-yourself-fb2/index.html',
    'index.html',
    'index-v2.html',
    'return-to-yourself-fb/index.html',
    'return-to-yourself-organic/index.html',
    'v2/index.html',
    'index-trimmed.html'
  ];

  landingPages.forEach(relPath => {
    const fullPath = path.join(rootDir, relPath);
    if (!fs.existsSync(fullPath)) return;

    let html = fs.readFileSync(fullPath, 'utf-8');

    // 4a. Replace elements with data-lp or data-webinar
    html = html.replace(/(<[^>]*\b(?:data-lp|data-webinar)=["']([^"']+)["'][^>]*>)([\s\S]*?)(<\/[^>]+>)/gi, (match, openTag, key, oldContent, closeTag) => {
      if (config[key] !== undefined) {
        return `${openTag}${config[key]}${closeTag}`;
      }
      return match;
    });

    // 4b. Pattern-based fallbacks for any un-annotated sections
    // Price tags
    html = html.replace(/(<span\s+class="btn-strike"[^>]*>)[^<]*(<\/span>)/gi, `$1${config.original_price_formatted}$2`);
    html = html.replace(/(<span\s+class="btn__current-price"[^>]*>)[^<]*(<\/span>)/gi, `$1${config.price_formatted}$2`);
    html = html.replace(/(<span\s+class="offer-v2__strike-price"[^>]*>)[^<]*(<\/span>)/gi, `$1${config.original_price_formatted}$2`);
    html = html.replace(/(<span\s+class="offer-v2__price"[^>]*>)[^<]*(<\/span>)/gi, `$1${config.price_formatted}$2`);
    html = html.replace(/(<span\s+class="offer-v2__savings-badge"[^>]*>)[^<]*(<\/span>)/gi, `$1${config.savings_badge}$2`);
    html = html.replace(/(<span\s+class="sticky-bottom-bar-v2__strike"[^>]*>)[^<]*(<\/span>)/gi, `$1${config.original_price_formatted}$2`);
    html = html.replace(/(<span\s+class="sticky-bottom-bar-v2__price"[^>]*>)[^<]*(<\/span>)/gi, `$1${config.price_formatted}$2`);
    html = html.replace(/(<span\s+class="sticky-bottom-bar-v2__badge"[^>]*>)[^<]*(<\/span>)/gi, `$1${config.savings_badge}$2`);
    html = html.replace(/(<span\s+class="price-strike"[^>]*>)[^<]*(<\/span>)/gi, `$1${config.original_price_formatted}$2`);
    html = html.replace(/(<span\s+class="offer__strike-price"[^>]*>)[^<]*(<\/span>)/gi, `$1${config.original_price_formatted}$2`);
    html = html.replace(/(<p\s+class="offer__price"[^>]*>)[^<]*(<\/p>)/gi, `$1${config.price_formatted}$2`);
    html = html.replace(/(<p\s+class="offer__price-note"[^>]*>)[^<]*(<\/p>)/gi, `$1${config.offer_price_note}$2`);

    // Top ribbon / urgency lines
    html = html.replace(/⚡\s*Limited Live Seats\s*·\s*Registration Closes\s*[^<\n]*/gi, `⚡ Limited Live Seats · Registration Closes ${config.registration_closes_date}`);
    html = html.replace(/⚡\s*Closes\s*[^<·\n]*·\s*Limited Seats/gi, `⚡ Closes ${config.registration_closes_date} · Limited Seats`);
    html = html.replace(/Registration closes\s+\d{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+/gi, `Registration closes ${config.registration_closes_date}`);

    // Schedule cards Day 1 and Day 2 dates
    html = html.replace(/(<span\s+class="hero(?:-v2)?__day-tag">Day 1<\/span>\s*<span\s+class="hero(?:-v2)?__day-date"[^>]*>)[^<]*(<\/span>)/gi, `$1${config.day1_date}$2`);
    html = html.replace(/(<span\s+class="hero(?:-v2)?__day-tag[^>]*>Day 2<\/span>\s*<span\s+class="hero(?:-v2)?__day-date"[^>]*>)[^<]*(<\/span>)/gi, `$1${config.day2_date}$2`);

    // Curriculum pills
    html = html.replace(/(<span\s+class="curriculum-v2__header-pill"[^>]*>)\s*Day 1 Focus[^<]*(<\/span>)/gi, `$1${config.day1_pill}$2`);
    html = html.replace(/(<span\s+class="curriculum-v2__header-pill"[^>]*>)\s*Day 2 Focus[^<]*(<\/span>)/gi, `$1${config.day2_pill}$2`);

    // Meta row dates and times (📅 ... and ⏰ ...)
    html = html.replace(/(<span[^>]*>)\s*📅[^<]*(<\/span>)/gi, `$1📅 ${config.event_date}$2`);
    html = html.replace(/(<span[^>]*>)\s*⏰[^<]*(<\/span>)/gi, `$1⏰ ${config.event_time}$2`);

    // Final CTA & sticky top bar text in v1 pages
    html = html.replace(/(<p\s+class="final-cta__meta[^"]*"[^>]*>)[^<]*(<\/p>)/gi, `$1${config.event_date} · ${config.event_time} · Live on Zoom$2`);

    // 4c. If payment URL override specified, update payment links
    const targetPaymentUrl = relPath.includes('organic') ? (organic_payment_url || payment_url) : payment_url;
    if (targetPaymentUrl) {
      html = html.replace(/(<a\s+[^>]*\bhref=["'])https:\/\/rzp\.io\/rzp\/[a-zA-Z0-9]+(["'][^>]*>)/gi, `$1${targetPaymentUrl}$2`);
    }

    fs.writeFileSync(fullPath, html, 'utf-8');
  });

  // 5. Update Thank You Page
  const thankYouPath = path.join(rootDir, 'thank-you/index.html');
  if (fs.existsSync(thankYouPath)) {
    let tyHtml = fs.readFileSync(thankYouPath, 'utf-8');

    // Update WhatsApp button link (attribute-order agnostic)
    tyHtml = tyHtml.replace(/<a\b([^>]*?)>/gi, (fullTag, attrs) => {
      if (attrs.includes('id="whatsapp-cta"') || attrs.includes("id='whatsapp-cta'") || attrs.includes('data-whatsapp-link')) {
        return `<a${attrs.replace(/\bhref=["'][^"']*["']/i, `href="${whatsapp_link}"`)}>`;
      }
      return fullTag;
    });

    // Ensure config.js is loaded if not already present
    if (!tyHtml.includes('/config.js')) {
      tyHtml = tyHtml.replace('</head>', '  <script src="/config.js"></script>\n</head>');
    }

    fs.writeFileSync(thankYouPath, tyHtml, 'utf-8');
  }

  // 6. Write global config.js for runtime client-side access
  const configContent = `// Auto-generated configuration by build.js — Do not edit directly\nwindow.__APP_CONFIG__ = ${JSON.stringify(config, null, 2)};\n`;
  fs.writeFileSync(path.join(rootDir, 'config.js'), configContent, 'utf-8');

  // Also ensure thank-you subfolder has a copy in case of relative imports
  const tyConfigPath = path.join(rootDir, 'thank-you/config.js');
  fs.writeFileSync(tyConfigPath, configContent, 'utf-8');

  console.log('✓ Successfully injected environment variables:');
  console.log(`  Date Range:           ${config.event_date}`);
  console.log(`  Day 1 Date:           ${config.day1_date}`);
  console.log(`  Day 2 Date:           ${config.day2_date}`);
  console.log(`  Registration Closes:  ${config.registration_closes_date}`);
  console.log(`  Day 1 Time:           ${config.day1_time} ${config.timezone}`);
  console.log(`  Day 2 Time:           ${config.day2_time} ${config.timezone}`);
  console.log(`  Price:                ${config.price_formatted} (Was ${config.original_price_formatted})`);
  console.log(`  Discount:             ${config.savings_badge}`);
  console.log(`  WhatsApp Button:      ${config.whatsapp_link}`);
}

runBuild();
