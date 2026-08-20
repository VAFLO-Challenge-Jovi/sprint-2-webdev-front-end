import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/format.js';

export default function AiAnalysisDrawer({
  open,
  status,
  messages,
  finalAnalysis,
  historySaved,
  onClose,
  onSaveHistory,
}) {
  return (
    <>
      <div
        className={`ai-drawer-backdrop${open ? '' : ' hidden'}`}
        aria-hidden="true"
        onClick={onClose}
      ></div>
      <aside
        className={`ai-chat-panel ai-chat-drawer${open ? '' : ' hidden'}`}
        aria-labelledby="ai-chat-title"
      >
        <div className="ai-chat-header">
          <div>
            <span className="ai-chat-label">IA</span>
            <h4 id="ai-chat-title">Análise inteligente</h4>
          </div>
          <button className="btn btn-ghost ai-chat-close" aria-label="Fechar análise" onClick={onClose}>
            Fechar
          </button>
        </div>

        <div className="ai-drawer-status">
          <span className={`status-dot ${status.state}`} aria-hidden="true"></span>
          <p>{status.text}</p>
        </div>

        <div className="ai-chat-messages" aria-live="polite">
          {messages.map((message) => (
            <div key={message.id} className={`ai-chat-message ${message.state}`}>
              {message.text}
            </div>
          ))}
        </div>

        <div className={`ai-note-card${finalAnalysis ? '' : ' hidden'}`}>
          {finalAnalysis && (
            <>
              <h5>{finalAnalysis.title}</h5>
              <div className="ai-note-meta">
                <span className="ai-note-pill">{finalAnalysis.category}</span>
                <span className="ai-note-pill">{formatDate(finalAnalysis.createdAt)}</span>
              </div>
              <p>{finalAnalysis.summary}</p>
              <ul className="ai-note-list">
                {(finalAnalysis.keyPoints || []).map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <div className="ai-source-list">
                {(finalAnalysis.sources || []).map((source) => (
                  <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">
                    {source.title}
                  </a>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="ai-drawer-actions">
          <button
            className={`btn btn-primary${finalAnalysis ? '' : ' hidden'}`}
            style={{ width: '100%' }}
            disabled={historySaved}
            onClick={onSaveHistory}
          >
            {historySaved ? 'Salvo no histórico' : 'Salvar no histórico'}
          </button>
          <Link className="btn btn-secondary ai-history-link" to="/history">
            Abrir histórico
          </Link>
        </div>
      </aside>
    </>
  );
}
