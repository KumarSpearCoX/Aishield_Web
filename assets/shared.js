// ═══════════════════════════════════════════════════════════════════════
// AIShield — Shared JS (nav, reveals, cookie banner, chat widget)
// ═══════════════════════════════════════════════════════════════════════

// ── Nav scroll state ──────────────────────────────────────────────────
(function () {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const onScroll = () => {
    if (window.scrollY > 20) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ── Scroll reveal ─────────────────────────────────────────────────────
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length || !('IntersectionObserver' in window)) {
    els.forEach(e => e.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(e => io.observe(e));
})();

// ── Number counter (scroll-triggered) ─────────────────────────────────
(function () {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;
  const animate = (el) => {
    const target = parseFloat(el.dataset.counter);
    const isDecimal = el.dataset.counter.includes('.');
    const duration = 2000;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const value = eased * target;
      el.textContent = isDecimal
        ? value.toFixed(1)
        : Math.floor(value).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (!('IntersectionObserver' in window)) {
    counters.forEach(animate);
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animate(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });
  counters.forEach(c => io.observe(c));
  // Fallback — if a counter is already visible at load, animate it immediately
  setTimeout(() => {
    counters.forEach(c => {
      if (c.textContent === '0') {
        const rect = c.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) animate(c);
      }
    });
  }, 100);
})();

// ── Live "threats blocked today" ticker ──────────────────────────────
(function () {
  const el = document.getElementById('live-threat-counter');
  if (!el) return;
  let n = 12847;
  el.textContent = n.toLocaleString();
  setInterval(() => {
    n += Math.floor(Math.random() * 3) + 1;
    el.textContent = n.toLocaleString();
  }, 3500);
})();

// ── Cookie / PDPA Consent Banner ──────────────────────────────────────
(function () {
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;
  const STORAGE_KEY = 'aishield_consent_v1';
  let consent = null;
  try { consent = JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { }
  if (!consent) {
    setTimeout(() => banner.classList.add('show'), 800);
  }
  document.querySelectorAll('[data-consent]').forEach(btn => {
    btn.addEventListener('click', () => {
      const choice = btn.dataset.consent;
      const value = {
        timestamp: new Date().toISOString(),
        necessary: true,
        analytics: choice === 'all',
        marketing: choice === 'all',
      };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(value)); } catch { }
      banner.classList.remove('show');
    });
  });
  // Footer "Manage consent" link reopens banner
  document.querySelectorAll('[data-reopen-consent]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      banner.classList.add('show');
    });
  });
})();

// ── Chat widget (Claude-powered, falls back to FAQ if no API) ─────────
(function () {
  const fab = document.getElementById('chat-fab');
  const panel = document.getElementById('chat-panel');
  const closeBtn = document.getElementById('chat-close');
  const messages = document.getElementById('chat-messages');
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');
  if (!fab || !panel) return;

  // Conversation history for the API
  const history = [];

  const open = () => {
    panel.classList.add('open');
    setTimeout(() => input?.focus(), 100);
  };
  const close = () => panel.classList.remove('open');

  fab.addEventListener('click', () => {
    panel.classList.contains('open') ? close() : open();
  });
  closeBtn?.addEventListener('click', close);

  function addMsg(text, role) {
    const div = document.createElement('div');
    div.className = `chat-msg ${role}`;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  function addTyping() {
    const div = document.createElement('div');
    div.className = 'chat-msg bot';
    div.innerHTML = '<span class="chat-typing"><span></span><span></span><span></span></span>';
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  // Built-in FAQ fallback (works without API key)
  const FAQ = [
    { keys: ['price', 'cost', 'how much', 'pricing'], a: "AIShield is free forever for basic protection. Pro is $4.99/month with a 7-day free trial (no card needed). Enterprise pricing is custom — head to /contact and we'll respond within 4 hours." },
    { keys: ['trial', 'free'], a: "Yes! 7-day free trial of Pro, no credit card required. Cancel anytime. Hit 'Start free trial' at the top of the page." },
    { keys: ['voice clone', 'deepfake', 'fake call'], a: "AIShield detects AI-generated voice clones in real-time using voice biometric analysis. We catch the synthetic audio signatures that traditional caller-ID can't see." },
    { keys: ['sms', 'phishing', 'scam text'], a: "Paste any suspicious SMS into our live demo on the home page — Claude analyzes it instantly and tells you if it's a threat. Free to try." },
    { keys: ['privacy', 'data', 'pdpa', 'gdpr'], a: "We're PDPA and GDPR compliant. We never sell your data, and you can delete everything with one click. Full policy at /privacy." },
    { keys: ['ios', 'iphone', 'apple'], a: "iPhone version is in beta — sign up for early access on the home page. Android is launching first." },
    { keys: ['enterprise', 'business', 'team'], a: "Yes — we offer enterprise plans with SSO, custom policies, and dedicated support. Visit /contact and select 'Sales' to talk to us." },
    { keys: ['cancel', 'refund'], a: "Cancel anytime from your dashboard. We offer a 30-day money-back guarantee on all paid plans." },
    { keys: ['claude', 'ai', 'anthropic'], a: "Yes — AIShield is powered by Claude (Anthropic's AI). It analyzes threats, explains them in plain language, and learns from new attack patterns daily." },
  ];

  function findFaqAnswer(text) {
    const lower = text.toLowerCase();
    for (const item of FAQ) {
      if (item.keys.some(k => lower.includes(k))) return item.a;
    }
    return null;
  }

  async function askClaude(userText) {
    history.push({ role: 'user', content: userText });
    const typing = addTyping();
    try {
      const res = await fetch('/api/anthropic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 600,
          system: `You are AIShield's friendly support assistant. AIShield is a mobile app that defends against AI-generated cyber threats — voice clones, deepfake calls, AI-personalized phishing, and LLM-powered scams. It's powered by Anthropic's Claude. Pricing: Free forever (basic), Pro $4.99/month (7-day free trial, no card), Enterprise (custom — contact sales). PDPA + GDPR compliant. Be concise (2-3 sentences max), warm, and helpful. Steer toward starting a free trial when relevant. If asked something off-topic, politely redirect to AIShield-related help.`,
          messages: history,
        }),
      });
      const data = await res.json();
      typing.remove();
      const text = data.content?.[0]?.text || "Hmm, I'm having trouble right now. Try /contact for direct help.";
      addMsg(text, 'bot');
      history.push({ role: 'assistant', content: text });
    } catch (err) {
      typing.remove();
      const fallback = findFaqAnswer(userText)
        || "I'm having connection issues. For immediate help, head to /contact or email support@aishield.com.";
      addMsg(fallback, 'bot');
    }
  }

  function send() {
    const text = input.value.trim();
    if (!text) return;
    addMsg(text, 'user');
    input.value = '';
    askClaude(text);
  }

  sendBtn?.addEventListener('click', send);
  input?.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); send(); }
  });
})();

// ── Hero cursor spotlight ─────────────────────────────────────────────
(function () {
  const hero = document.querySelector('[data-spotlight]');
  if (!hero) return;
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    hero.style.setProperty('--mx', `${x}%`);
    hero.style.setProperty('--my', `${y}%`);
  });
})();

// ── Pricing toggle (annual/monthly) ───────────────────────────────────
(function () {
  const toggle = document.getElementById('billing-toggle');
  if (!toggle) return;
  toggle.addEventListener('change', () => {
    const annual = toggle.checked;
    document.querySelectorAll('[data-price-monthly]').forEach(el => {
      el.style.display = annual ? 'none' : '';
    });
    document.querySelectorAll('[data-price-annual]').forEach(el => {
      el.style.display = annual ? '' : 'none';
    });
  });
})();
