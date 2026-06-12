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

  const uploadInput    = document.getElementById('upload-input');
  const startArea      = document.getElementById('camera-start-area');

  const statusDot      = document.getElementById('status-dot');
  const statusText     = document.getElementById('status-text');
  const ocrOutput      = document.getElementById('ocr-output');

  const btnSearchGoogle = document.getElementById('btn-search-google');
  const btnCopyText     = document.getElementById('btn-copy-text');
  const btnTranslate    = document.getElementById('btn-translate');
  const btnSaveNote     = document.getElementById('btn-save-note');
  const btnAnalyzeAI    = document.getElementById('btn-analyze-ai');

  const historyList    = document.getElementById('history-list');
  const historyEmpty   = document.getElementById('history-empty');
  const btnClearHist   = document.getElementById('btn-clear-history');

  const aiChatPanel     = document.getElementById('ai-chat-panel');
  const aiChatMessages  = document.getElementById('ai-chat-messages');
  const aiFinalResponse = document.getElementById('ai-final-response');
  const btnCloseAIChat  = document.getElementById('btn-close-ai-chat');
  const btnSaveAIHistory = document.getElementById('btn-save-ai-history');
  const aiDrawerBackdrop = document.getElementById('ai-drawer-backdrop');
  const aiDrawerDot = document.getElementById('ai-drawer-dot');
  const aiDrawerStatusText = document.getElementById('ai-drawer-status-text');

  // ── State ─────────────────────────────────────────────
  let detectedText   = '';
  let currentImageSrc = '';
  let currentAnalysis = null;
  let analysisRunning = false;
  let ocrRunning = false;
  let analysisRunId = 0;
  const HISTORY_KEY  = 'seekvision_history';
  const DEFAULT_IMAGE = '../assets/imgs/default-photo.jpg';

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

  function setAnalyzeEnabled(enabled, label, loading = false) {
    if (!btnAnalyzeAI) return;
    btnAnalyzeAI.disabled = !enabled;
    btnAnalyzeAI.classList.toggle('loading', loading);
    btnAnalyzeAI.setAttribute('aria-busy', loading ? 'true' : 'false');
    const text = label || (analysisRunning ? 'Analisando...' : 'Analisar com IA');
    const span = btnAnalyzeAI.querySelector('span');
    if (span) span.textContent = text;
    else btnAnalyzeAI.textContent = text;
  }

  function setAIStatus(state, text) {
    if (aiDrawerDot) aiDrawerDot.className = 'status-dot ' + state;
    if (aiDrawerStatusText) aiDrawerStatusText.textContent = text;
  }

  // ── Display image and trigger OCR ────────────────────
  function displayImage(src) {
    currentImageSrc = src;
    capturedImg.src = src;
    capturedWrap.classList.add('show');
    placeholder.style.display = 'none';
    if (startArea) startArea.style.display = 'flex';
    resetAIChat();
    runOCR(src);
  }

  // ── Tesseract worker (lazy, reused across images) ─────
  let ocrWorker = null;
  let ocrRunToken = 0;

  async function getOCRWorker() {
    if (ocrWorker) return ocrWorker;
    if (typeof Tesseract === 'undefined') {
      throw new Error('Tesseract.js não foi carregado.');
    }
    // 'por+eng' lets it read both Portuguese and English text.
    ocrWorker = await Tesseract.createWorker('por+eng', 1, {
      logger: m => {
        if (m.status === 'recognizing text') {
          const pct = Math.round((m.progress || 0) * 100);
          setStatus('scanning', `Reconhecendo texto... ${pct}%`);
        } else if (m.status === 'loading language traineddata') {
          setStatus('scanning', 'Carregando modelo de OCR...');
        }
      },
    });
    return ocrWorker;
  }

  // ── Real OCR with Tesseract.js ────────────────────────
  async function runOCR(src) {
    const token = ++ocrRunToken;        // guards against stale results
    ocrRunning = true;
    setStatus('scanning', 'Analisando texto...');
    ocrOutput.textContent = '';
    ocrOutput.className   = 'ocr-text-display scanning';
    scanLine.classList.add('active');
    setActionsEnabled(false);
    setAnalyzeEnabled(false, 'Aguardando OCR...', true);
    detectionBox.classList.remove('show');
    if (btnSaveNote) btnSaveNote.querySelector('span').textContent = 'Salvar no histórico';

    try {
      const worker = await getOCRWorker();
      const { data } = await worker.recognize(src);

      // A newer image was loaded while this one was scanning — drop it.
      if (token !== ocrRunToken) return;

      const text = (data.text || '').trim();
      scanLine.classList.remove('active');
      ocrOutput.className = 'ocr-text-display';

      if (!text) {
        ocrOutput.textContent = '';
        detectedText = '';
        ocrRunning = false;
        setStatus('error', 'Nenhum texto detectado');
        setActionsEnabled(false);
        setAnalyzeEnabled(!!currentImageSrc);
        showToast('Nenhum texto foi detectado na imagem.', 'error');
        return;
      }

      typewriterEffect(ocrOutput, text, 12, () => {
        if (token !== ocrRunToken) return;
        detectedText = text;
        ocrRunning = false;
        setStatus('done', 'Texto detectado');
        setActionsEnabled(true);
        setAnalyzeEnabled(true);
        showDetectionBox(data.words);
        showToast('Texto detectado com sucesso!', 'success');
      });
    } catch (err) {
      if (token !== ocrRunToken) return;
      scanLine.classList.remove('active');
      ocrOutput.className = 'ocr-text-display';
      ocrRunning = false;
      setStatus('error', 'Falha no OCR');
      setActionsEnabled(false);
      setAnalyzeEnabled(!!currentImageSrc);
      showToast('Erro ao processar a imagem: ' + err.message, 'error');
    }
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
  // Draws a box around the union of all recognized words (in % of the
  // image), falling back to a centered box if word coords aren't available.
  function showDetectionBox(words) {
    const w = capturedImg.naturalWidth;
    const h = capturedImg.naturalHeight;

    if (words && words.length && w && h) {
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      words.forEach(word => {
        const b = word.bbox;
        if (!b) return;
        x0 = Math.min(x0, b.x0);
        y0 = Math.min(y0, b.y0);
        x1 = Math.max(x1, b.x1);
        y1 = Math.max(y1, b.y1);
      });

      if (Number.isFinite(x0)) {
        detectionBox.style.left   = (x0 / w * 100) + '%';
        detectionBox.style.top    = (y0 / h * 100) + '%';
        detectionBox.style.width  = ((x1 - x0) / w * 100) + '%';
        detectionBox.style.height = ((y1 - y0) / h * 100) + '%';
        detectionBox.classList.add('show');
        return;
      }
    }

    detectionBox.style.top    = '15%';
    detectionBox.style.left   = '20%';
    detectionBox.style.width  = '60%';
    detectionBox.style.height = '45%';
    detectionBox.classList.add('show');
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

  // ── Mock AI chat flow ─────────────────────────────────
  function resetAIChat() {
    analysisRunId++;
    currentAnalysis = null;
    analysisRunning = false;
    ocrRunning = false;
    if (aiChatMessages) aiChatMessages.innerHTML = '';
    if (aiFinalResponse) {
      aiFinalResponse.innerHTML = '';
      aiFinalResponse.classList.add('hidden');
    }
    if (btnSaveAIHistory) {
      btnSaveAIHistory.classList.add('hidden');
      btnSaveAIHistory.disabled = false;
      btnSaveAIHistory.textContent = 'Salvar no histórico';
    }
    setAIStatus('ready', 'Pronto para analisar a imagem.');
    closeAIChat();
  }

  function openAIChat() {
    if (aiChatPanel) aiChatPanel.classList.remove('hidden');
    if (aiDrawerBackdrop) aiDrawerBackdrop.classList.remove('hidden');
  }

  function closeAIChat() {
    if (aiChatPanel) aiChatPanel.classList.add('hidden');
    if (aiDrawerBackdrop) aiDrawerBackdrop.classList.add('hidden');
  }

  function isAIChatOpen() {
    return aiChatPanel && !aiChatPanel.classList.contains('hidden');
  }

  function addAIMessage(text, state = 'loading') {
    if (!aiChatMessages) return null;

    const message = document.createElement('div');
    message.className = 'ai-chat-message ' + state;
    message.textContent = text;
    aiChatMessages.appendChild(message);
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
    return message;
  }

  async function runAIStage(message, task) {
    const bubble = addAIMessage(message, 'loading');
    setAIStatus('scanning', message);
    const result = await task();
    if (bubble) {
      bubble.classList.remove('loading');
      bubble.classList.add('done');
    }
    return result;
  }

  function waitMock(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function runMockAIAnalysis() {
    if (analysisRunning || ocrRunning || !currentImageSrc) return;

    if (currentAnalysis && !isAIChatOpen()) {
      openAIChat();
      return;
    }

    const mockAI = window.MockKnowledgeAI;
    if (!mockAI) {
      showToast('Serviço de IA não encontrado.', 'error');
      return;
    }

    analysisRunning = true;
    const runId = ++analysisRunId;
    currentAnalysis = null;
    openAIChat();
    if (aiChatMessages) aiChatMessages.innerHTML = '';
    if (aiFinalResponse) {
      aiFinalResponse.innerHTML = '';
      aiFinalResponse.classList.add('hidden');
    }
    if (btnSaveAIHistory) btnSaveAIHistory.classList.add('hidden');
    setAnalyzeEnabled(false, 'Analisando...', true);

    try {
      const imageAnalysis = await runAIStage('Analisando imagem...', () => mockAI.analyzeImageMock(currentImageSrc));
      if (runId !== analysisRunId) return;
      const extractedText = await runAIStage('Extraindo texto...', () => mockAI.extractTextMock(currentImageSrc));
      if (runId !== analysisRunId) return;
      const query = extractedText.text || detectedText || imageAnalysis.suggestedTitle || 'imagem analisada';
      const searchResults = await runAIStage('Pesquisando no Google...', () => mockAI.searchWebMock(query));
      if (runId !== analysisRunId) return;
      await runAIStage('Lendo resultados encontrados...', () => waitMock(850));
      if (runId !== analysisRunId) return;
      const note = await runAIStage('Gerando resumo com IA...', () => mockAI.generateNoteMock({
        image: currentImageSrc,
        extractedText,
        searchResults,
      }));
      if (runId !== analysisRunId) return;

      currentAnalysis = note;
      renderFinalAnalysis(note);
      if (btnSaveAIHistory) btnSaveAIHistory.classList.remove('hidden');
      setAIStatus('done', 'Análise concluída. Revise o resumo gerado.');
      showToast('Análise com IA concluída.', 'success');
    } catch {
      if (runId !== analysisRunId) return;
      setAIStatus('done', 'Não foi possível concluir a análise simulada.');
      addAIMessage('Não foi possível concluir a análise simulada.', 'done');
      showToast('Erro ao executar a análise com IA.', 'error');
    } finally {
      if (runId !== analysisRunId) return;
      analysisRunning = false;
      setAnalyzeEnabled(!!currentImageSrc);
    }
  }

  function renderFinalAnalysis(note) {
    if (!aiFinalResponse) return;

    aiFinalResponse.innerHTML = renderAnalysisMarkup(note);
    aiFinalResponse.classList.remove('hidden');
  }

  function renderAnalysisMarkup(note, options = {}) {
    const summary = options.shortSummary ? truncate(note.summary, 120) : note.summary;
    const points = (note.keyPoints || [])
      .map(point => `<li>${escapeHtml(point)}</li>`)
      .join('');
    const sources = (note.sources || [])
      .map(source => `
        <a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">
          ${escapeHtml(source.title)}
        </a>
      `)
      .join('');

    return `
      <h5>${escapeHtml(note.title)}</h5>
      <div class="ai-note-meta">
        <span class="ai-note-pill">${escapeHtml(note.category)}</span>
        <span class="ai-note-pill">${formatDate(note.createdAt)}</span>
      </div>
      <p>${escapeHtml(summary)}</p>
      <ul class="ai-note-list">${points}</ul>
      <div class="ai-source-list">${sources}</div>
    `;
  }

  function saveCurrentAnalysis() {
    if (!currentAnalysis || !window.MockKnowledgeAI) return;

    currentAnalysis = window.MockKnowledgeAI.saveHistoryMock(currentAnalysis);
    if (btnSaveAIHistory) {
      btnSaveAIHistory.disabled = true;
      btnSaveAIHistory.textContent = 'Salvo no histórico';
    }
    showToast('Análise salva no histórico.', 'success');
  }

  if (btnAnalyzeAI) btnAnalyzeAI.addEventListener('click', runMockAIAnalysis);
  if (btnCloseAIChat) btnCloseAIChat.addEventListener('click', closeAIChat);
  if (aiDrawerBackdrop) aiDrawerBackdrop.addEventListener('click', closeAIChat);
  if (btnSaveAIHistory) btnSaveAIHistory.addEventListener('click', saveCurrentAnalysis);

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

  // ── Init — load default image on page start ───────────
  renderHistory();
  setActionsEnabled(false);
  displayImage(DEFAULT_IMAGE);

})();
