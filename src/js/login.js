/* ============================================================
   LOGIN.JS — Tab switching, form validation, password strength
   ============================================================ */

(function () {

  // ── Tab switching ─────────────────────────────────────
  const tabLogin    = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const formLogin   = document.getElementById('form-login');
  const formReg     = document.getElementById('form-register');

  function showLogin() {
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    tabLogin.setAttribute('aria-selected', 'true');
    tabRegister.setAttribute('aria-selected', 'false');
    formLogin.classList.remove('hidden');
    formReg.classList.add('hidden');
  }

  function showRegister() {
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');
    tabRegister.setAttribute('aria-selected', 'true');
    tabLogin.setAttribute('aria-selected', 'false');
    formReg.classList.remove('hidden');
    formLogin.classList.add('hidden');
  }

  tabLogin.addEventListener('click', showLogin);
  tabRegister.addEventListener('click', showRegister);
  document.getElementById('goto-register').addEventListener('click', showRegister);
  document.getElementById('goto-login').addEventListener('click', showLogin);

  // ── Helpers ───────────────────────────────────────────
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function showError(id, visible) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('show', visible);
  }

  function setInputState(input, valid) {
    input.classList.toggle('error', !valid);
    input.classList.toggle('success', valid);
  }

  function clearState(input, errorId) {
    input.classList.remove('error', 'success');
    showError(errorId, false);
  }

  // ── Password visibility toggles ───────────────────────
  function setupToggle(btnId, inputId) {
    const btn   = document.getElementById(btnId);
    const input = document.getElementById(inputId);
    if (!btn || !input) return;
    btn.addEventListener('click', () => {
      const isHidden = input.type === 'password';
      input.type = isHidden ? 'text' : 'password';
      btn.textContent = isHidden ? '🙈' : '👁';
      btn.setAttribute('aria-label', isHidden ? 'Ocultar senha' : 'Mostrar senha');
    });
  }

  setupToggle('toggle-login-pw', 'login-password');
  setupToggle('toggle-reg-pw',   'reg-password');

  // ── Password strength meter ───────────────────────────
  const regPw        = document.getElementById('reg-password');
  const strengthLabel = document.getElementById('strength-label');
  const bars = [
    document.getElementById('bar-1'),
    document.getElementById('bar-2'),
    document.getElementById('bar-3'),
  ];

  function getStrength(pw) {
    if (pw.length < 6) return 0;
    let score = 1;
    if (pw.length >= 8) score++;
    if (/[0-9]/.test(pw) && /[^a-zA-Z0-9]/.test(pw)) score++;
    return score;
  }

  regPw.addEventListener('input', () => {
    const val      = regPw.value;
    const strength = getStrength(val);
    const labels   = ['', 'Fraca', 'Média', 'Forte'];
    const classes  = ['', 'weak', 'medium', 'strong'];

    bars.forEach((bar, i) => {
      bar.className = 'strength-bar';
      if (i < strength) bar.classList.add(classes[strength]);
    });

    strengthLabel.textContent = val.length ? labels[strength] : '';
  });

  // ── Real-time blur validation ─────────────────────────
  function onBlurValidate(inputId, errorId, checkFn) {
    const input = document.getElementById(inputId);
    input.addEventListener('blur', function () {
      if (!this.value) { clearState(this, errorId); return; }
      const ok = checkFn(this.value);
      setInputState(this, ok);
      showError(errorId, !ok);
    });
    input.addEventListener('input', function () {
      if (this.classList.contains('error') || this.classList.contains('success')) {
        const ok = checkFn(this.value);
        setInputState(this, ok);
        showError(errorId, !ok);
      }
    });
  }

  onBlurValidate('login-email',    'login-email-error',    v => emailRegex.test(v.trim()));
  onBlurValidate('login-password', 'login-password-error', v => v.length >= 6);
  onBlurValidate('reg-name',       'reg-name-error',       v => v.trim().length >= 2);
  onBlurValidate('reg-email',      'reg-email-error',      v => emailRegex.test(v.trim()));
  onBlurValidate('reg-password',   'reg-password-error',   v => v.length >= 6);

  // Confirm password validates against password field in real time
  document.getElementById('reg-confirm').addEventListener('input', function () {
    const pw = document.getElementById('reg-password').value;
    if (!this.value) { clearState(this, 'reg-confirm-error'); return; }
    const ok = this.value === pw && this.value.length > 0;
    setInputState(this, ok);
    showError('reg-confirm-error', !ok);
  });

  // ── Login form submit ─────────────────────────────────
  formLogin.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('login-email');
    const pw    = document.getElementById('login-password');
    let valid   = true;

    const emailOk = emailRegex.test(email.value.trim());
    setInputState(email, emailOk);
    showError('login-email-error', !emailOk);
    if (!emailOk) valid = false;

    const pwOk = pw.value.length >= 6;
    setInputState(pw, pwOk);
    showError('login-password-error', !pwOk);
    if (!pwOk) valid = false;

    if (!valid) return;

    localStorage.setItem('seekvision_user', JSON.stringify({
      email: email.value.trim(),
    }));
    showToast('Login realizado com sucesso!', 'success');
    setTimeout(() => { window.location.href = '../../index.html'; }, 1500);
  });

  // ── Register form submit ──────────────────────────────
  formReg.addEventListener('submit', function (e) {
    e.preventDefault();
    const name    = document.getElementById('reg-name');
    const email   = document.getElementById('reg-email');
    const pw      = document.getElementById('reg-password');
    const confirm = document.getElementById('reg-confirm');
    let valid     = true;

    const nameOk = name.value.trim().length >= 2;
    setInputState(name, nameOk);
    showError('reg-name-error', !nameOk);
    if (!nameOk) valid = false;

    const emailOk = emailRegex.test(email.value.trim());
    setInputState(email, emailOk);
    showError('reg-email-error', !emailOk);
    if (!emailOk) valid = false;

    const pwOk = pw.value.length >= 6;
    setInputState(pw, pwOk);
    showError('reg-password-error', !pwOk);
    if (!pwOk) valid = false;

    const confirmOk = confirm.value === pw.value && confirm.value.length > 0;
    setInputState(confirm, confirmOk);
    showError('reg-confirm-error', !confirmOk);
    if (!confirmOk) valid = false;

    if (!valid) return;

    localStorage.setItem('seekvision_user', JSON.stringify({
      name:  name.value.trim(),
      email: email.value.trim(),
    }));
    showToast('Conta criada com sucesso!', 'success');
    setTimeout(() => { window.location.href = '../../index.html'; }, 1500);
  });

})();
