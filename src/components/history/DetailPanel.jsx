import { cleanUserText, formatDate } from '../../utils/format.js';

function getNodeContext(node) {
  const detail = node.details || node;
  return {
    title: detail.title || node.title,
    category: detail.category || node.category || node.title || 'Histórico da IA',
    summary: cleanUserText(detail.summary || node.summary || ''),
    keyPoints: (detail.keyPoints || []).map(cleanUserText),
  };
}

function ConversationButton({ context, onStartConversation }) {
  return (
    <button
      className="btn btn-primary knowledge-ai-btn"
      type="button"
      onClick={() => onStartConversation(context)}
    >
      Conversar com IA
    </button>
  );
}

export default function DetailPanel({ view, onStartConversation }) {
  if (view.kind === 'empty') {
    return (
      <article className="knowledge-detail" aria-live="polite">
        <div className="history-empty">Selecione um tema para visualizar subabas e detalhes.</div>
      </article>
    );
  }

  if (view.kind === 'topic-intro') {
    const context = getNodeContext(view.topic);
    return (
      <article className="knowledge-detail" aria-live="polite">
        <div className="knowledge-detail-empty">
          <span className="ai-chat-label">Tema selecionado</span>
          <h3>{view.topic.title}</h3>
          <p>{cleanUserText(view.topic.summary)}</p>
          <p>Escolha uma subaba ou item ao lado para abrir os detalhes da IA.</p>
          <ConversationButton context={context} onStartConversation={onStartConversation} />
        </div>
      </article>
    );
  }

  if (view.kind === 'branch-intro') {
    const context = getNodeContext(view.node);
    return (
      <article className="knowledge-detail" aria-live="polite">
        <div className="knowledge-detail-empty">
          <span className="ai-chat-label">Subaba</span>
          <h3>{view.node.title}</h3>
          <p>{cleanUserText(view.node.summary)}</p>
          <p>Este tópico possui conteúdos internos. Selecione um item para visualizar a análise completa.</p>
          <ConversationButton context={context} onStartConversation={onStartConversation} />
        </div>
      </article>
    );
  }

  // view.kind === 'detail'
  const node = view.node;
  const detail = node.details || node;
  const context = getNodeContext(node);

  return (
    <article className="knowledge-detail" aria-live="polite">
      {detail.image && <img className="analysis-detail-image" src={detail.image} alt="Imagem analisada" />}
      <span className="ai-chat-label">Resultado da IA</span>
      <h3>{detail.title}</h3>
      <div className="ai-note-meta">
        <span className="ai-note-pill">{detail.category || node.category || 'Outros'}</span>
        <span className="ai-note-pill">{formatDate(detail.createdAt || new Date().toISOString())}</span>
      </div>
      <p>{cleanUserText(detail.summary || node.summary || '')}</p>
      <ConversationButton context={context} onStartConversation={onStartConversation} />
      <div className="analysis-detail-section">
        <h4>Pontos importantes</h4>
        <ul className="ai-note-list">
          {(detail.keyPoints || []).map((point) => (
            <li key={point}>{cleanUserText(point)}</li>
          ))}
        </ul>
      </div>
      <div className="analysis-detail-section">
        <h4>Fontes simuladas</h4>
        <div className="ai-source-list">
          {(detail.sources || []).map((source) => (
            <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">
              {cleanUserText(source.title)}
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}
