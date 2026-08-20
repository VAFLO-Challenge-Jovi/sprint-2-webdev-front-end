import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Slideshow from '../components/home/Slideshow.jsx';
import FeatureCard from '../components/home/FeatureCard.jsx';
import StepItem from '../components/home/StepItem.jsx';
import Footer from '../components/layout/Footer.jsx';
import defaultPhoto from '../assets/imgs/default-photo.jpg';
import defaultPhotoTextFound from '../assets/imgs/default-photo-text-found.jpg';
import buscandoTexto from '../assets/imgs/buscando-texto.jpg';
import resultadoEncontrado from '../assets/imgs/resultado-encontrado.jpg';

const SLIDES = [
  { id: 'slide-1', image: defaultPhoto, alt: 'Imagem sendo analisada', status: 'Detectando texto...', barWidth: 70 },
  { id: 'slide-2', image: defaultPhotoTextFound, alt: 'Texto encontrado', status: 'Texto encontrado!', barWidth: 100 },
  { id: 'slide-3', image: buscandoTexto, alt: 'Pesquisando texto', status: 'Pesquisando...', barWidth: 45 },
  { id: 'slide-4', image: resultadoEncontrado, alt: 'Resultado encontrado', status: 'Resultado encontrado!', barWidth: 100 },
];

const FEATURES = [
  {
    icon: '🔬',
    title: 'OCR em Tempo Real',
    text: 'Reconhecimento automático de texto impresso e manuscrito. Funciona em lousa, livros, slides e documentos.',
  },
  {
    icon: '🔍',
    title: 'Pesquisa Instantânea',
    text: 'Sem copiar, sem trocar de app. Um toque e o Google já abriu com o texto detectado.',
  },
  {
    icon: '🌐',
    title: 'Tradutor Integrado',
    text: 'Detectou um texto em outra língua? Traduza instantaneamente direto pelo scanner.',
  },
  {
    icon: '📋',
    title: 'Copiar com 1 Toque',
    text: 'Copie qualquer trecho reconhecido para a área de transferência e use onde quiser.',
  },
  {
    icon: '🕓',
    title: 'Histórico de Scans',
    text: 'Todos os textos detectados ficam salvos para você acessar depois, sem precisar varrer novamente.',
  },
];

const STEPS = [
  { title: 'Abra o Scanner', text: 'Acesse a câmera OCR diretamente pelo app, sem configuração.' },
  { title: 'Envie uma imagem', text: 'Selecione do dispositivo o texto que deseja capturar.' },
  { title: 'Texto detectado', text: 'O sistema destaca automaticamente o conteúdo identificado na tela.' },
  { title: 'Escolha a ação', text: 'Pesquise no Google, copie, ou traduza com um único toque.' },
];

const USE_CASES = [
  'Anotações manuscritas',
  'Páginas de livros',
  'Slides de aula',
  'Lousa do professor',
  'Documentos impressos',
  'Artigos científicos',
  'Formulários e contratos',
  'Textos em outros idiomas',
];

export default function Home() {
  const pausedRef = useRef(false);

  // Smooth scroll for the in-page anchor links (footer + CTA "#como-funciona").
  useEffect(() => {
    function handleAnchorClick(e) {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <>
    <main>
      {/* HERO + SLIDESHOW */}
      <section
        className="hero"
        aria-label="Banner principal"
        onMouseEnter={() => { pausedRef.current = true; }}
        onMouseLeave={() => { pausedRef.current = false; }}
      >
        <Slideshow slides={SLIDES} pausedRef={pausedRef} />

        <div className="hero-overlay" aria-hidden="true"></div>

        <div className="hero-content">
          <h1>
            Transforme sua câmera em uma{' '}
            <span className="gradient-text">ferramenta de aprendizado</span>
          </h1>
          <p>
            Aponte para qualquer texto — livros, lousas, slides — e pesquise ou copie
            instantaneamente. Sem trocar de app.
          </p>
          <div className="hero-cta">
            <Link to="/camera" className="btn btn-primary">
              Abrir Scanner
            </Link>
            <a href="#como-funciona" className="btn btn-secondary">
              Como funciona
            </a>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section" aria-labelledby="features-title">
        <div className="section-inner">
          <header className="section-header">
            <span className="label">Funcionalidades</span>
            <h2 id="features-title">Tudo que você precisa para estudar com mais eficiência</h2>
            <p>Uma solução completa integrada à câmera do seu dispositivo.</p>
          </header>

          <div className="features-grid">
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.title} icon={feature.icon} title={feature.title}>
                {feature.text}
              </FeatureCard>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section steps" id="como-funciona" aria-labelledby="steps-title">
        <div className="section-inner">
          <header className="section-header">
            <span className="label">Passo a passo</span>
            <h2 id="steps-title">Simples assim</h2>
            <p>Em menos de 5 segundos você já está com a informação que precisava.</p>
          </header>

          <ol className="steps-list">
            {STEPS.map((step, index) => (
              <StepItem key={step.title} number={index + 1} title={step.title}>
                {step.text}
              </StepItem>
            ))}
          </ol>
        </div>
      </section>

      {/* USE CASES */}
      <section className="section" aria-labelledby="usecases-title">
        <div className="section-inner">
          <header className="section-header">
            <span className="label">Casos de uso</span>
            <h2 id="usecases-title">Feito para a vida universitária</h2>
            <p>Desenvolvido pensando nos cenários que estudantes enfrentam todos os dias.</p>
          </header>

          <div className="use-cases-grid" role="list">
            {USE_CASES.map((useCase) => (
              <div key={useCase} className="use-case-tag" role="listitem">
                {useCase}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section" aria-labelledby="cta-title">
        <div className="section-inner">
          <div className="cta-card">
            <h2 id="cta-title">Pronto para digitalizar textos com inteligência?</h2>
            <p>Acesse o scanner OCR e detecte texto em qualquer imagem com precisão.</p>
            <div className="cta-btns">
              <Link to="/camera" className="btn btn-primary">
                Abrir Scanner OCR
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
    <Footer />
    </>
  );
}
