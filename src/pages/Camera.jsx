import { useCallback, useEffect, useRef, useState } from 'react';
import { useToast } from '../context/ToastContext.jsx';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import {
  analyzeImageMock,
  extractTextMock,
  searchWebMock,
  generateNoteMock,
  saveHistoryMock,
} from '../services/mockKnowledgeAI.js';
import CameraViewfinder from '../components/camera/CameraViewfinder.jsx';
import OcrResultPanel from '../components/camera/OcrResultPanel.jsx';
import ScanHistoryPanel from '../components/camera/ScanHistoryPanel.jsx';
import AiAnalysisDrawer from '../components/camera/AiAnalysisDrawer.jsx';
import TipsCard from '../components/camera/TipsCard.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import defaultPhoto from '../assets/imgs/default-photo.jpg';

const HISTORY_KEY = 'seekvision_history';
const DEFAULT_TEXT = 'The Photography Storytelling Workshop';
const TYPEWRITER_SPEED_MS = 22;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function Camera() {
  const showToast = useToast();
  const [history, setHistory] = useLocalStorage(HISTORY_KEY, []);

  const [imageSrc, setImageSrc] = useState(defaultPhoto);
  const [detectedText, setDetectedText] = useState('');
  const [ocrOutputText, setOcrOutputText] = useState('');
  const [ocrRunning, setOcrRunning] = useState(false);
  const [status, setStatus] = useState({ state: 'ready', text: 'Aguardando captura...' });
  const [detectionVisible, setDetectionVisible] = useState(false);
  const [actionsEnabled, setActionsEnabled] = useState(false);
  const [savedNote, setSavedNote] = useState(false);

  const [analysisRunning, setAnalysisRunning] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([]);
  const [aiStatus, setAiStatus] = useState({ state: 'ready', text: 'Pronto para analisar a imagem.' });
  const [aiHistorySaved, setAiHistorySaved] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);

  const scanTokenRef = useRef(0);
  const analysisTokenRef = useRef(0);
  const messageIdRef = useRef(0);

  // ── OCR simulation (Math.random for scan duration + typewriter reveal) ──
  const runOcr = useCallback(() => {
    const token = ++scanTokenRef.current;
    setOcrRunning(true);
    setStatus({ state: 'scanning', text: 'Analisando texto...' });
    setOcrOutputText('');
    setDetectionVisible(false);
    setActionsEnabled(false);
    setSavedNote(false);

    const scanDuration = 1600 + Math.random() * 800;

    setTimeout(() => {
      if (token !== scanTokenRef.current) return;

      let charIndex = 0;
      const interval = setInterval(() => {
        if (token !== scanTokenRef.current) {
          clearInterval(interval);
          return;
        }
        charIndex++;
        setOcrOutputText(DEFAULT_TEXT.slice(0, charIndex));

        if (charIndex >= DEFAULT_TEXT.length) {
          clearInterval(interval);
          setDetectedText(DEFAULT_TEXT);
          setOcrRunning(false);
          setStatus({ state: 'done', text: 'Texto detectado' });
          setActionsEnabled(true);
          setDetectionVisible(true);
          showToast('Texto detectado com sucesso!', 'success');
        }
      }, TYPEWRITER_SPEED_MS);
    }, scanDuration);
  }, [showToast]);

  const resetAiChat = useCallback(() => {
    analysisTokenRef.current++;
    setCurrentAnalysis(null);
    setAnalysisRunning(false);
    setAiMessages([]);
    setAiHistorySaved(false);
    setAiStatus({ state: 'ready', text: 'Pronto para analisar a imagem.' });
    setAiChatOpen(false);
  }, []);

  const displayImage = useCallback(
    (src) => {
      setImageSrc(src);
      resetAiChat();
      runOcr();
    },
    [resetAiChat, runOcr],
  );

  // Load the default image and trigger OCR on first render — mirrors the
  // original camera.js which called displayImage(DEFAULT_IMAGE) at init.
  useEffect(() => {
    displayImage(defaultPhoto);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleFileSelected(file) {
    if (!file || !file.type.startsWith('image/')) {
      showToast('Por favor, selecione um arquivo de imagem válido.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => displayImage(e.target.result);
    reader.onerror = () => showToast('Erro ao ler o arquivo.', 'error');
    reader.readAsDataURL(file);
  }

  function handleSearchGoogle() {
    if (!detectedText) return;
    const query = encodeURIComponent(detectedText.trim());
    window.open('https://www.google.com/search?q=' + query, '_blank', 'noopener,noreferrer');
    showToast('Abrindo Google com o texto detectado...', 'info');
  }

  function handleCopyText() {
    if (!detectedText) return;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(detectedText)
        .then(() => showToast('Texto copiado!', 'success'))
        .catch(() => fallbackCopy(detectedText));
    } else {
      fallbackCopy(detectedText);
    }
  }

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

  function handleTranslate() {
    if (!detectedText) return;
    const query = encodeURIComponent(detectedText.slice(0, 500));
    window.open('https://translate.google.com/?text=' + query + '&op=translate', '_blank', 'noopener,noreferrer');
    showToast('Abrindo Google Tradutor...', 'info');
  }

  function handleSaveNote() {
    if (!detectedText || savedNote) return;
    const entry = {
      id: Date.now(),
      text: detectedText,
      preview: detectedText.split('\n')[0].trim(),
      savedAt: new Date().toISOString(),
    };
    setHistory((current) => [entry, ...current].slice(0, 30));
    showToast('Salvo no histórico!', 'success');
    setSavedNote(true);
  }

  function handleSelectHistoryEntry(entry) {
    setDetectedText(entry.text);
    setOcrOutputText(entry.text);
    setActionsEnabled(true);
    setSavedNote(false);
    setStatus({ state: 'done', text: 'Texto restaurado' });
    showToast('Texto do histórico restaurado.', 'info');
  }

  function handleClearHistoryConfirmed() {
    setHistory([]);
    setConfirmOpen(false);
    showToast('Histórico limpo.', 'info');
  }

  // ── Mock AI chat flow ──────────────────────────────────────
  function addAiMessage(text, state) {
    const id = ++messageIdRef.current;
    setAiMessages((prev) => [...prev, { id, text, state }]);
    return id;
  }

  function markMessageDone(id) {
    setAiMessages((prev) => prev.map((m) => (m.id === id ? { ...m, state: 'done' } : m)));
  }

  async function runStage(token, message, task) {
    const id = addAiMessage(message, 'loading');
    setAiStatus({ state: 'scanning', text: message });
    const result = await task();
    if (token === analysisTokenRef.current) markMessageDone(id);
    return result;
  }

  async function handleAnalyze() {
    if (analysisRunning || ocrRunning || !imageSrc) return;

    if (currentAnalysis && !aiChatOpen) {
      setAiChatOpen(true);
      return;
    }

    const token = ++analysisTokenRef.current;
    setCurrentAnalysis(null);
    setAiChatOpen(true);
    setAiMessages([]);
    setAiHistorySaved(false);
    setAnalysisRunning(true);

    try {
      const imageAnalysis = await runStage(token, 'Analisando imagem...', () => analyzeImageMock(imageSrc));
      if (token !== analysisTokenRef.current) return;

      const extractedText = await runStage(token, 'Extraindo texto...', () => extractTextMock(imageSrc));
      if (token !== analysisTokenRef.current) return;

      const query = extractedText.text || detectedText || imageAnalysis.suggestedTitle || 'imagem analisada';
      const searchResults = await runStage(token, 'Pesquisando no Google...', () => searchWebMock(query));
      if (token !== analysisTokenRef.current) return;

      await runStage(token, 'Lendo resultados encontrados...', () => wait(850));
      if (token !== analysisTokenRef.current) return;

      const note = await runStage(token, 'Gerando resumo com IA...', () =>
        generateNoteMock({ image: imageSrc, extractedText, searchResults }),
      );
      if (token !== analysisTokenRef.current) return;

      setCurrentAnalysis(note);
      setAiStatus({ state: 'done', text: 'Análise concluída. Revise o resumo gerado.' });
      showToast('Análise com IA concluída.', 'success');
    } catch {
      if (token !== analysisTokenRef.current) return;
      setAiStatus({ state: 'done', text: 'Não foi possível concluir a análise simulada.' });
      addAiMessage('Não foi possível concluir a análise simulada.', 'done');
      showToast('Erro ao executar a análise com IA.', 'error');
    } finally {
      if (token === analysisTokenRef.current) setAnalysisRunning(false);
    }
  }

  function handleSaveAiHistory() {
    if (!currentAnalysis) return;
    const saved = saveHistoryMock(currentAnalysis);
    setCurrentAnalysis(saved);
    setAiHistorySaved(true);
    showToast('Análise salva no histórico.', 'success');
  }

  const analyzeLabel = ocrRunning ? 'Aguardando OCR...' : analysisRunning ? 'Analisando...' : 'Analisar com IA';
  const analyzeDisabled = ocrRunning || analysisRunning || !imageSrc;

  return (
    <>
      <div className="page-header">
        <div className="page-header-inner">
          <span className="label">Scanner OCR</span>
          <h1>Detecte e pesquise texto em imagens</h1>
          <p>Envie uma imagem e escolha uma ação para o texto reconhecido.</p>
        </div>
      </div>

      <main>
        <div className="camera-layout">
          <section className="camera-main" aria-label="Scanner e captura">
            <CameraViewfinder
              imageSrc={imageSrc}
              ocrRunning={ocrRunning}
              detectionVisible={detectionVisible}
              onFileSelected={handleFileSelected}
            />
          </section>

          <aside className="camera-sidebar" aria-label="Resultado e histórico">
            <OcrResultPanel
              status={status}
              ocrOutputText={ocrOutputText}
              ocrRunning={ocrRunning}
              actionsEnabled={actionsEnabled}
              savedNote={savedNote}
              analyze={{ disabled: analyzeDisabled, loading: analysisRunning || ocrRunning, label: analyzeLabel }}
              onSearchGoogle={handleSearchGoogle}
              onCopy={handleCopyText}
              onTranslate={handleTranslate}
              onSaveNote={handleSaveNote}
              onAnalyze={handleAnalyze}
            />

            <ScanHistoryPanel
              history={history}
              onSelectEntry={handleSelectHistoryEntry}
              onClearClick={() => setConfirmOpen(true)}
            />

            <TipsCard />
          </aside>
        </div>
      </main>

      <AiAnalysisDrawer
        open={aiChatOpen}
        status={aiStatus}
        messages={aiMessages}
        finalAnalysis={currentAnalysis}
        historySaved={aiHistorySaved}
        onClose={() => setAiChatOpen(false)}
        onSaveHistory={handleSaveAiHistory}
      />

      <ConfirmModal
        open={confirmOpen}
        title="Limpar histórico?"
        message="Todos os scans salvos serão removidos permanentemente. Esta ação não pode ser desfeita."
        confirmLabel="Limpar tudo"
        onConfirm={handleClearHistoryConfirmed}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
