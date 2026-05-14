/* ============================================================
   CAMERA.JS — OCR scanner: image display, simulated text
               detection, actions, and history management
   ============================================================ */

(function () {

  // ── DOM references ────────────────────────────────────
  const capturedWrap   = document.getElementById('captured-wrap');
  const capturedImg    = document.getElementById('captured-img');
  const detectionBox   = document.getElementById('detection-box');
  const placeholder    = document.getElementById('camera-placeholder');
  const scanLine       = document.getElementById('scan-line');

  const btnReset       = document.getElementById('btn-reset');
  const uploadInput    = document.getElementById('upload-input');
  const startArea      = document.getElementById('camera-start-area');

  const statusDot      = document.getElementById('status-dot');
  const statusText     = document.getElementById('status-text');
  const ocrOutput      = document.getElementById('ocr-output');

  const btnSearchGoogle = document.getElementById('btn-search-google');
  const btnCopyText     = document.getElementById('btn-copy-text');
  const btnTranslate    = document.getElementById('btn-translate');
  const btnSaveNote     = document.getElementById('btn-save-note');

  const historyList    = document.getElementById('history-list');
  const historyEmpty   = document.getElementById('history-empty');
  const btnClearHist   = document.getElementById('btn-clear-history');

  // ── State ─────────────────────────────────────────────
  let detectedText   = '';
  const HISTORY_KEY  = 'seekvision_history';
  const DEFAULT_IMAGE = 'images/default-photo.jpg';
  const DEFAULT_TEXT  = 'The Photography Storytelling Workshop';

  // ── Status helpers ────────────────────────────────────
  function setStatus(state, text) {
    statusDot.className = 'status-dot ' + state;
    statusText.textContent = text;
  }

  // ── Enable/disable action buttons ────────────────────
  function setActionsEnabled(enabled) {
    [btnSearchGoogle, btnCopyText, btnTranslate, btnSaveNote].forEach(btn => {
      btn.disabled = !enabled;
    });
  }

  // ── Display image and trigger OCR ────────────────────
  function displayImage(src) {
    capturedImg.src = src;
    capturedWrap.classList.add('show');
    placeholder.style.display = 'none';
    if (startArea) startArea.style.display = 'none';
    if (btnReset) btnReset.classList.remove('hidden');
    runOCRSimulation();
  }

  // ── OCR Simulation ────────────────────────────────────
  function runOCRSimulation() {
    setStatus('scanning', 'Analisando texto...');
    ocrOutput.textContent = '';
    ocrOutput.className   = 'ocr-text-display scanning';
    scanLine.classList.add('active');
    setActionsEnabled(false);
    detectionBox.classList.remove('show');

    const scanDuration = 1600 + Math.random() * 800;

    setTimeout(() => {
      scanLine.classList.remove('active');
      ocrOutput.className = 'ocr-text-display';

      typewriterEffect(ocrOutput, DEFAULT_TEXT, 22, () => {
        detectedText = DEFAULT_TEXT;
        setStatus('done', 'Texto detectado');
        setActionsEnabled(true);
        showDetectionBox();
        showToast('Texto detectado com sucesso!', 'success');
      });
    }, scanDuration);
  }

  // ── Typewriter effect ─────────────────────────────────
  function typewriterEffect(el, text, speed, callback) {
    el.textContent = '';
    let i = 0;
    const interval = setInterval(() => {
      el.textContent += text[i];
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        if (callback) callback();
      }
    }, speed);
  }

  // ── Show detection box overlay ────────────────────────
  function showDetectionBox() {
    detectionBox.style.top    = '15%';
    detectionBox.style.left   = '20%';
    detectionBox.style.width  = '60%';
    detectionBox.style.height = '45%';
    detectionBox.classList.add('show');
  }

  // ── Reset to upload state ─────────────────────────────
  function resetScanner() {
    capturedWrap.classList.remove('show');
    detectionBox.classList.remove('show');
    placeholder.style.display = 'flex';
    ocrOutput.textContent = '';
    ocrOutput.className = 'ocr-text-display empty';
    detectedText = '';
    setActionsEnabled(false);
    setStatus('ready', 'Aguardando captura...');
    if (btnReset) btnReset.classList.add('hidden');
    if (startArea) startArea.style.display = 'flex';
    if (uploadInput) uploadInput.value = '';
  }

  // ── Action: Search Google ─────────────────────────────
  btnSearchGoogle.addEventListener('click', () => {
    if (!detectedText) return;
    const query = encodeURIComponent(detectedText.trim());
    window.open('https://www.google.com/search?q=' + query, '_blank', 'noopener,noreferrer');
    showToast('Abrindo Google com o texto detectado...', 'info');
  });

  // ── Action: Copy Text ─────────────────────────────────
  btnCopyText.addEventListener('click', () => {
    if (!detectedText) return;

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(detectedText)
        .then(() => showToast('Texto copiado!', 'success'))
        .catch(() => fallbackCopy(detectedText));
    } else {
      fallbackCopy(detectedText);
    }
  });

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast('Texto copiado!', 'success');
    } catch {
      showToast('Não foi possível copiar. Selecione e copie manualmente.', 'error');
    }
    document.body.removeChild(ta);
  }

  // ── Action: Translate ─────────────────────────────────
  btnTranslate.addEventListener('click', () => {
    if (!detectedText) return;
    const query = encodeURIComponent(detectedText.slice(0, 500));
    window.open('https://translate.google.com/?text=' + query + '&op=translate', '_blank', 'noopener,noreferrer');
    showToast('Abrindo Google Tradutor...', 'info');
  });

  // ── Action: Save to History ───────────────────────────
  btnSaveNote.addEventListener('click', () => {
    if (!detectedText) return;
    saveToHistory(detectedText);
    showToast('Salvo no histórico!', 'success');
    btnSaveNote.disabled = true;
    btnSaveNote.querySelector('span').textContent = 'Ja salvo';
  });

  // ── History management ─────────────────────────────────
  function getHistory() {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); }
    catch { return []; }
  }

  function saveToHistory(text) {
    const history = getHistory();
    history.unshift({
      id:      Date.now(),
      text:    text,
      preview: text.split('\n')[0].trim(),
      savedAt: new Date().toISOString(),
    });
    if (history.length > 30) history.pop();
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    renderHistory();
  }

  function renderHistory() {
    const history = getHistory();
    historyList.innerHTML = '';

    if (!history.length) {
      historyList.appendChild(historyEmpty);
      historyEmpty.style.display = 'block';
      return;
    }

    historyEmpty.style.display = 'none';

    history.forEach(entry => {
      const item = document.createElement('div');
      item.className = 'history-item';
      item.setAttribute('role', 'listitem');
      item.setAttribute('tabindex', '0');
      item.setAttribute('title', 'Clique para restaurar este texto');

      item.innerHTML = `
        <div class="history-item-text">
          <p class="history-item-preview">${escapeHtml(truncate(entry.preview, 55))}</p>
          <p class="history-item-date">${formatDate(entry.savedAt)}</p>
        </div>
      `;

      item.addEventListener('click', () => {
        detectedText = entry.text;
        ocrOutput.textContent = entry.text;
        ocrOutput.className = 'ocr-text-display';
        setActionsEnabled(true);
        btnSaveNote.disabled = false;
        btnSaveNote.querySelector('span').textContent = 'Salvar no histórico';
        setStatus('done', 'Texto restaurado');
        showToast('Texto do histórico restaurado.', 'info');
      });

      item.addEventListener('keydown', e => { if (e.key === 'Enter') item.click(); });
      historyList.appendChild(item);
    });
  }

  // ── Clear history ─────────────────────────────────────
  btnClearHist.addEventListener('click', () => { openModal('confirm-modal'); });

  const confirmOk     = document.getElementById('confirm-ok');
  const confirmCancel = document.getElementById('confirm-cancel');

  if (confirmOk) {
    confirmOk.addEventListener('click', () => {
      localStorage.removeItem(HISTORY_KEY);
      renderHistory();
      closeModal('confirm-modal');
      showToast('Histórico limpo.', 'info');
    });
  }
  if (confirmCancel) {
    confirmCancel.addEventListener('click', () => closeModal('confirm-modal'));
  }

  // ── File upload handling ──────────────────────────────
  function handleFileUpload(file) {
    if (!file || !file.type.startsWith('image/')) {
      showToast('Por favor, selecione um arquivo de imagem válido.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = e => displayImage(e.target.result);
    reader.onerror = () => showToast('Erro ao ler o arquivo.', 'error');
    reader.readAsDataURL(file);
  }

  if (uploadInput) {
    uploadInput.addEventListener('change', e => {
      if (e.target.files[0]) handleFileUpload(e.target.files[0]);
    });
  }

  // Drag & drop on viewfinder
  const viewfinder = document.getElementById('viewfinder');
  if (viewfinder) {
    viewfinder.addEventListener('dragover', e => {
      e.preventDefault();
      viewfinder.style.borderColor = 'var(--accent)';
    });
    viewfinder.addEventListener('dragleave', () => {
      viewfinder.style.borderColor = '';
    });
    viewfinder.addEventListener('drop', e => {
      e.preventDefault();
      viewfinder.style.borderColor = '';
      const file = e.dataTransfer.files[0];
      if (file) handleFileUpload(file);
    });
  }

  if (btnReset) btnReset.addEventListener('click', resetScanner);

  // ── Init — load default image on page start ───────────
  renderHistory();
  setActionsEnabled(false);
  displayImage(DEFAULT_IMAGE);

})();
