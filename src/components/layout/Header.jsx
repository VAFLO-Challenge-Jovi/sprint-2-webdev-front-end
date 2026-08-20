import { useEffect, useRef, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

/**
 * Shared navbar + mobile hamburger menu, rendered on every page except Login
 * (mirrors the original: index.html, camera.html and history.html all shared
 * the exact same <header>/<nav> markup, login.html had none).
 */
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const navLinkClass = ({ isActive }) => (isActive ? 'active' : undefined);

  return (
    <header ref={headerRef}>
      <nav className="navbar">
        <div className="nav-inner">
          <Link to="/" className="nav-logo">
            <span>
              Seek<em>Vision</em>
            </span>
          </Link>

          <ul className="nav-links">
            <li>
              <NavLink to="/" end className={navLinkClass}>
                Início
              </NavLink>
            </li>
            <li>
              <NavLink to="/camera" className={navLinkClass}>
                Scanner
              </NavLink>
            </li>
            <li>
              <NavLink to="/history" className={navLinkClass}>
                Histórico
              </NavLink>
            </li>
            <li>
              <Link to="/login" className="btn btn-primary">
                Entrar
              </Link>
            </li>
          </ul>

          <button
            className={`hamburger${menuOpen ? ' open' : ''}`}
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      <nav className={`mobile-menu${menuOpen ? ' open' : ''}`} aria-label="Menu mobile">
        <NavLink to="/" end className={navLinkClass} onClick={() => setMenuOpen(false)}>
          Início
        </NavLink>
        <NavLink to="/camera" className={navLinkClass} onClick={() => setMenuOpen(false)}>
          Scanner OCR
        </NavLink>
        <NavLink to="/history" className={navLinkClass} onClick={() => setMenuOpen(false)}>
          Histórico
        </NavLink>
      </nav>
    </header>
  );
}
