import { motion, useReducedMotion } from 'motion/react';
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function SiteLayout({ children }) {
  const prefersReducedMotion = useReducedMotion();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      return;
    }

    const targetId = location.hash.replace('#', '');
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    }
  }, [location.pathname, location.hash, prefersReducedMotion]);

  return (
    <>
      <motion.nav
        className="navbar"
        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="nav-container">
          <div className="logo">
            <img className="logo-icon" src="/qortana-logo.png" alt="The Conviction Index logo" />
            <div className="logo-text">
              <span className="logo-title">The Conviction Index</span>
              <span className="logo-byline">by qortana</span>
            </div>
          </div>
          <div className="nav-links">
            <Link to="/problem">Problem</Link>
            <Link to="/method">Method</Link>
            <Link to="/brief">What You Get</Link>
            <Link to="/people">People</Link>
            <Link to="/moment">The Moment</Link>
            <Link className="nav-cta" to={isHome ? '#join' : '/#join'}>Join Now</Link>
          </div>
        </div>
      </motion.nav >

      {children}

      < footer className="footer" >
        <div className="container">
          <p>&copy; 2025 the conviction index. All rights reserved.</p>
        </div>
      </footer >
    </>
  );
}
