export default function TopicChatDrawer({ open, status, messages, inputValue, onInputChange, onSubmit, onClose }) {
  return (
    <>
      <div className={`ai-drawer-backdrop${open ? '' : ' hidden'}`} aria-hidden="true" onClick={onClose}></div>
      <aside className={`ai-chat-panel ai-chat-drawer${open ? '' : ' hidden'}`} aria-labelledby="history-ai-title">
        <div className="ai-chat-header">
          <div>
            <span className="ai-chat-label">IA</span>
            <h4 id="history-ai-title">Conversa com IA</h4>
          </div>
          <button className="btn btn-ghost ai-chat-close" aria-label="Fechar conversa" onClick={onClose}>
            Fechar
          </button>
        </div>

        <div className="ai-drawer-status">
          <span className={`status-dot ${status.state}`} aria-hidden="true"></span>
          <p>{status.text}</p>
        </div>

        <div className="ai-chat-messages" aria-live="polite">
          {messages.map((message) => (
            <div key={message.id} className={`ai-chat-message ${message.variant}`}>
              {message.text}
            </div>
          ))}
        </div>

        <form className="ai-chat-form" onSubmit={onSubmit}>
          <label className="form-label" htmlFor="history-ai-input">
            Pergunte sobre o tema
          </label>
          <div className="ai-chat-input-row">
            <input
              className="form-input"
              id="history-ai-input"
              type="text"
              placeholder="Ex.: gere um resumo para revisão"
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
            />
            <button className="btn btn-primary" type="submit">
              Enviar
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}
