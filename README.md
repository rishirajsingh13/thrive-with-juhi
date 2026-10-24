# Thrive with Juhi Parmar

> **From Emotional Survival to Conscious Creation**  
> A 2-Day LIVE Experience to understand what's really been keeping you stuck, experience a live guided emotional release, and discover the inner shift that allows you to stop merely surviving your life - and start consciously creating it.

## Overview
High-converting, responsive editorial landing page designed according to the **Thrive Brand Bible**:
- **Typography**: Cormorant Garamond (editorial serif) & DM Sans (clean body sans)
- **Palette**: Warm Cream (`#FFF7EC`), Soft Sand (`#F5EDE3`), Deep Espresso (`#514434`), Muted Warm Ochre (`#BC9164`), Sage Green (`#6E8560`), Dusty Rose (`#C48B7F`)
- **Key Features**:
  - Live interactive FAQ and Curriculum accordions
  - Side-by-side contrast comparison table (Dusty Rose vs Sage Green)
  - Mobile floating quick-action CTA dock with safe-area support
  - High-performance web-optimized photography of Juhi Parmar

---

## Environment Variables & Automated Build

You can change the workshop date, timings, prices, and the Thank You page WhatsApp group button link directly without editing HTML files.

### Available Variables

| Variable | Description | Example |
| :--- | :--- | :--- |
| `EVENT_DATE` | Workshop date range (auto-computes Day 1 & Day 2 dates and closing date) | `22–23 Oct` |
| `EVENT_DAY1_DATE` | *(Optional)* Override for Day 1 date | `22 Oct` |
| `EVENT_DAY2_DATE` | *(Optional)* Override for Day 2 date | `23 Oct` |
| `REGISTRATION_CLOSES_DATE` | *(Optional)* Override for registration closes date (defaults to 1 day before Day 1) | `21 Oct` |
| `EVENT_TIME` | Overall session timings summary | `Day 1: 10–11 AM · Day 2: 10–11:30 AM IST` |
| `EVENT_DAY1_TIME` | Day 1 session timing | `10:00 AM – 11:00 AM` |
| `EVENT_DAY2_TIME` | Day 2 session timing | `10:00 AM – 11:30 AM` |
| `EVENT_TIMEZONE` | Timezone abbreviation | `IST` |
| `EVENT_PRICE` | Offer / workshop ticket price in INR | `99` or `₹99` |
| `EVENT_ORIGINAL_PRICE` | Original strike-through price in INR | `999` or `₹999` |
| `EVENT_DISCOUNT` | *(Optional)* Override for discount pill (auto-calculated if omitted) | `90% OFF` |
| `WHATSAPP_LINK` | WhatsApp Group Invite link for the Thank You page button | `https://chat.whatsapp.com/...` |
| `EVENT_PAYMENT_URL` | *(Optional)* Override for Razorpay checkout link | `https://rzp.io/rzp/...` |

---

## Setting Variables on Vercel

1. Open your project on the **[Vercel Dashboard](https://vercel.com)** (`thrive-with-juhi`).
2. Navigate to **Settings** → **Environment Variables**.
3. Add or update any of the variables above (e.g. `EVENT_DATE`, `EVENT_PRICE`, `WHATSAPP_LINK`, etc.).
4. Trigger a **Redeploy** (or push a commit) — Vercel will automatically execute `node build.js` and deploy the updated pages.

---

## Local Development

1. Copy or edit `.env`:
   ```bash
   cp .env.example .env
   ```
2. Build the static pages with your configuration:
   ```bash
   npm run build
   ```
3. Serve static files locally:
   ```bash
   python3 -m http.server 8088
   ```
4. Visit `http://localhost:8088`.
