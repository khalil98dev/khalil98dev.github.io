import { Link } from 'react-router-dom';
import { Icon } from './Icon';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <div className="footer__brand">Khalil Bachir</div>
          <p className="muted small">Backend .NET Developer · Sétif, Algeria</p>
        </div>
        <nav className="footer__links">
          <Link to="/">Overview</Link>
          <Link to="/certifications">Certifications</Link>
          <a href="https://github.com/khalil98dev" target="_blank" rel="noreferrer">
            <Icon name="github" size={16} /> GitHub
          </a>
          <a href="https://linkedin.com/in/khalilbachir" target="_blank" rel="noreferrer">
            <Icon name="linkedin" size={16} /> LinkedIn
          </a>
        </nav>
      </div>
      <div className="container footer__legal small muted">© {new Date().getFullYear()} Khalil Bachir. Crafted with React.</div>
    </footer>
  );
}
