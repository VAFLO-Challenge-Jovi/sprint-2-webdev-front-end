/* ============================================================
   MOCK KNOWLEDGE AI SERVICE
   Dados e atrasos simulados para o fluxo de analise por imagem.
   Nao integra APIs externas: OpenAI, Gemini, Google Search, etc.
   Ported 1:1 from the Sprint 2 vanilla-JS version (src/services/mockKnowledgeAI.js),
   only swapping the IIFE + `window.MockKnowledgeAI` global for ES module exports.
   ============================================================ */

const HISTORY_KEY = 'seekvision_knowledge_ai_history_mock';
const DEFAULT_CATEGORIES = [
  'Livros',
  'Programação',
  'Marketing',
  'Produtos',
  'Lugares',
  'Documentos',
  'Estudos',
  'Outros',
];
const MOCK_BOOK_NOTE = {
  title: 'The Photography Storytelling Workshop',
  category: 'Livros',
  extractedText: 'The Photography Storytelling Workshop',
  summary:
    'Resumo gerado a partir da imagem e de resultados simulados de pesquisa. A análise identifica um livro sobre narrativa visual, composição fotográfica e construção de histórias por meio de imagens.',
  keyPoints: [
    'Livro identificado a partir da imagem enviada',
    'Tema principal detectado: storytelling visual em fotografia',
    'Informações relevantes organizadas automaticamente para estudo',
  ],
  sources: [
    { title: 'Resultado Google simulado sobre o livro', url: 'https://example.com/photography-storytelling' },
    { title: 'Fonte complementar simulada de fotografia', url: 'https://example.org/photo-workshop' },
  ],
};
const LEGACY_BOOK_TITLE_MOCK = ['clean', 'architecture'].join(' ');
const MOCK_HISTORY_TREE = [
  {
    id: 'mock-topic-materias',
    title: 'Matérias',
    type: 'topic',
    summary: 'Conteúdos acadêmicos organizados por disciplina.',
    children: [
      {
        id: 'mock-matematica',
        title: 'Matemática',
        type: 'tab',
        category: 'Matérias',
        summary: 'Revisões sobre lógica matemática, funções e interpretação de problemas.',
        details: {
          title: 'Matemática',
          category: 'Matérias',
          summary:
            'Coleção simulada com anotações de matemática voltadas para estudo universitário. O foco está em reconhecer padrões, organizar fórmulas úteis e transformar exercícios em passos objetivos.',
          keyPoints: [
            'Funções de primeiro e segundo grau com exemplos resolvidos',
            'Interpretação de gráficos e relações entre variáveis',
            'Estratégias para revisar antes de provas',
          ],
          sources: [
            { title: 'Apostila simulada de cálculo básico', url: 'https://example.com/matematica' },
            { title: 'Lista simulada de exercícios resolvidos', url: 'https://example.org/exercicios-matematica' },
          ],
          createdAt: '2026-06-01T10:00:00.000Z',
        },
      },
      {
        id: 'mock-historia',
        title: 'História',
        type: 'tab',
        category: 'Matérias',
        summary: 'Linha do tempo, contexto social e sínteses de acontecimentos históricos.',
        details: {
          title: 'História',
          category: 'Matérias',
          summary:
            'Resumo simulado criado para organizar períodos históricos em causas, consequências e personagens centrais. Ideal para transformar imagens de livros ou slides em revisão estruturada.',
          keyPoints: [
            'Eventos agrupados por período histórico',
            'Relação entre contexto político, economia e cultura',
            'Perguntas-guia para estudar causas e consequências',
          ],
          sources: [
            { title: 'Enciclopédia histórica simulada', url: 'https://example.com/historia' },
            { title: 'Material complementar simulado', url: 'https://example.org/historia-resumo' },
          ],
          createdAt: '2026-06-02T14:30:00.000Z',
        },
      },
    ],
  },
  {
    id: 'mock-topic-programacao',
    title: 'Programação',
    type: 'topic',
    summary: 'Guias e anotações técnicas separados por linguagem e área.',
    children: [
      {
        id: 'mock-python',
        title: 'Python',
        type: 'tab',
        category: 'Programação',
        summary: 'Sintaxe, automações simples e organização de scripts.',
        details: {
          title: 'Python',
          category: 'Programação',
          summary:
            'Conteúdo simulado sobre Python para estudos práticos. Reúne conceitos de variáveis, listas, funções e leitura de arquivos com exemplos próximos de exercícios acadêmicos.',
          keyPoints: [
            'Estruturas de dados básicas: listas, dicionários e tuplas',
            'Funções para reduzir repetição de código',
            'Leitura e escrita de arquivos em pequenos scripts',
          ],
          sources: [
            { title: 'Documentação Python simulada', url: 'https://example.com/python' },
            { title: 'Guia simulado de scripts acadêmicos', url: 'https://example.org/python-estudos' },
          ],
          createdAt: '2026-06-03T09:15:00.000Z',
        },
      },
      {
        id: 'mock-javascript',
        title: 'JavaScript',
        type: 'tab',
        category: 'Programação',
        summary: 'DOM, eventos e lógica de interação no navegador.',
        details: {
          title: 'JavaScript',
          category: 'Programação',
          summary:
            'Anotação simulada com foco em JavaScript para páginas interativas. O material cobre manipulação de DOM, eventos, armazenamento local e organização de funções.',
          keyPoints: [
            'Eventos de clique, envio de formulário e teclado',
            'Manipulação segura de conteúdo no DOM',
            'Uso de localStorage para protótipos sem backend',
          ],
          sources: [
            { title: 'Referência JavaScript simulada', url: 'https://example.com/javascript' },
            { title: 'Exemplos simulados de DOM', url: 'https://example.org/dom-js' },
          ],
          createdAt: '2026-06-04T16:20:00.000Z',
        },
      },
      {
        id: 'mock-frontend',
        title: 'Frontend',
        type: 'tab',
        category: 'Programação',
        summary: 'Base para interfaces web com HTML e CSS.',
        children: [
          {
            id: 'mock-html',
            title: 'HTML',
            type: 'item',
            category: 'Programação',
            summary: 'Estrutura semântica, acessibilidade e organização de páginas.',
            details: {
              title: 'HTML',
              category: 'Frontend',
              summary:
                'Detalhe simulado sobre HTML semântico. Mostra como organizar cabeçalho, navegação, conteúdo principal e seções para tornar páginas mais claras para usuários e tecnologias assistivas.',
              keyPoints: [
                'Uso correto de header, nav, main, section e footer',
                'Atributos aria apenas quando ajudam a experiência',
                'Hierarquia de títulos como mapa do conteúdo',
              ],
              sources: [
                { title: 'Guia HTML simulado', url: 'https://example.com/html' },
                { title: 'Checklist simulado de semântica', url: 'https://example.org/html-semantico' },
              ],
              createdAt: '2026-06-05T11:45:00.000Z',
            },
          },
          {
            id: 'mock-css',
            title: 'CSS',
            type: 'item',
            category: 'Programação',
            summary: 'Layout responsivo, componentes e consistência visual.',
            details: {
              title: 'CSS',
              category: 'Frontend',
              summary:
                'Detalhe simulado sobre CSS aplicado a interfaces responsivas. O conteúdo organiza conceitos de Flexbox, variáveis CSS, estados de botão e adaptação para telas menores.',
              keyPoints: [
                'Flexbox para distribuir áreas principais da página',
                'Variáveis CSS para manter cores e espaçamentos consistentes',
                'Breakpoints simples para mobile e tablet',
              ],
              sources: [
                { title: 'Referência CSS simulada', url: 'https://example.com/css' },
                { title: 'Exemplos simulados de layout', url: 'https://example.org/css-layout' },
              ],
              createdAt: '2026-06-06T13:10:00.000Z',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'mock-topic-livros',
    title: 'Livros',
    type: 'topic',
    summary: 'Leituras identificadas por imagem e organizadas como notas.',
    children: [
      {
        id: 'mock-photography-storytelling',
        title: 'The Photography Storytelling Workshop',
        type: 'item',
        category: 'Livros',
        summary: 'Livro sobre narrativa visual, composição e construção de ensaios fotográficos.',
        details: {
          title: 'The Photography Storytelling Workshop',
          category: 'Livros',
          summary:
            'Análise simulada de um livro focado em transformar fotografias isoladas em histórias visuais coerentes. O conteúdo sugere atenção a sequência, intenção narrativa, luz e seleção final das imagens.',
          keyPoints: [
            'Narrativa visual como sequência de escolhas',
            'Importância de tema, ritmo e edição fotográfica',
            'Exercícios práticos para criar ensaios com começo, meio e fim',
          ],
          sources: [
            { title: 'Resultado Google simulado sobre o livro', url: 'https://example.com/photography-storytelling' },
            { title: 'Resenha complementar simulada', url: 'https://example.org/photo-workshop' },
          ],
          createdAt: '2026-06-07T18:00:00.000Z',
        },
      },
    ],
  },
];

function delayMock(ms = 900) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeCategoryMock(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function sanitizeHistoryNoteMock(note) {
  const normalizedTitle = normalizeCategoryMock(note && note.title);
  if (normalizedTitle !== LEGACY_BOOK_TITLE_MOCK) return note;

  return {
    ...note,
    title: MOCK_BOOK_NOTE.title,
    category: MOCK_BOOK_NOTE.category,
    summary: MOCK_BOOK_NOTE.summary,
    keyPoints: MOCK_BOOK_NOTE.keyPoints,
    sources: MOCK_BOOK_NOTE.sources,
    extractedText: MOCK_BOOK_NOTE.extractedText,
  };
}

export function getHistoryMock() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]').map(sanitizeHistoryNoteMock);
  } catch {
    return [];
  }
}

export async function analyzeImageMock(image) {
  await delayMock(850);

  return {
    image,
    confidence: 0.91,
    detectedObjects: ['capa de livro', 'texto impresso', 'titulo'],
    suggestedTitle: MOCK_BOOK_NOTE.title,
    mock: true,
  };
}

export async function extractTextMock(image) {
  await delayMock(950);

  return {
    image,
    text: MOCK_BOOK_NOTE.extractedText,
    language: 'en',
    mock: true,
  };
}

export async function searchWebMock(query) {
  await delayMock(1100);

  return [
    {
      title: 'Resultado Google simulado',
      url: 'https://example.com',
      snippet: `Resultado ficticio relacionado a "${query}".`,
    },
    {
      title: 'Fonte complementar simulada',
      url: 'https://example.org',
      snippet: 'Fonte simulada com contexto adicional para enriquecer o resumo.',
    },
  ];
}

export async function generateNoteMock({ image, extractedText, searchResults }) {
  await delayMock(1050);

  return {
    id: 'mock-note-' + Date.now(),
    image,
    title: MOCK_BOOK_NOTE.title,
    category: MOCK_BOOK_NOTE.category,
    summary: MOCK_BOOK_NOTE.summary,
    keyPoints: MOCK_BOOK_NOTE.keyPoints,
    sources: searchResults.length
      ? searchResults.map((result) => ({ title: result.title, url: result.url }))
      : MOCK_BOOK_NOTE.sources,
    extractedText: extractedText.text || MOCK_BOOK_NOTE.extractedText,
    createdAt: new Date().toISOString(),
    mock: true,
  };
}

export function findOrCreateCategoryMock(note, existingCategories = []) {
  const categories = [...new Set([...DEFAULT_CATEGORIES, ...existingCategories].filter(Boolean))];
  const wanted = normalizeCategoryMock(note.category);
  const found = categories.find((category) => normalizeCategoryMock(category) === wanted);

  return found || note.category || 'Outros';
}

export function saveHistoryMock(note) {
  const history = getHistoryMock();
  const existingCategories = history.map((item) => item.category);
  const category = findOrCreateCategoryMock(note, existingCategories);
  const entry = {
    ...note,
    id: note.id || 'mock-note-' + Date.now(),
    category,
    savedAt: new Date().toISOString(),
    mock: true,
  };

  history.unshift(entry);
  if (history.length > 30) history.pop();
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));

  return entry;
}

function savedNoteToHistoryNodeMock(note) {
  return {
    id: note.id || 'mock-saved-' + note.createdAt,
    title: note.title,
    type: 'item',
    category: note.category || 'Outros',
    summary: note.summary,
    details: {
      title: note.title,
      category: note.category || 'Outros',
      summary: note.summary,
      keyPoints: note.keyPoints || [],
      sources: note.sources || [],
      image: note.image || '',
      createdAt: note.createdAt || note.savedAt || new Date().toISOString(),
    },
  };
}

function cloneMock(value) {
  return JSON.parse(JSON.stringify(value));
}

export function getInitialHistoryTreeMock() {
  return cloneMock(MOCK_HISTORY_TREE);
}

export function getHistoryTreeMock() {
  const tree = getInitialHistoryTreeMock();
  const savedNotes = getHistoryMock();

  savedNotes.forEach((note) => {
    const category = findOrCreateCategoryMock(note, tree.map((topic) => topic.title));
    const topic =
      tree.find((item) => normalizeCategoryMock(item.title) === normalizeCategoryMock(category)) ||
      tree.find((item) => item.id === 'mock-topic-livros');

    const alreadyListed =
      topic &&
      topic.children.some(
        (child) => child.id === note.id || normalizeCategoryMock(child.title) === normalizeCategoryMock(note.title),
      );

    if (topic && !alreadyListed) {
      topic.children.unshift(savedNoteToHistoryNodeMock(note));
    }
  });

  return tree;
}
