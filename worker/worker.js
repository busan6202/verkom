// Cloudflare Worker: Backend Logging & Admin Config untuk SIKS Fasdik
const ADMIN_EMAIL = 'busan6202@gmail.com';
const ADMIN_PASS = '568248';
const AUTH_SECRET = 'siks-fasdik-admin-token-2026';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
  });
}

function verifyAdminToken(request) {
  const auth = request.headers.get('Authorization') || '';
  if (!auth.startsWith('Bearer ')) return false;
  const token = auth.slice(7).trim();
  const expected = btoa(`${ADMIN_EMAIL}:${ADMIN_PASS}:${AUTH_SECRET}`);
  return token === expected;
}

function getLandingPageHtml() {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SIKS Fasdik Pindah Alamat! 🚀 &middot; fasdikform.pages.dev</title>
  <meta name="description" content="Form Verifikasi Komitmen Pendidikan (Fasdik) PKH Kementerian Sosial RI kini telah berpindah ke alamat baru: fasdikform.pages.dev" />
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%230f172a'/%3E%3Cpath d='M16 14h22l12 12v24a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4V18a4 4 0 0 1 4-4z' fill='%231e293b' stroke='%2338bdf8' stroke-width='2.5'/%3E%3Ccircle cx='42' cy='42' r='10' fill='%2306b6d4'/%3E%3Cpath d='M38 42l3 3 6-6' stroke='%23fff' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E" />
  <style>
    :root {
      --bg: #090d16;
      --card-bg: rgba(17, 24, 39, 0.75);
      --card-border: rgba(56, 189, 248, 0.2);
      --primary: #0284c7;
      --primary-glow: #38bdf8;
      --accent: #f97316;
      --neon-green: #10b981;
      --text: #f8fafc;
      --text-muted: #94a3b8;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif; }
    
    body {
      background: radial-gradient(circle at 50% 10%, #1e1b4b 0%, #0f172a 50%, #090d16 100%);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px 16px;
      position: relative;
      overflow-x: hidden;
    }

    /* Background glow orbs */
    .glow-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      z-index: 0;
      opacity: 0.45;
      pointer-events: none;
      animation: floatOrb 8s ease-in-out infinite alternate;
    }
    .orb-1 { width: 340px; height: 340px; background: #6366f1; top: -50px; left: -80px; }
    .orb-2 { width: 380px; height: 380px; background: #06b6d4; bottom: -80px; right: -80px; animation-delay: -4s; }
    .orb-3 { width: 260px; height: 260px; background: #f43f5e; top: 40%; right: 10%; opacity: 0.25; }

    @keyframes floatOrb {
      0% { transform: translateY(0) scale(1); }
      100% { transform: translateY(25px) scale(1.08); }
    }

    /* Main Container */
    .container {
      position: relative;
      z-index: 10;
      width: 100%;
      max-width: 820px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }

    /* Status Pill: SIKS Fasdik Telegram Logging API OK */
    .system-status-bar {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(16, 185, 129, 0.35);
      padding: 6px 16px;
      border-radius: 99px;
      box-shadow: 0 4px 20px rgba(16, 185, 129, 0.15);
      backdrop-filter: blur(10px);
      animation: pulseBorder 3s infinite;
    }
    .status-dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 10px #10b981, 0 0 20px #10b981;
      animation: blinkDot 1.6s infinite;
    }
    .status-text {
      font-size: 0.76rem;
      font-weight: 700;
      letter-spacing: 0.4px;
      color: #a7f3d0;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
    @keyframes blinkDot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }
    @keyframes pulseBorder {
      0%, 100% { border-color: rgba(16, 185, 129, 0.35); }
      50% { border-color: rgba(16, 185, 129, 0.7); box-shadow: 0 4px 25px rgba(16, 185, 129, 0.25); }
    }

    /* Hero Card */
    .hero-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 24px;
      padding: 36px 32px;
      width: 100%;
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(16px);
      display: grid;
      grid-template-columns: 280px 1fr;
      align-items: center;
      gap: 32px;
    }
    @media (max-width: 720px) {
      .hero-card {
        grid-template-columns: 1fr;
        padding: 28px 20px;
        gap: 24px;
        text-align: center;
      }
    }

    /* Mascot Art Section */
    .mascot-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .mascot-svg {
      width: 100%;
      max-width: 270px;
      height: auto;
      filter: drop-shadow(0 15px 25px rgba(56, 189, 248, 0.35));
      animation: floatMascot 4s ease-in-out infinite alternate;
    }
    @keyframes floatMascot {
      0% { transform: translateY(0px) rotate(0deg); }
      100% { transform: translateY(-12px) rotate(1.5deg); }
    }

    /* Content Section */
    .content-wrap {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    @media (max-width: 720px) {
      .content-wrap { align-items: center; }
    }

    .badge-migrated {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(234, 88, 12, 0.1));
      border: 1px solid rgba(249, 115, 22, 0.4);
      color: #fdba74;
      font-size: 0.72rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      padding: 4px 12px;
      border-radius: 99px;
      width: fit-content;
    }

    h1.hero-title {
      font-size: 1.85rem;
      font-weight: 900;
      line-height: 1.25;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #ffffff 30%, #38bdf8 70%, #818cf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    @media (max-width: 720px) {
      h1.hero-title { font-size: 1.55rem; }
    }

    p.hero-desc {
      font-size: 0.92rem;
      color: var(--text-muted);
      line-height: 1.6;
    }
    p.hero-desc strong {
      color: #38bdf8;
      font-weight: 700;
    }

    /* Features Grid */
    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-top: 4px;
    }
    @media (max-width: 600px) {
      .features-grid { grid-template-columns: 1fr; gap: 8px; width: 100%; }
    }
    .feat-card {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      text-align: left;
    }
    .feat-card span.icon { font-size: 1.2rem; }
    .feat-card span.title { font-size: 0.76rem; font-weight: 800; color: #f1f5f9; }
    .feat-card span.sub { font-size: 0.68rem; color: #94a3b8; }

    /* Action & Countdown */
    .action-row {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 8px;
      width: 100%;
    }

    .btn-launch {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      background: linear-gradient(135deg, #0284c7 0%, #2563eb 50%, #4f46e5 100%);
      color: #ffffff;
      padding: 14px 26px;
      border-radius: 14px;
      font-size: 1rem;
      font-weight: 800;
      text-decoration: none;
      box-shadow: 0 12px 30px -5px rgba(2, 132, 199, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.25);
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }
    .btn-launch:hover {
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 18px 35px -5px rgba(2, 132, 199, 0.65);
    }
    .btn-launch::before {
      content: '';
      position: absolute;
      top: 0; left: -100%; width: 60%; height: 100%;
      background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%);
      transform: skewX(-25deg);
      animation: btnShine 2.2s infinite;
    }
    @keyframes btnShine {
      0% { left: -100%; }
      100% { left: 220%; }
    }

    /* Auto-redirect Bar */
    .countdown-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      background: rgba(15, 23, 42, 0.55);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 8px 14px;
      font-size: 0.78rem;
      color: var(--text-muted);
    }
    .countdown-bar-wrap {
      flex: 1;
      height: 6px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 99px;
      overflow: hidden;
    }
    .countdown-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #38bdf8, #10b981);
      width: 100%;
      transform-origin: left;
      animation: shrinkBar 6s linear forwards;
    }
    @keyframes shrinkBar {
      from { transform: scaleX(1); }
      to { transform: scaleX(0); }
    }
    .btn-cancel {
      background: none;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      font-size: 0.74rem;
      font-weight: 700;
      text-decoration: underline;
      padding: 0 4px;
    }
    .btn-cancel:hover { color: #f87171; }

    /* Footer */
    footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      font-size: 0.75rem;
      color: #64748b;
      padding: 0 8px;
    }
    footer a {
      color: #38bdf8;
      text-decoration: none;
      transition: opacity 0.2s;
    }
    footer a:hover { opacity: 0.8; }
    @media (max-width: 600px) {
      footer { flex-direction: column; gap: 6px; text-align: center; }
    }
  </style>
</head>
<body>

  <!-- Glow Background Orbs -->
  <div class="glow-orb orb-1"></div>
  <div class="glow-orb orb-2"></div>
  <div class="glow-orb orb-3"></div>

  <div class="container">
    
    <!-- Top System Status Pill -->
    <div class="system-status-bar" title="Backend Cloudflare Worker SIKS Fasdik aktif">
      <div class="status-dot"></div>
      <div class="status-text">SIKS Fasdik Telegram Logging API OK &middot; SERVER ONLINE</div>
    </div>

    <!-- Main Card -->
    <div class="hero-card">
      
      <!-- Cartoon Mascot SVG Illustration (High quality vector animation) -->
      <div class="mascot-wrap">
        <svg class="mascot-svg" viewBox="0 0 320 340" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="rocketBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ffffff"/>
              <stop offset="60%" stop-color="#e0f2fe"/>
              <stop offset="100%" stop-color="#bae6fd"/>
            </linearGradient>
            <linearGradient id="glowPortal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#38bdf8"/>
              <stop offset="50%" stop-color="#818cf8"/>
              <stop offset="100%" stop-color="#c084fc"/>
            </linearGradient>
            <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#f97316"/>
              <stop offset="100%" stop-color="#ea580c"/>
            </linearGradient>
            <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#fed7aa"/>
              <stop offset="100%" stop-color="#fcd34d"/>
            </linearGradient>
            <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#0284c7" flood-opacity="0.3"/>
            </filter>
          </defs>

          <!-- Glowing Cosmic Portal Ring -->
          <circle cx="160" cy="170" r="130" stroke="url(#glowPortal)" stroke-width="4" stroke-dasharray="14 10" opacity="0.4">
            <animateTransform attributeName="transform" type="rotate" from="0 160 170" to="360 160 170" dur="20s" repeatCount="indefinite"/>
          </circle>
          <circle cx="160" cy="170" r="100" stroke="#06b6d4" stroke-width="1.5" stroke-dasharray="6 8" opacity="0.5">
            <animateTransform attributeName="transform" type="rotate" from="360 160 170" to="0 160 170" dur="14s" repeatCount="indefinite"/>
          </circle>

          <!-- Twinkling Stars -->
          <path d="M70 60 L73 70 L83 73 L73 76 L70 86 L67 76 L57 73 L67 70 Z" fill="#fde047" opacity="0.9">
            <animate attributeName="transform" type="scale" values="1;1.3;1" dur="2s" repeatCount="indefinite"/>
          </path>
          <path d="M260 80 L262 87 L269 89 L262 91 L260 98 L258 91 L251 89 L258 87 Z" fill="#38bdf8" opacity="0.8">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="2.5s" repeatCount="indefinite"/>
          </path>
          <path d="M40 210 L42 216 L48 218 L42 220 L40 226 L38 220 L32 218 L38 216 Z" fill="#a7f3d0" opacity="0.8"/>
          <path d="M270 230 L273 238 L281 240 L273 242 L270 250 L267 242 L259 240 L267 238 Z" fill="#fb923c" opacity="0.9"/>

          <!-- Rocket Launching diagonally -->
          <g transform="translate(145, 110) rotate(-35)">
            <!-- Rocket Exhaust Flame -->
            <path d="M20 70 Q10 115 25 135 Q40 115 30 70 Z" fill="#f97316">
              <animate attributeName="d" values="M20 70 Q10 115 25 135 Q40 115 30 70 Z; M20 70 Q5 125 25 150 Q45 125 30 70 Z; M20 70 Q10 115 25 135 Q40 115 30 70 Z" dur="0.4s" repeatCount="indefinite"/>
            </path>
            <path d="M22 70 Q15 100 25 115 Q35 100 28 70 Z" fill="#fde047">
              <animate attributeName="d" values="M22 70 Q15 100 25 115 Q35 100 28 70 Z; M22 70 Q12 110 25 125 Q38 110 28 70 Z; M22 70 Q15 100 25 115 Q35 100 28 70 Z" dur="0.3s" repeatCount="indefinite"/>
            </path>

            <!-- Wings -->
            <path d="M5 45 L-12 65 L5 62 Z" fill="url(#wingGrad)"/>
            <path d="M45 45 L62 65 L45 62 Z" fill="url(#wingGrad)"/>

            <!-- Rocket Hull -->
            <path d="M25 0 Q50 25 45 70 L5 70 Q0 25 25 0 Z" fill="url(#rocketBody)" filter="url(#softShadow)"/>
            
            <!-- Window with cute reflection -->
            <circle cx="25" cy="35" r="11" fill="#0284c7" stroke="#e0f2fe" stroke-width="2.5"/>
            <circle cx="25" cy="35" r="8" fill="#38bdf8"/>
            <ellipse cx="23" cy="32" rx="3" ry="2" fill="#ffffff" opacity="0.8"/>
            
            <!-- Rocket Tip Nosecone -->
            <path d="M25 0 Q38 14 36 22 L14 22 Q12 14 25 0 Z" fill="#ef4444"/>
          </g>

          <!-- Cute Young Indonesian Mascot (Chibi Hero Specialist) -->
          <g transform="translate(45, 115)">
            <!-- Mascot Body & Stylish Blue Jacket -->
            <path d="M40 130 C40 105, 100 105, 100 130 L105 170 L35 170 Z" fill="#0284c7"/>
            <path d="M55 112 L70 145 L85 112 Z" fill="#ffffff"/>
            <!-- Lanyard ID Card -->
            <path d="M64 115 L66 142 L74 142 L76 115" stroke="#f97316" stroke-width="2.5" fill="none"/>
            <rect x="63" y="142" width="14" height="18" rx="2" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
            <rect x="65" y="146" width="10" height="3" fill="#0284c7"/>
            <rect x="65" y="151" width="6" height="2" fill="#94a3b8"/>

            <!-- Cute Mascot Head -->
            <circle cx="70" cy="75" r="38" fill="url(#skinGrad)" filter="url(#softShadow)"/>
            
            <!-- Stylish Hair (Cool youthful cut) -->
            <path d="M35 68 C35 35, 105 35, 105 68 C95 50, 75 50, 68 56 C60 48, 45 52, 35 68 Z" fill="#1e293b"/>
            <path d="M48 42 Q68 28 92 46 Q75 35 55 45 Z" fill="#334155"/>

            <!-- Expressive Anime/Cartoon Eyes -->
            <!-- Left Eye -->
            <ellipse cx="56" cy="74" rx="6" ry="8" fill="#0f172a"/>
            <circle cx="54" cy="71" r="2.5" fill="#ffffff"/>
            <circle cx="58" cy="78" r="1.2" fill="#ffffff"/>
            <!-- Right Eye -->
            <ellipse cx="84" cy="74" rx="6" ry="8" fill="#0f172a"/>
            <circle cx="82" cy="71" r="2.5" fill="#ffffff"/>
            <circle cx="86" cy="78" r="1.2" fill="#ffffff"/>

            <!-- Cute Blushing Cheeks -->
            <ellipse cx="48" cy="82" rx="5" ry="3" fill="#fb7185" opacity="0.6"/>
            <ellipse cx="92" cy="82" rx="5" ry="3" fill="#fb7185" opacity="0.6"/>

            <!-- Big Bright Smile -->
            <path d="M62 84 Q70 94 78 84" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" fill="#e11d48"/>

            <!-- Left Hand Waving -->
            <g>
              <animateTransform attributeName="transform" type="rotate" values="0 36 125; 18 36 125; 0 36 125" dur="1.2s" repeatCount="indefinite"/>
              <path d="M38 125 Q20 105 18 90" stroke="#0284c7" stroke-width="12" stroke-linecap="round" fill="none"/>
              <circle cx="18" cy="88" r="8" fill="url(#skinGrad)"/>
            </g>

            <!-- Right Hand Holding Glowing Smart Tablet -->
            <path d="M98 128 Q118 125 125 135" stroke="#0284c7" stroke-width="10" stroke-linecap="round" fill="none"/>
            <rect x="115" y="118" width="28" height="38" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="2" transform="rotate(8 115 118)"/>
            <rect x="118" y="122" width="22" height="14" rx="2" fill="#0284c7" opacity="0.6" transform="rotate(8 115 118)"/>
            <!-- Mini Chart on Tablet -->
            <path d="M120 132 L125 127 L130 130 L136 124" stroke="#a7f3d0" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" transform="rotate(8 115 118)"/>
          </g>

          <!-- Cute Floating Mini Bot Companion -->
          <g transform="translate(225, 175)">
            <animateTransform attributeName="transform" type="translate" values="225 175; 225 163; 225 175" dur="2.4s" repeatCount="indefinite"/>
            <!-- Bot Antenna with glowing tip -->
            <line x1="28" y1="8" x2="28" y2="18" stroke="#38bdf8" stroke-width="2.5"/>
            <circle cx="28" cy="6" r="4" fill="#10b981">
              <animate attributeName="fill" values="#10b981;#38bdf8;#10b981" dur="1s" repeatCount="indefinite"/>
            </circle>
            <!-- Bot Body -->
            <rect x="10" y="18" width="36" height="28" rx="10" fill="#ffffff" stroke="#bae6fd" stroke-width="2" filter="url(#softShadow)"/>
            <!-- Bot Visor Screen -->
            <rect x="15" y="24" width="26" height="14" rx="5" fill="#0f172a"/>
            <!-- Bot Eyes (Glowing cyan pill eyes) -->
            <ellipse cx="22" cy="31" rx="3" ry="4" fill="#38bdf8"/>
            <ellipse cx="34" cy="31" rx="3" ry="4" fill="#38bdf8"/>
            <!-- Mini Thruster -->
            <path d="M24 46 L28 54 L32 46 Z" fill="#f97316">
              <animate attributeName="d" values="M24 46 L28 54 L32 46 Z; M24 46 L28 60 L32 46 Z; M24 46 L28 54 L32 46 Z" dur="0.25s" repeatCount="indefinite"/>
            </path>
          </g>
        </svg>
      </div>

      <!-- Text & Action Content -->
      <div class="content-wrap">
        
        <div class="badge-migrated">
          ✨ Domain Baru Telah Aktif
        </div>

        <h1 class="hero-title">
          Form Bantu Fasdik Pindah ke Rumah Baru! 🚀
        </h1>

        <p class="hero-desc">
          Layanan otomasi Form Verifikasi Komitmen Pendidikan (Fasdik) PKH Kemensos kini telah berlayar di alamat resmi: <strong>fasdikform.pages.dev</strong>. Nikmati performa secepat kilat, kalkulator kehadiran 85%, dan desain super rapi!
        </p>

        <!-- Feature highlights -->
        <div class="features-grid">
          <div class="feat-card">
            <span class="icon">⚡</span>
            <span class="title">Super Ngebut</span>
            <span class="sub">Lighthouse Score 98+ tanpa lelet</span>
          </div>
          <div class="feat-card">
            <span class="icon">🎯</span>
            <span class="title">Komitmen 85%</span>
            <span class="sub">Sesuai Permensos 8/2026</span>
          </div>
          <div class="feat-card">
            <span class="icon">📄</span>
            <span class="title">Ekspor Rapi</span>
            <span class="sub">PDF &amp; Excel berlogo otomatis</span>
          </div>
        </div>

        <!-- Launch Button & Auto-redirect -->
        <div class="action-row">
          <a href="https://fasdikform.pages.dev" class="btn-launch" id="btnLaunch">
            <span>Meluncur ke fasdikform.pages.dev</span>
            <span style="font-size: 1.2rem;">&rarr;</span>
          </a>

          <div class="countdown-box">
            <span id="countdownText">Mengalihkan otomatis dalam <strong>6</strong> detik...</span>
            <div class="countdown-bar-wrap">
              <div class="countdown-bar-fill" id="progressFill"></div>
            </div>
            <button type="button" class="btn-cancel" onclick="cancelRedirect()">Batal</button>
          </div>
        </div>

      </div>

    </div>

    <!-- Bottom Footer -->
    <footer>
      <span>&copy; 2026 <strong>Andriadi, S.Kom</strong> &middot; SIKS Fasdik Report Generator</span>
      <span>
        <a href="https://fasdikform.pages.dev/admin.html">🔐 Panel Pengelola</a>
      </span>
    </footer>

  </div>

  <script>
    let secondsLeft = 6;
    let timer = null;

    function startRedirect() {
      const textEl = document.getElementById('countdownText');
      timer = setInterval(() => {
        secondsLeft--;
        if (textEl) {
          textEl.innerHTML = 'Mengalihkan otomatis dalam <strong>' + secondsLeft + '</strong> detik...';
        }
        if (secondsLeft <= 0) {
          clearInterval(timer);
          window.location.href = 'https://fasdikform.pages.dev';
        }
      }, 1000);
    }

    function cancelRedirect() {
      if (timer) clearInterval(timer);
      const textEl = document.getElementById('countdownText');
      const barEl = document.getElementById('progressFill');
      if (textEl) textEl.innerHTML = 'Pengalihan otomatis dibatalkan.';
      if (barEl) barEl.style.animationPlayState = 'paused';
    }

    // Jalankan timer saat halaman terbuka
    window.addEventListener('DOMContentLoaded', () => {
      startRedirect();
    });
  </script>
</body>
</html>`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Tangani Preflight CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    // ==================== ENDPOINT ADMIN ====================
    // 1. Login Admin
    if (url.pathname === '/api/admin/login' && request.method === 'POST') {
      try {
        const { email, password } = await request.json();
        if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
          const token = btoa(`${ADMIN_EMAIL}:${ADMIN_PASS}:${AUTH_SECRET}`);
          return jsonResponse({ ok: true, token, email });
        }
        return jsonResponse({ ok: false, message: 'Email atau password admin salah!' }, 401);
      } catch {
        return jsonResponse({ ok: false, message: 'Format data tidak valid' }, 400);
      }
    }

    // 2. Ambil Konfigurasi Bot (Hanya Admin)
    if (url.pathname === '/api/admin/config' && request.method === 'GET') {
      if (!verifyAdminToken(request)) {
        return jsonResponse({ ok: false, message: 'Akses ditolak (Unauthorized)' }, 401);
      }
      const botToken = (await env.VERKOM_CONFIG?.get('BOT_TOKEN')) || env.BOT_TOKEN || '';
      const chatId = (await env.VERKOM_CONFIG?.get('CHAT_ID')) || env.CHAT_ID || '7234580359';
      return jsonResponse({
        ok: true,
        hasToken: !!botToken,
        botToken: botToken ? `${botToken.slice(0, 10)}...${botToken.slice(-5)}` : '',
        fullBotToken: botToken,
        chatId: chatId,
      });
    }

    // 3. Simpan Konfigurasi Bot ke KV (Permanen & Anti-Reset Git)
    if (url.pathname === '/api/admin/config' && request.method === 'POST') {
      if (!verifyAdminToken(request)) {
        return jsonResponse({ ok: false, message: 'Akses ditolak (Unauthorized)' }, 401);
      }
      try {
        const { botToken, chatId } = await request.json();
        if (!botToken || !botToken.trim()) {
          return jsonResponse({ ok: false, message: 'Bot token tidak boleh kosong!' }, 400);
        }
        const cleanToken = botToken.trim();
        const cleanChatId = (chatId || '7234580359').trim();

        if (env.VERKOM_CONFIG) {
          await env.VERKOM_CONFIG.put('BOT_TOKEN', cleanToken);
          await env.VERKOM_CONFIG.put('CHAT_ID', cleanChatId);
        }

        return jsonResponse({
          ok: true,
          message: 'Pengaturan Bot Telegram berhasil disimpan secara permanen di server Cloudflare KV!',
        });
      } catch (err) {
        return jsonResponse({ ok: false, message: 'Gagal menyimpan ke KV: ' + err.message }, 500);
      }
    }

    // 4. Tes Pengiriman Pesan (Hanya Admin)
    if (url.pathname === '/api/admin/test' && request.method === 'POST') {
      if (!verifyAdminToken(request)) {
        return jsonResponse({ ok: false, message: 'Akses ditolak (Unauthorized)' }, 401);
      }
      try {
        const body = await request.json().catch(() => ({}));
        let token = (body.botToken || '').trim();
        let chatId = (body.chatId || '').trim();

        if (!token && env.VERKOM_CONFIG) {
          token = await env.VERKOM_CONFIG.get('BOT_TOKEN');
        }
        if (!token) token = env.BOT_TOKEN || '';

        if (!chatId && env.VERKOM_CONFIG) {
          chatId = await env.VERKOM_CONFIG.get('CHAT_ID');
        }
        if (!chatId) chatId = env.CHAT_ID || '7234580359';

        if (!token) {
          return jsonResponse({ ok: false, message: 'Bot Token belum diisi!' }, 400);
        }

        const testMsg = `🔔 *Tes Koneksi Admin SIKS Fasdik*\n\n✅ Berhasil! Bot terhubung langsung dengan server Cloudflare Worker & KV.\n👤 Login Admin: ${ADMIN_EMAIL}`;
        const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: testMsg, parse_mode: 'Markdown' }),
        });

        const tgData = await tgRes.json().catch(() => ({}));
        if (tgRes.ok && tgData.ok) {
          return jsonResponse({
            ok: true,
            bot: tgData.result?.from?.username || 'Bot',
            message: 'Pesan tes berhasil diterima oleh Telegram Admin!',
          });
        }
        return jsonResponse({
          ok: false,
          message: tgData.description || 'Gagal mengirim pesan dari Telegram API',
        }, 400);
      } catch (err) {
        return jsonResponse({ ok: false, message: 'Koneksi gagal: ' + err.message }, 500);
      }
    }

    // ==================== ENDPOINT LOG PUBLIK ====================
    // Dipakai silent oleh fasdikform.pages.dev setiap kali ada user yang cetak PDF / Excel
    if (request.method === 'POST') {
      try {
        const { pesan } = await request.json();
        if (!pesan) {
          return jsonResponse({ ok: false, error: 'Pesan kosong' }, 400);
        }

        let botToken = '';
        let chatId = '';

        if (env.VERKOM_CONFIG) {
          botToken = await env.VERKOM_CONFIG.get('BOT_TOKEN');
          chatId = await env.VERKOM_CONFIG.get('CHAT_ID');
        }
        if (!botToken) botToken = env.BOT_TOKEN || '';
        if (!chatId) chatId = env.CHAT_ID || '7234580359';

        if (!botToken) {
          return jsonResponse({
            ok: false,
            error: 'Bot token belum diset oleh Admin di /admin.html',
          }, 500);
        }

        const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: pesan }),
        });

        const tgText = await tgRes.text();
        return new Response(tgText, {
          status: tgRes.status,
          headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
        });
      } catch (err) {
        return jsonResponse({ ok: false, error: 'Internal Error: ' + err.message }, 500);
      }
    }

    // ==================== TAMPILAN WEB GET / HEAD (LANDING REDIRECT KREATIF) ====================
    // Menyajikan tampilan kartun enerjik & kreatif bahwa layanan pindah ke fasdikform.pages.dev
    // sekaligus tetap menyertakan status "SIKS Fasdik Telegram Logging API OK"
    if (request.method === 'GET' || request.method === 'HEAD') {
      return new Response(getLandingPageHtml(), {
        status: 200,
        headers: {
          ...corsHeaders(),
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders() });
  },
};
