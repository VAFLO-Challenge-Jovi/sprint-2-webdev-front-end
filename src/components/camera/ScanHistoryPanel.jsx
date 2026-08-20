import { formatDate, relativeTime, truncate } from '../../utils/format.js';

export default function ScanHistoryPanel({ history, onSelectEntry, onClearClick }) {
  return (
    <section className="history-panel" aria-labelledby="history-title">
      <div className="history-header">
        <h4 id="history-title">Histórico de scans</h4>
        <button
          className="btn btn-ghost"
          style={{ fontSize: '0.78rem', padding: '4px 10px' }}
          aria-label="Limpar todo o histórico"
          onClick={onClearClick}
        >
          Limpar
        </button>
      </div>

      <div className="history-list" role="list" aria-label="Scans salvos">
        {history.length === 0 ? (
          <div className="history-empty">Nenhum scan salvo ainda.</div>
        ) : (
          history.map((entry) => (
            <div
              key={entry.id}
              className="history-item"
              role="listitem"
              tabIndex={0}
              title="Clique para restaurar este texto"
              onClick={() => onSelectEntry(entry)}
              onKeyDown={(e) => { if (e.key === 'Enter') onSelectEntry(entry); }}
            >
              <div className="history-item-text">
                <p className="history-item-preview">{truncate(entry.preview, 55)}</p>
                <p className="history-item-date" title={relativeTime(entry.savedAt)}>{formatDate(entry.savedAt)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
