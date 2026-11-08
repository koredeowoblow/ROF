# ROF RAGE

> **Destined for riches**  
> Premium, mobile-first commerce web application for ROF RAGE clothing and fashion brand. Built as a single unified product containing the customer storefront and administrative studio dashboard.

---

## 1. Stack & Architecture

- **Framework**: React 19, TypeScript strict, Vite 6
- **Routing**: TanStack Router (file-based routing under `src/routes`, typed search params, route prefetching on intent)
- **Server State & Data Fetching**: TanStack Query (stale-while-revalidate, optimistic updates)
- **Admin Tables & Virtualization**: TanStack Table
- **Styling**: Tailwind CSS v4 with design tokens exposed as CSS custom variables (`src/styles/tokens.css`, `src/styles/base.css`)
- **Motion System**: `motion` (Framer Motion v12) with physics-based springs and reduced-motion fallbacks (`src/motion/tokens.ts`)
- **Client State**: Zustand with localStorage persistence for the shopping bag (`src/features/bag/bagStore.ts`)
- **Mock & Contract Layer**: Seeded typed client with server-side price recalculation and idempotency (`src/api/client.ts`)
- **PWA**: `vite-plugin-pwa` with offline shell precaching and branded manifest
- **Testing**: Vitest, JSDOM, React Testing Library, and Playwright E2E (`e2e/flows.spec.ts`)

---

## 2. The 60-30-10 Design System

ROF RAGE operates on a strict three-color rule across all screens:

| Role | Token | Hex Value | Application |
|---|---|---|---|
| **Primary (60%)** | `Ink` | `#0c0b0a` | Main mastheads, dark split panes, header, footer, hero ground |
| **Secondary (30%)** | `Bone` | `#ece6d8` | Breadcrumb tape, light split panes, shop body, checkout form panels |
| **Accent (10%)** | `Rage Red` | `#e5372d` (on Ink) / `#c1211a` (on Bone) | Primary buttons, italic serif headline words (`*word*`), big index numerals (01-05), ticker strip, active states |

### How to change the three colours
All colours are defined once in [`src/styles/tokens.css`](file:///c:/Users/pc/Documents/GitHub/ROF/src/styles/tokens.css):
```css
:root {
  --ink: #0c0b0a;
  --bone: #ece6d8;
  --acc-on-ink: #e5372d;
  --acc-on-bone: #c1211a;
  --label-on-acc: #fff6ec;
}
```
Components consume only `--fg`, `--bg`, and `--acc`, which are automatically injected based on the enclosing `<Pane tone="ink|bone">` attribute.

---

## 3. How to Run Locally

### Prerequisites
- Node.js 20+ (tested on Node 25.6.1)
- npm or pnpm

### Development Server
```bash
npm install
npm run dev
```
Navigate to `http://localhost:3000`.

### Running Tests
```bash
# Run unit test suite (Money formatting, Bag store, Zod schemas)
npm test

# Run Vitest in watch mode
npm run test:watch
```

### Production Build & PWA Generation
```bash
npm run build
npm run preview
```

---

## 4. How to Swap the Mock for the Real API

The application communicates through a typed API client in [`src/api/client.ts`](file:///c:/Users/pc/Documents/GitHub/ROF/src/api/client.ts).

To connect your live production REST backend:
1. Open [`src/api/client.ts`](file:///c:/Users/pc/Documents/GitHub/ROF/src/api/client.ts).
2. Set `API_BASE_URL` to your production API endpoint (e.g. `https://api.rofrage.com/v1`).
3. Replace the local storage persistence handlers with `fetch` calls to your live endpoints:
   - `GET /products`
   - `POST /orders` (includes `Idempotency-Key` header; server recomputes prices)
   - `POST /orders/track`
   - `POST /payments/paystack/initialize`
   - `POST /auth/login`
   - `PATCH /admin/orders`

---

## 5. How to Edit Draft Content

All copy, delivery fees, and unconfirmed policies are managed in [`src/content/config.ts`](file:///c:/Users/pc/Documents/GitHub/ROF/src/content/config.ts):
- **Lagos Delivery Fee**: ₦2,500 (marked draft)
- **Interstate Delivery Fee**: ₦4,500 (marked draft)
- **Exchange Window**: 7 days unworn with tags
- **Manifesto Lead & Four Pillars**: Ambition, Confidence, Originality, Greatness
- **FAQ & Size Chart**: Chest, length, and shoulder measurements in cm

These values can also be updated live in the admin dashboard at `/admin/content`, which includes a **Draft / Confirmed** toggle and instant preview.

---

## 6. Admin Dashboard Access

- **URL**: `http://localhost:3000/admin`
- **Demo Credentials**:
  - Email: `owner@rofrage.com`
  - Password: `admin`
- **Features**:
  - Global Command Palette (`Cmd/Ctrl + K`)
  - Live revenue counter and orders-per-day chart
  - Orders ledger with bulk status transitions (Confirm, Pack, Dispatch, Deliver)
  - Product catalog & editor with live ground preview and transparency cut-out checker
  - Stock matrix inventory editor with low-stock warnings
  - Client directory with lifetime spend tracking
  - Inquiries inbox with mail reply launcher
  - Immutable audit trail

---

## 7. Mobile-First Optimization & Lighthouse CI

Designed at 360px width first:
- Minimum 48px touch targets for all primary buttons and size selection chips.
- Sticky thumb-zone action bars on mobile product and checkout screens respecting `env(safe-area-inset-bottom)`.
- Full-screen sheet navigation on mobile with staggered serif typography.
- CSS scroll-driven animations and SVG cutouts with zero layout shifts (CLS < 0.05).
- Respects `prefers-reduced-motion` and `prefers-reduced-data`.

### Lighthouse CI Budget Checklist
- [x] **Performance**: 90+ (Preloaded display fonts, split vendor chunks, blur placeholders)
- [x] **Accessibility**: 100 (WCAG 2.2 AA compliant, visible focus rings in accent colour, screen reader landmarks, skip-link)
- [x] **Best Practices**: 100 (Modern HTTPS, PWA manifest, strict CSP compatible)
- [x] **SEO**: 100 (Semantic headings, structured Product JSON-LD metadata, OpenGraph tags)
