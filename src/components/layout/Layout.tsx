import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Moon, Sun, LayoutDashboard, Terminal, ExternalLink } from 'lucide-react';
import { SearchModal } from '../search/SearchModal';

export function Layout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return (savedTheme as 'dark' | 'light') || 'dark';
    }
    return 'dark';
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
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
    const handleOpenSearch = () => setIsSearchOpen(true);
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-search', handleOpenSearch);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-search', handleOpenSearch);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Background ambient light */}
      <div className="bg-ambient" />

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/90 backdrop-blur-md transition-colors duration-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          
          {/* Logo Brand */}
          <Link
            to="/"
            className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg py-1"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/80 bg-surface shadow-2xs text-primary group-hover:border-primary/60 transition-colors">
              <Terminal className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                  Shiroine
                </span>
                <span className="rounded-md border border-primary/30 bg-primary/10 px-1.5 py-0.2 text-[10px] font-mono font-semibold uppercase text-primary">
                  Docs
                </span>
              </div>
            </div>
          </Link>

          {/* Search Trigger Bar */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="hidden md:flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl border border-border bg-surface text-xs sm:text-sm text-muted-foreground hover:border-primary/50 hover:bg-muted/60 transition-all duration-150 w-64 lg:w-80 shadow-2xs cursor-pointer"
            aria-label="Cari dokumentasi"
          >
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <span>Cari perintah atau topik...</span>
            </div>
            <kbd className="inline-flex items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono font-medium text-muted-foreground">
              Ctrl K
            </kbd>
          </button>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search Button */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Cari"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Link to main Dashboard */}
            <a
              href="https://www.shiroine.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 h-9 text-xs sm:text-sm font-semibold rounded-lg border border-border bg-surface hover:bg-muted text-foreground transition-colors shadow-2xs"
            >
              <LayoutDashboard className="h-4 w-4 text-primary shrink-0" />
              <span className="hidden sm:inline">Dashboard</span>
              <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
            </a>

            {/* Theme Switcher */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              aria-label="Ganti tema tampilan"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-surface/50 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Left side brand info */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-foreground">Shiroine Bot</span>
                <span className="text-xs text-muted-foreground">• Dokumentasi & Registri Perintah</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Sistem dokumentasi otomasi dan panduan integrasi resmi untuk ekosistem Shiroine.
              </p>
            </div>

            {/* Right side navigation links */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-muted-foreground">
              <a
                href="https://www.shiroine.com/"
                className="hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Beranda
              </a>
              <span>•</span>
              <a
                href="https://www.shiroine.com/dashboard/tickets"
                className="hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Pusat Bantuan
              </a>
              <span>•</span>
              <a
                href="https://www.shiroine.com/terms-of-service"
                className="hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ketentuan Layanan
              </a>
              <span>•</span>
              <a
                href="https://www.shiroine.com/privacy-policy"
                className="hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Kebijakan Privasi
              </a>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border/40 text-center text-xs text-muted-foreground">
            © 2026 Shiroine. Seluruh hak cipta dilindungi undang-undang.
          </div>
        </div>
      </footer>

      {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} />}
    </div>
  );
}
