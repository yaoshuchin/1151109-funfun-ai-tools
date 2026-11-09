(function () {
  const SITE_PASS = 'nato';
  const AUTH_KEY = 'funfun_ai_auth_nato';

  function isAuthed() {
    try {
      return localStorage.getItem(AUTH_KEY) === 'true';
    } catch (e) {
      return false;
    }
  }

  // Pre-hide immediately if already authenticated to prevent flicker
  if (isAuthed()) {
    const style = document.createElement('style');
    style.id = 'gate-prehide-style';
    style.textContent = '#passwordGate { display: none !important; }';
    (document.head || document.documentElement).appendChild(style);
  }

  function handleVerify(e) {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    const input = document.getElementById('passwordGate_input');
    const val = (input ? input.value : '').trim().toLowerCase();
    const errorMsg = document.getElementById('passwordGate_error');
    const card = document.getElementById('passwordGate_content');

    if (val === SITE_PASS) {
      try {
        localStorage.setItem(AUTH_KEY, 'true');
      } catch (err) {}
      if (errorMsg) errorMsg.style.display = 'none';
      const gate = document.getElementById('passwordGate');
      if (gate) {
        gate.classList.add('gate-hidden');
        setTimeout(() => {
          gate.style.display = 'none';
        }, 300);
      }
    } else {
      if (errorMsg) errorMsg.style.display = 'block';
      if (card) {
        card.classList.remove('gate-shake');
        void card.offsetWidth;
        card.classList.add('gate-shake');
      }
      if (input) {
        input.value = '';
        input.focus();
      }
    }
  }

  function handleToggleVisibility() {
    const input = document.getElementById('passwordGate_input');
    const btn = document.getElementById('passwordGate_toggle');
    if (!input) return;
    if (input.type === 'password') {
      input.type = 'text';
      if (btn) btn.textContent = '🙈';
    } else {
      input.type = 'password';
      if (btn) btn.textContent = '👁️';
    }
  }

  function handleLockSystem() {
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch (e) {}
    location.reload();
  }

  function initGateEvents() {
    const gate = document.getElementById('passwordGate');
    if (!gate) return;

    if (isAuthed()) {
      gate.classList.add('gate-hidden');
      gate.style.display = 'none';
    } else {
      gate.classList.remove('gate-hidden');
      gate.style.display = 'flex';
      const input = document.getElementById('passwordGate_input');
      if (input) {
        setTimeout(() => input.focus(), 150);
      }
    }

    const form = document.getElementById('passwordGate_form');
    if (form) {
      form.addEventListener('submit', handleVerify);
    }

    const toggleBtn = document.getElementById('passwordGate_toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', handleToggleVisibility);
    }

    const lockBtn = document.getElementById('lock-btn');
    if (lockBtn) {
      lockBtn.addEventListener('click', handleLockSystem);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGateEvents);
  } else {
    initGateEvents();
  }

  // Expose global helper methods
  window.verifySitePassword = handleVerify;
  window.toggleSitePasswordVisibility = handleToggleVisibility;
  window.lockSiteSystem = handleLockSystem;
})();
