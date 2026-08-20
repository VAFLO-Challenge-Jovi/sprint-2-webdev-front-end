import { Link } from 'react-router-dom';

/**
 * Only rendered on the Home page, exactly like the original project — camera.html,
 * history.html and login.html never included a <footer>.
 */
export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="nav-logo">
              <span>
                Seek<em>Vision</em>
              </span>
            </Link>
            <p>OCR inteligente integrado à câmera, pensado para estudantes universitários.</p>
          </div>

          <nav className="footer-nav" aria-label="Links do site">
            <h4>Páginas</h4>
            <ul>
              <li>
                <Link to="/">Início</Link>
              </li>
              <li>
                <Link to="/camera">Scanner OCR</Link>
              </li>
            </ul>
          </nav>

          <nav className="footer-nav" aria-label="Recursos">
            <h4>Recursos</h4>
            <ul>
              <li>
                <a href="#como-funciona">Como funciona</a>
              </li>
              <li>
                <a href="#features-title">Funcionalidades</a>
              </li>
              <li>
                <a href="#usecases-title">Casos de uso</a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="footer-bottom">
          <span>© 2026 SeekVision — Challenge JOVI</span>
          <span>Sprint 3 · WebDev &amp; Front-End</span>
        </div>
      </div>
    </footer>
  );
}
