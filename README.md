# SeekVision — OCR Inteligente para Estudantes

Projeto acadêmico desenvolvido para as disciplinas **Web Development** e **Front-End Design** — Sprint 2 | FIAP 2026.

## Integrantes

| Nome                           | RM       |
| ------------------------------ | -------- |
| Artur Fabi Brandi              | RM570258 |
| Felipe Santos Ribas            | RM569121 |
| Luiz Gonzaga                   | RM572446 |
| Orion Cavalcante França        | RM573677 |
| Victor Lula Heineken Rodrigues | RM570782 |

## Sobre o projeto

**SeekVision** é uma aplicação web que simula a integração entre câmera e ferramentas de pesquisa, utilizando OCR (Reconhecimento Óptico de Caracteres) para identificar textos em imagens. O objetivo é reduzir as etapas no processo de pesquisa de informações para estudantes universitários, transformando a câmera em uma ferramenta ativa de aprendizado.

### Funcionalidades

- **Scanner OCR** — exibe uma imagem padrão com detecção simulada de texto, efeito de varredura e typewriter
- **Upload de imagem** — envio de qualquer imagem via seleção de arquivo ou arrastar e soltar
- **Pesquisar no Google** — abre a pesquisa com o texto detectado em um clique
- **Copiar texto** — copia o conteúdo reconhecido para a área de transferência
- **Traduzir** — abre o Google Tradutor com o texto detectado
- **Histórico de scans** — persiste os textos detectados no `localStorage` com opção de restaurar ou limpar
- **Slideshow** — carrossel automático com 4 slides, navegação manual, suporte a swipe e teclado
- **Login e cadastro** — formulários com validação completa no cliente (e-mail, senha, força de senha, confirmação)

### Tecnologias

- HTML5 semântico
- CSS3 com Flexbox (sem frameworks)
- JavaScript puro (sem bibliotecas externas)
- `localStorage` para persistência de histórico e sessão
- Design system com tema claro (light theme)

### Estrutura de arquivos

```
/
├── index.html        # Landing page com slideshow e funcionalidades
├── camera.html       # Scanner OCR (funcionalidade principal)
├── login.html        # Login e cadastro com validação de formulário
├── css/
│   └── style.css     # Design system completo (Flexbox, tema claro)
├── js/
│   ├── main.js       # Utilitários compartilhados: navbar, toasts, modais
│   ├── slideshow.js  # Carrossel automático com suporte a touch e teclado
│   ├── camera.js     # OCR simulado, upload de imagem e histórico
│   └── login.js      # Validação de formulários e autenticação via localStorage
├── images/
│   └── default-photo.jpg  # Imagem padrão do scanner
├── INTEGRANTES.TXT
└── README.md
```

## Requisitos cumpridos

### Front-End Design

- [x] Layout dinâmico e moderno com design system completo (tema claro, glassmorphism)
- [x] HTML semântico (`header`, `nav`, `main`, `section`, `article`, `aside`, `footer`)
- [x] Flexbox para posicionamento e estruturação de todos os layouts
- [x] Design responsivo com breakpoints para mobile e tablet

### Web Development

- [x] Manipulação dinâmica de elementos e eventos DOM
- [x] Validação de formulários — e-mail (regex), senha (mínimo, força), confirmação de senha, campos obrigatórios
- [x] Login e cadastro com feedback inline de erros e persistência via `localStorage`
- [x] Alertas e prompts customizados (toasts, modais de confirmação)
- [x] Slideshow automático com 4 slides — suporte a swipe (touch) e teclado
- [x] Eventos de usuário — click, input, blur, change, keydown, touchstart/end, dragover/drop
- [x] Upload e leitura de imagem via `FileReader` API
- [x] Simulação de OCR com efeito de varredura animado e typewriter progressivo
- [x] Persistência de histórico via `localStorage`
