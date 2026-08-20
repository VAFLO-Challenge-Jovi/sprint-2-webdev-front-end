import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHistoryTreeMock } from '../services/mockKnowledgeAI.js';
import TopicList from '../components/history/TopicList.jsx';
import NodeList from '../components/history/NodeList.jsx';
import DetailPanel from '../components/history/DetailPanel.jsx';
import TopicChatDrawer from '../components/history/TopicChatDrawer.jsx';

function generateContextualAnswer(question, context) {
  const normalizedQuestion = String(question || '').toLowerCase();
  const { title, category, summary } = context;

  if (normalizedQuestion.includes('exerc') || normalizedQuestion.includes('pratic')) {
    return `Para praticar ${title}, comece criando 3 perguntas curtas, responda sem consultar o material e depois compare com o resumo salvo em ${category}.`;
  }
  if (normalizedQuestion.includes('prova') || normalizedQuestion.includes('revis')) {
    return `Plano de revisão para ${title}: leia o resumo, destaque os pontos mais importantes e explique o tema em voz alta em até 2 minutos.`;
  }
  if (normalizedQuestion.includes('fonte') || normalizedQuestion.includes('link')) {
    return `As fontes simuladas desse item servem como ponto de partida. Use-as para validar conceitos e separar o que é definição, exemplo e aplicação prática.`;
  }
  return `${title} pertence a ${category}. A ideia central é: ${summary} Posso ajudar a transformar isso em resumo, perguntas de revisão ou roteiro de estudo.`;
}

export default function History() {
  const [historyTree] = useState(() => getHistoryTreeMock());

  const [selectedTopic, setSelectedTopic] = useState(historyTree[0] || null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [currentNodes, setCurrentNodes] = useState(historyTree[0]?.children || []);
  const [currentLabel, setCurrentLabel] = useState(historyTree[0]?.title || 'Selecione um tema');
  const [detailView, setDetailView] = useState(
    historyTree[0] ? { kind: 'topic-intro', topic: historyTree[0] } : { kind: 'empty' },
  );

  const [chatOpen, setChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatStatus, setChatStatus] = useState({ state: 'ready', text: 'Selecione um tema para conversar.' });
  const [chatInput, setChatInput] = useState('');
  const messageIdRef = useRef(0);

  function addChatMessage(text, variant) {
    const id = ++messageIdRef.current;
    setChatMessages((prev) => [...prev, { id, text, variant }]);
    return id;
  }

  function selectTopic(topic) {
    setSelectedTopic(topic);
    setSelectedNode(null);
    setCurrentNodes(topic.children || []);
    setCurrentLabel(topic.title);
    setDetailView({ kind: 'topic-intro', topic });
  }

  function selectNode(node) {
    setSelectedNode(node);

    if (node.children && node.children.length) {
      setCurrentNodes(node.children);
      setCurrentLabel(`${selectedTopic.title} / ${node.title}`);
      setDetailView({ kind: 'branch-intro', node });
      return;
    }

    setDetailView({ kind: 'detail', node });
  }

  function openTopicConversation(context) {
    setChatContext(context);
    setChatOpen(true);
    setChatMessages([]);
    setChatInput('');
    messageIdRef.current = 0;

    setChatStatus({ state: 'done', text: `Conversando sobre ${context.title}` });
    addChatMessage(`Vamos conversar sobre ${context.title}.`, 'done');
    addChatMessage(`Contexto: ${context.summary}`, 'done');
    addChatMessage(generateContextualAnswer('resumo', context), 'done');
  }

  function handleChatSubmit(e) {
    e.preventDefault();
    if (!chatContext) return;
    const question = chatInput.trim();
    if (!question) return;

    addChatMessage(question, 'user');
    setChatInput('');
    setChatStatus({ state: 'scanning', text: 'Gerando resposta da IA...' });

    const loadingId = addChatMessage('Pensando no contexto selecionado...', 'loading');
    setTimeout(() => {
      setChatMessages((prev) => prev.filter((m) => m.id !== loadingId));
      addChatMessage(generateContextualAnswer(question, chatContext), 'done');
      setChatStatus({ state: 'done', text: `Conversando sobre ${chatContext.title}` });
    }, 650);
  }

  return (
    <>
      <div className="page-header">
        <div className="page-header-inner">
          <span className="label">Histórico</span>
          <h1>Conhecimento organizado por temas</h1>
          <p>Consulte análises da IA separadas por matéria, tecnologia e leitura.</p>
        </div>
      </div>

      <main>
        <section className="knowledge-page" aria-label="Histórico de análises inteligentes">
          <div className="knowledge-shell">
            <TopicList topics={historyTree} selectedTopicId={selectedTopic?.id} onSelect={selectTopic} />

            <section className="knowledge-content-panel" aria-labelledby="history-content-title">
              <div className="knowledge-content-header">
                <div>
                  <span className="ai-chat-label">Histórico da IA</span>
                  <h2 id="history-content-title">{selectedTopic ? selectedTopic.title : 'Histórico'}</h2>
                </div>
                <Link className="btn btn-secondary" to="/camera">
                  Voltar ao scanner
                </Link>
              </div>

              <div className="knowledge-browser">
                <NodeList
                  label={currentLabel}
                  nodes={currentNodes}
                  selectedNodeId={selectedNode?.id}
                  onSelect={selectNode}
                />
                <DetailPanel view={detailView} onStartConversation={openTopicConversation} />
              </div>
            </section>
          </div>
        </section>
      </main>

      <TopicChatDrawer
        open={chatOpen}
        status={chatStatus}
        messages={chatMessages}
        inputValue={chatInput}
        onInputChange={setChatInput}
        onSubmit={handleChatSubmit}
        onClose={() => setChatOpen(false)}
      />
    </>
  );
}
