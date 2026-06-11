/* ============================================================
   HISTORY.JS — Mock knowledge history browser
   ============================================================ */

(function () {
  const topicList = document.getElementById('knowledge-topic-list');
  const nodeList = document.getElementById('knowledge-node-list');
  const detailPanel = document.getElementById('knowledge-detail');
  const breadcrumb = document.getElementById('knowledge-breadcrumb');
  const title = document.getElementById('history-content-title');
  const aiPanel = document.getElementById('history-ai-panel');
  const aiBackdrop = document.getElementById('history-ai-backdrop');
  const aiClose = document.getElementById('history-ai-close');
  const aiMessages = document.getElementById('history-ai-messages');
  const aiForm = document.getElementById('history-ai-form');
  const aiInput = document.getElementById('history-ai-input');
  const aiStatus = document.getElementById('history-ai-status');
  const aiDot = document.getElementById('history-ai-dot');

  if (!topicList || !nodeList || !detailPanel || !window.MockKnowledgeAI) return;

  const historyTree = window.MockKnowledgeAI.getHistoryTreeMock();
  let selectedTopic = null;
  let selectedNode = null;
  let currentNodes = [];
  let currentLabel = 'Selecione um tema';
  let currentConversationContext = null;

  function cleanUserText(text) {
    return String(text || '')
      .replace(/\bmock\b/gi, 'simulado')
      .replace(/\bMock\b/g, 'IA');
  }

  function renderTopics() {
    topicList.innerHTML = '';

    historyTree.forEach(topic => {
      const button = document.createElement('button');
      button.className = 'knowledge-topic-btn';
      button.type = 'button';
      button.setAttribute('role', 'listitem');
      button.innerHTML = `
        <span>${escapeHtml(topic.title)}</span>
        <small>${escapeHtml(cleanUserText(topic.summary))}</small>
      `;

      if (selectedTopic && selectedTopic.id === topic.id) {
        button.classList.add('active');
      }

      button.addEventListener('click', () => selectTopic(topic));
      topicList.appendChild(button);
    });
  }

  function selectTopic(topic) {
    selectedTopic = topic;
    selectedNode = null;
    currentNodes = topic.children || [];
    currentLabel = topic.title;
    if (title) title.textContent = topic.title;
    renderTopics();
    renderNodeList(currentNodes, currentLabel);
    renderTopicIntro(topic);
  }

  function selectNode(node, parentLabel) {
    selectedNode = node;

    if (node.children && node.children.length) {
      currentNodes = node.children;
      currentLabel = `${selectedTopic.title} / ${node.title}`;
      renderNodeList(currentNodes, currentLabel);
      renderBranchIntro(node, parentLabel);
      return;
    }

    renderNodeList(currentNodes, currentLabel);
    renderDetail(node);
  }

  function renderNodeList(nodes, label) {
    nodeList.innerHTML = '';
    if (breadcrumb) breadcrumb.textContent = label;

    if (!nodes.length) {
      nodeList.innerHTML = '<div class="history-empty">Nenhuma subaba disponível.</div>';
      return;
    }

    nodes.forEach(node => {
      const button = document.createElement('button');
      button.className = 'knowledge-node-btn';
      button.type = 'button';
      button.innerHTML = `
        <span>${escapeHtml(node.title)}</span>
        <small>${escapeHtml(cleanUserText(node.summary || 'Abrir detalhes'))}</small>
      `;

      if (selectedNode && selectedNode.id === node.id) {
        button.classList.add('active');
      }

      button.addEventListener('click', () => selectNode(node, label));
      nodeList.appendChild(button);
    });
  }

  function renderTopicIntro(topic) {
    const context = getNodeContext(topic);
    detailPanel.innerHTML = `
      <div class="knowledge-detail-empty">
        <span class="ai-chat-label">Tema selecionado</span>
        <h3>${escapeHtml(topic.title)}</h3>
        <p>${escapeHtml(cleanUserText(topic.summary))}</p>
        <p>Escolha uma subaba ou item ao lado para abrir os detalhes da IA.</p>
        ${renderConversationButton(context)}
      </div>
    `;
    bindConversationButtons();
  }

  function renderBranchIntro(node) {
    const context = getNodeContext(node);
    detailPanel.innerHTML = `
      <div class="knowledge-detail-empty">
        <span class="ai-chat-label">Subaba</span>
        <h3>${escapeHtml(node.title)}</h3>
        <p>${escapeHtml(cleanUserText(node.summary))}</p>
        <p>Este tópico possui conteúdos internos. Selecione um item para visualizar a análise completa.</p>
        ${renderConversationButton(context)}
      </div>
    `;
    bindConversationButtons();
  }

  function renderDetail(node) {
    const detail = node.details || node;
    const points = (detail.keyPoints || [])
      .map(point => `<li>${escapeHtml(cleanUserText(point))}</li>`)
      .join('');
    const sources = (detail.sources || [])
      .map(source => `
        <a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">
          ${escapeHtml(cleanUserText(source.title))}
        </a>
      `)
      .join('');
    const image = detail.image
      ? `<img class="analysis-detail-image" src="${escapeHtml(detail.image)}" alt="Imagem analisada">`
      : '';

    detailPanel.innerHTML = `
      ${image}
      <span class="ai-chat-label">Resultado da IA</span>
      <h3>${escapeHtml(detail.title)}</h3>
      <div class="ai-note-meta">
        <span class="ai-note-pill">${escapeHtml(detail.category || node.category || 'Outros')}</span>
        <span class="ai-note-pill">${formatDate(detail.createdAt || new Date().toISOString())}</span>
      </div>
      <p>${escapeHtml(cleanUserText(detail.summary || node.summary || ''))}</p>
      ${renderConversationButton(getNodeContext(node))}
      <div class="analysis-detail-section">
        <h4>Pontos importantes</h4>
        <ul class="ai-note-list">${points}</ul>
      </div>
      <div class="analysis-detail-section">
        <h4>Fontes simuladas</h4>
        <div class="ai-source-list">${sources}</div>
      </div>
    `;
    bindConversationButtons();
  }

  function getNodeContext(node) {
    const detail = node.details || node;

    return {
      title: detail.title || node.title,
      category: detail.category || node.category || selectedTopic?.title || 'Histórico da IA',
      summary: cleanUserText(detail.summary || node.summary || ''),
      keyPoints: (detail.keyPoints || []).map(cleanUserText),
    };
  }

  function renderConversationButton(context) {
    return `
      <button
        class="btn btn-primary knowledge-ai-btn"
        type="button"
        data-ai-title="${escapeHtml(context.title)}"
        data-ai-category="${escapeHtml(context.category)}"
        data-ai-summary="${escapeHtml(context.summary)}"
      >
        Conversar com IA
      </button>
    `;
  }

  function bindConversationButtons() {
    detailPanel.querySelectorAll('.knowledge-ai-btn').forEach(button => {
      button.addEventListener('click', () => {
        openTopicConversation({
          title: button.dataset.aiTitle,
          category: button.dataset.aiCategory,
          summary: button.dataset.aiSummary,
        });
      });
    });
  }

  function setHistoryAIStatus(state, text) {
    if (aiDot) aiDot.className = 'status-dot ' + state;
    if (aiStatus) aiStatus.textContent = text;
  }

  function addHistoryAIMessage(text, variant = 'done') {
    if (!aiMessages) return null;

    const message = document.createElement('div');
    message.className = 'ai-chat-message ' + variant;
    message.textContent = text;
    aiMessages.appendChild(message);
    aiMessages.scrollTop = aiMessages.scrollHeight;
    return message;
  }

  function openTopicConversation(context) {
    currentConversationContext = context;
    if (aiPanel) aiPanel.classList.remove('hidden');
    if (aiBackdrop) aiBackdrop.classList.remove('hidden');
    if (aiMessages) aiMessages.innerHTML = '';
    if (aiInput) aiInput.value = '';

    setHistoryAIStatus('done', `Conversando sobre ${context.title}`);
    addHistoryAIMessage(`Vamos conversar sobre ${context.title}.`, 'done');
    addHistoryAIMessage(`Contexto: ${context.summary}`, 'done');
    addHistoryAIMessage(generateContextualAnswer('resumo', context), 'done');
  }

  function closeTopicConversation() {
    if (aiPanel) aiPanel.classList.add('hidden');
    if (aiBackdrop) aiBackdrop.classList.add('hidden');
  }

  function generateContextualAnswer(question, context) {
    const normalizedQuestion = String(question || '').toLowerCase();
    const title = context.title;
    const category = context.category;

    if (normalizedQuestion.includes('exerc') || normalizedQuestion.includes('pratic')) {
      return `Para praticar ${title}, comece criando 3 perguntas curtas, responda sem consultar o material e depois compare com o resumo salvo em ${category}.`;
    }

    if (normalizedQuestion.includes('prova') || normalizedQuestion.includes('revis')) {
      return `Plano de revisão para ${title}: leia o resumo, destaque os pontos mais importantes e explique o tema em voz alta em até 2 minutos.`;
    }

    if (normalizedQuestion.includes('fonte') || normalizedQuestion.includes('link')) {
      return `As fontes simuladas desse item servem como ponto de partida. Use-as para validar conceitos e separar o que é definição, exemplo e aplicação prática.`;
    }

    return `${title} pertence a ${category}. A ideia central é: ${context.summary} Posso ajudar a transformar isso em resumo, perguntas de revisão ou roteiro de estudo.`;
  }

  if (aiClose) aiClose.addEventListener('click', closeTopicConversation);
  if (aiBackdrop) aiBackdrop.addEventListener('click', closeTopicConversation);
  if (aiForm) {
    aiForm.addEventListener('submit', e => {
      e.preventDefault();
      if (!currentConversationContext || !aiInput) return;

      const question = aiInput.value.trim();
      if (!question) return;

      addHistoryAIMessage(question, 'user');
      aiInput.value = '';
      setHistoryAIStatus('scanning', 'Gerando resposta da IA...');

      const loading = addHistoryAIMessage('Pensando no contexto selecionado...', 'loading');
      setTimeout(() => {
        if (loading) loading.remove();
        addHistoryAIMessage(generateContextualAnswer(question, currentConversationContext), 'done');
        setHistoryAIStatus('done', `Conversando sobre ${currentConversationContext.title}`);
      }, 650);
    });
  }

  if (historyTree.length) {
    selectTopic(historyTree[0]);
  } else {
    renderTopics();
  }
})();
