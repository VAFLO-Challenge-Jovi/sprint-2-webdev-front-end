import { cleanUserText } from '../../utils/format.js';

export default function TopicList({ topics, selectedTopicId, onSelect }) {
  return (
    <aside className="knowledge-topics-panel" aria-labelledby="history-topics-title">
      <div className="history-header">
        <h4 id="history-topics-title">Temas principais</h4>
      </div>
      <div className="knowledge-topic-list" role="list">
        {topics.map((topic) => (
          <button
            key={topic.id}
            type="button"
            role="listitem"
            className={`knowledge-topic-btn${topic.id === selectedTopicId ? ' active' : ''}`}
            onClick={() => onSelect(topic)}
          >
            <span>{topic.title}</span>
            <small>{cleanUserText(topic.summary)}</small>
          </button>
        ))}
      </div>
    </aside>
  );
}
