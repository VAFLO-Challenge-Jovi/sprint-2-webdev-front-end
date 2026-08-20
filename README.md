# SeekVision — OCR Inteligente para Estudantes (React)

Projeto acadêmico desenvolvido para as disciplinas **Web Development** e **Front-End Design** —
Sprint 3 | FIAP 2026.

Esta é a migração para **React + Vite** do protótipo entregue na Sprint 2
(`sprint-2-webdev-front-end/`, HTML/CSS/JS puro). A proposta, o visual e as funcionalidades são os
mesmos — o que muda é a tecnologia: a interface inteira agora é construída com componentes
funcionais React, seguindo a estrutura pai → filho (Header/Footer compartilhados, páginas como
`Home`, `Camera`, `History`, `Login`, cada uma composta por componentes menores).

## Integrantes

| Nome                           | RM       |
| ------------------------------ | -------- |
| Artur Fabi Brandi              | RM570258 |
| Felipe Santos Ribas            | RM569121 |
| Luiz Gonzaga                   | RM572446 |
| Orion Cavalcante França        | RM573677 |
| Victor Lula Heineken Rodrigues | RM570782 |

## Sobre o projeto

**SeekVision** é uma aplicação web que simula a integração entre câmera e ferramentas de pesquisa,
utilizando OCR (Reconhecimento Óptico de Caracteres) para identificar textos em imagens. O
objetivo é reduzir as etapas no processo de pesquisa de informações para estudantes
universitários, transformando a câmera em uma ferramenta ativa de aprendizado.

### Funcionalidades

- **Scanner OCR** — exibe uma imagem padrão com detecção simulada de texto, efeito de varredura e typewriter
- **Upload de imagem** — envio de qualquer imagem via seleção de arquivo ou arrastar e soltar
- **Pesquisar no Google** — abre a pesquisa com o texto detectado em um clique
- **Copiar texto** — copia o conteúdo reconhecido para a área de transferência
- **Traduzir** — abre o Google Tradutor com o texto detectado
- **Histórico de scans** — persiste os textos detectados no `localStorage` (via hook próprio) com opção de restaurar ou limpar
- **Análise com IA mock** — simula OCR, pesquisa, leitura de resultados e resumo sem APIs externas
- **Histórico inteligente** — página separada com temas, subabas, detalhes e conversa mock com IA
- **Slideshow** — carrossel automático com 4 slides, navegação manual, suporte a swipe e teclado
- **Login e cadastro** — formulários com validação completa no cliente (e-mail, senha, força de senha, confirmação)

## Tecnologias utilizadas

- **React 19** (componentes funcionais, hooks)
- **Vite** (build tool e dev server)
- **React Router DOM** (rotas: `/`, `/camera`, `/history`, `/login`)
- CSS puro (arquivo único global, portado do design system da Sprint 2 — sem frameworks CSS)
- `localStorage` para persistência de sessão e histórico
- Sem backend — toda a "IA" é simulada em `src/services/mockKnowledgeAI.js`

## Como instalar as dependências

```bash
npm install
```

## Como executar o projeto

```bash
npm run dev
```

O terminal mostrará a URL local (por padrão `http://localhost:5173`). Abra no navegador.

Para gerar a build de produção:

```bash
npm run build
npm run preview   # opcional, serve a build gerada localmente
```

## Usuários e senha para teste

Não há usuário fixo/seed. O login é 100% client-side: a tela `/login` permite **criar uma conta**
(aba "Criar conta") com qualquer nome, e-mail e senha (mínimo 6 caracteres) — os dados ficam
salvos apenas no `localStorage` do próprio navegador. Depois disso, use esse mesmo e-mail/senha na
aba "Entrar" para testar o fluxo de login. Não há verificação de senha contra um backend: qualquer
combinação de e-mail válido + senha com 6+ caracteres é aceita no login.

## Onde e como a IA foi utilizada no projeto

A migração deste projeto de HTML/CSS/JS puro (Sprint 2) para React (Sprint 3) foi feita com o
auxílio do **Claude Code**: a IA leu o protótipo original da Sprint 2 e os requisitos da Sprint 3
(documento do Challenge), e a partir disso gerou a estrutura inicial de componentes, hooks
(`useLocalStorage`, `useToast`) e rotas React que reproduzem fielmente as telas e o comportamento
já existentes. A equipe revisou o resultado gerado.

Importante: isso é diferente da funcionalidade "Analisar com IA" **dentro do produto** — aquela é
uma simulação (mock) de um fluxo de IA para fins do protótipo, implementada em
`src/services/mockKnowledgeAI.js`, e não faz nenhuma chamada a uma API de IA real.

## Deploy

**Pendente.** O deploy na Vercel não foi feito nesta etapa — está planejado para uma próxima
entrega. Por ora, o projeto deve ser avaliado rodando localmente com `npm install && npm run dev`.

## Organização do projeto

```
/
├── index.html
├── INTEGRANTES.TXT
├── README.md
├── package.json
│
└── src/
    ├── main.jsx                    # Entry point, monta <App /> dentro de <BrowserRouter>
    ├── App.jsx                     # Definição das rotas (react-router-dom)
    │
    ├── assets/imgs/                # Imagens usadas no slideshow e no scanner
    │
    ├── styles/
    │   └── global.css              # Estilos globais (portado 1:1 do design system da Sprint 2)
    │
    ├── context/
    │   └── ToastContext.jsx        # Provider + hook de notificações toast (substitui showToast global)
    │
    ├── hooks/
    │   └── useLocalStorage.js      # Hook genérico de estado sincronizado com localStorage
    │
    ├── services/
    │   └── mockKnowledgeAI.js      # Service mock de análise por imagem e histórico inteligente
    │
    ├── utils/
    │   └── format.js               # formatDate, truncate, relativeTime (Math.round/floor), cleanUserText
    │
    ├── components/
    │   ├── layout/                 # Header (navbar + menu mobile), Footer, MainLayout
    │   ├── ToastContainer.jsx
    │   ├── ConfirmModal.jsx
    │   ├── home/                   # Slideshow, FeatureCard, StepItem
    │   ├── auth/                   # LoginForm, RegisterForm
    │   ├── camera/                 # CameraViewfinder, OcrResultPanel, ScanHistoryPanel, AiAnalysisDrawer, TipsCard
    │   └── history/                # TopicList, NodeList, DetailPanel, TopicChatDrawer
    │
    └── pages/
        ├── Home.jsx                 # "/"
        ├── Camera.jsx                # "/camera"
        ├── History.jsx               # "/history"
        └── Login.jsx                  # "/login"
```

## Requisitos cumpridos (Sprint 3 — Web Development)

- [x] Migração do protótipo HTML/CSS/JS da Sprint 2 para **React**, com componentes funcionais e imports
- [x] Estrutura de componentes pai → filho (Header/Footer compartilhados; páginas compostas por componentes menores)
- [x] `localStorage` para armazenamento de dados (sessão de login, histórico de scans, histórico de análises IA), via hook próprio
- [x] Operações com `Math`: `Math.random` (duração simulada do scan), `Math.abs` (detecção de swipe) e `Math.round`/`Math.floor` (tempo relativo no histórico, em `utils/format.js`)
- [x] Projeto versionado no GitHub (herda o repositório já existente da Sprint 2)
- [x] README com tecnologias, instalação, execução, usuário de teste e uso de IA
- [ ] Deploy na Vercel — pendente (fora do escopo desta entrega)
