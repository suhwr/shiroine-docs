import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Search, Moon, Sun } from 'lucide-react';
import { SearchModal } from '../search/SearchModal';

export function Layout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="app-container">
      <header className="flex-between" style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
        <Link to="/" className="flex-center gap-2" style={{ fontWeight: 700, fontSize: '1.25rem' }}>
          <Sparkles className="text-primary w-6 h-6" />
          <span>Shiroine Docs</span>
        </Link>
        <div className="flex-center gap-2">
          {/* Mobile search toggle */}
          <button className="btn-icon" onClick={() => setIsSearchOpen(true)} aria-label="Search" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Search className="w-5 h-5" />
            <span className="text-muted" style={{ fontSize: '0.8rem', display: 'none' }} id="desktop-search-hint">Ctrl+K</span>
          </button>
          <button className="btn-icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <main style={{ flexGrow: 1 }}>
        {children}
      </main>

      {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} />}
      
      <style>{`
        @media (min-width: 640px) {
          #desktop-search-hint { display: inline-block !important; }
        }
      `}</style>
    </div>
  );
}
