import { cleanUserText } from '../../utils/format.js';

export default function NodeList({ label, nodes, selectedNodeId, onSelect }) {
  return (
    <div className="knowledge-subnav" aria-label="Subabas do tema selecionado">
      <p className="knowledge-breadcrumb">{label}</p>
      <div>
        {nodes.length === 0 ? (
          <div className="history-empty">Nenhuma subaba disponível.</div>
        ) : (
          nodes.map((node) => (
            <button
              key={node.id}
              type="button"
              className={`knowledge-node-btn${node.id === selectedNodeId ? ' active' : ''}`}
              onClick={() => onSelect(node)}
            >
              <span>{node.title}</span>
              <small>{cleanUserText(node.summary || 'Abrir detalhes')}</small>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
