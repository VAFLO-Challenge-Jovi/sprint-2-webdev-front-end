export default function OcrResultPanel({
  status,
  ocrOutputText,
  ocrRunning,
  actionsEnabled,
  analyze,
  savedNote,
  onSearchGoogle,
  onCopy,
  onTranslate,
  onSaveNote,
  onAnalyze,
}) {
  const textClass = [
    'ocr-text-display',
    ocrRunning && !ocrOutputText ? 'scanning' : '',
    !ocrRunning && !ocrOutputText ? 'empty' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section className="ocr-result-panel" aria-labelledby="ocr-result-title">
      <div className="ocr-status">
        <div className={`status-dot ${status.state}`} aria-hidden="true"></div>
        <p>{status.text}</p>
      </div>

      <h4 id="ocr-result-title" style={{ marginBottom: 10, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        Texto detectado
      </h4>

      <div className={textClass} aria-live="polite" aria-label="Texto reconhecido pelo OCR">
        {ocrOutputText}
      </div>

      <div className="ocr-actions" aria-label="Ações disponíveis">
        <button
          className={`ocr-action-btn${analyze.loading ? ' loading' : ''}`}
          disabled={analyze.disabled}
          aria-busy={analyze.loading}
          aria-label="Analisar imagem com IA"
          onClick={onAnalyze}
        >
          <span>{analyze.label}</span>
        </button>
        <button className="ocr-action-btn" disabled={!actionsEnabled} aria-label="Pesquisar texto no Google" onClick={onSearchGoogle}>
          <span>Pesquisar no Google</span>
        </button>
        <button className="ocr-action-btn" disabled={!actionsEnabled} aria-label="Copiar texto detectado" onClick={onCopy}>
          <span>Copiar texto</span>
        </button>
        <button className="ocr-action-btn" disabled={!actionsEnabled} aria-label="Traduzir texto detectado" onClick={onTranslate}>
          <span>Traduzir</span>
        </button>
        <button
          className="ocr-action-btn"
          disabled={!actionsEnabled || savedNote}
          aria-label="Salvar como anotação"
          onClick={onSaveNote}
        >
          <span>{savedNote ? 'Já salvo' : 'Salvar no histórico'}</span>
        </button>
      </div>
    </section>
  );
}
