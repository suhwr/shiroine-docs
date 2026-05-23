import React, { useState, useEffect, useRef } from 'react';
import {
  HashRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate
} from 'react-router-dom';
import {
  Search,
  Moon,
  Sun,
  Cpu,
  Download,
  Wrench,
  Shield,
  Key,
  Bot,
  Smile,
  Gamepad,
  Info,
  Users,
  Image as ImageIcon,
  CreditCard,
  User,
  Zap,
  BookOpen,
  Heart,
  History,
  Copy,
  Check,
  ChevronRight,
  Play,
  ArrowLeft,
  AlertCircle,
  FileCode,
  Sparkles
} from 'lucide-react';

// --- Icon Mapping helper for Categories ---
const getCategoryIcon = (iconName: string) => {
  const iconProps = { className: "w-6 h-6", strokeWidth: 2 };
  switch (iconName?.toLowerCase()) {
    case 'download': return <Download {...iconProps} />;
    case 'cpu': return <Cpu {...iconProps} />;
    case 'tool': return <Wrench {...iconProps} />;
    case 'shield': return <Shield {...iconProps} />;
    case 'key': return <Key {...iconProps} />;
    case 'bot': return <Bot {...iconProps} />;
    case 'smile': return <Smile {...iconProps} />;
    case 'gamepad': return <Gamepad {...iconProps} />;
    case 'info': return <Info {...iconProps} />;
    case 'users': return <Users {...iconProps} />;
    case 'image': return <ImageIcon {...iconProps} />;
    case 'credit-card': return <CreditCard {...iconProps} />;
    case 'user': return <User {...iconProps} />;
    case 'zap': return <Zap {...iconProps} />;
    default: return <BookOpen {...iconProps} />;
  }
};

// --- Debounce hook ---
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

// --- App Root View ---
export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'dark' | 'light') || 'dark';
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
  });

  const [recents, setRecents] = useState<Array<{ name: string; category: string }>>(() => {
    return JSON.parse(localStorage.getItem('recents') || '[]');
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const toggleFavorite = (cmdName: string) => {
    setFavorites(prev => {
      const updated = prev.includes(cmdName)
        ? prev.filter(n => n !== cmdName)
        : [...prev, cmdName];
      localStorage.setItem('favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const addRecent = (name: string, category: string) => {
    setRecents(prev => {
      const filtered = prev.filter(r => r.name !== name);
      const updated = [{ name, category }, ...filtered].slice(0, 5);
      localStorage.setItem('recents', JSON.stringify(updated));
      return updated;
    });
  };

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Router>
      <div className="app-container">
        {/* Header */}
        <header className="header">
          <Link to="/" className="logo">
            <Sparkles className="logo-icon" />
            <span>Shiroine Docs</span>
          </Link>
          <div className="nav-actions">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="nav-link"
              style={{ cursor: 'pointer' }}
            >
              <Search className="w-4 h-4" />
              <span>Search commands...</span>
              <kbd className="keyboard-shortcut">Ctrl+K</kbd>
            </button>
            <button onClick={toggleTheme} className="btn-action" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomeView favorites={favorites} recents={recents} />} />
          <Route path="/category/:catId" element={<CategoryView />} />
          <Route
            path="/command/:catId/:cmdName"
            element={
              <CommandDetailView
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                addRecent={addRecent}
              />
            }
          />
          <Route path="*" element={<NotFoundView />} />
        </Routes>

        {/* Global Search Modal Overlay */}
        {isSearchOpen && (
          <SearchOverlay onClose={() => setIsSearchOpen(false)} />
        )}
      </div>
    </Router>
  );
}

// --- Home View ---
function HomeView({ favorites, recents }: {
  favorites: string[];
  recents: Array<{ name: string; category: string }>;
}) {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('./docs/categories.json')
      .then(res => res.json())
      .then(data => {
        setCategories(data.categories || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading categories", err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div className="search-container">
        <div className="search-input-wrapper" onClick={() => {}}>
          <Search className="w-5 h-5 text-muted" />
          <span className="search-input-placeholder">Search for commands, aliases, tags...</span>
          <kbd className="keyboard-shortcut">Ctrl+K</kbd>
        </div>
      </div>

      {/* Categories Section */}
      <h2 className="section-title">
        <Cpu className="w-5 h-5 text-primary" />
        Categories
      </h2>
      
      {loading ? (
        <div className="grid-categories">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="glass-card category-card skeleton">
              <div className="category-icon-wrapper skeleton" style={{ background: 'transparent' }} />
              <div className="skeleton-title" />
              <div className="skeleton-text" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid-categories">
          {categories.map((cat: any) => (
            <Link to={`/category/${cat.id}`} key={cat.id} className="glass-card category-card">
              <div className="category-icon-wrapper">
                {getCategoryIcon(cat.icon)}
              </div>
              <h3 className="category-title">
                {cat.name}
                <ChevronRight className="w-5 h-5 text-muted" />
              </h3>
              <p className="category-desc">{cat.description}</p>
            </Link>
          ))}
        </div>
      )}

      {/* Recents & Favorites */}
      {(recents.length > 0 || favorites.length > 0) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '3rem' }}>
          {/* Favorites */}
          {favorites.length > 0 && (
            <div>
              <h2 className="section-title">
                <Heart className="w-5 h-5 text-danger" />
                Favorite Commands
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                {favorites.map(favName => (
                  <div key={favName} className="glass-card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600 }}>.{favName}</span>
                    {/* We need to locate the category, but search overlay has it or we search it, let's link by search */}
                    <Link to={`/command/general/${favName}`} className="btn-copy">
                      View
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recents */}
          {recents.length > 0 && (
            <div>
              <h2 className="section-title">
                <History className="w-5 h-5 text-accent" />
                Recently Viewed
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                {recents.map(rec => (
                  <div key={rec.name} className="glass-card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600 }}>.{rec.name}</span>
                    <Link to={`/command/${rec.category}/${rec.name}`} className="btn-copy">
                      View
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// --- Category Detail View ---
function CategoryView() {
  const { catId } = useParams();
  const [commands, setCommands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [catName, setCatName] = useState("");

  useEffect(() => {
    // Determine category name
    fetch('./docs/categories.json')
      .then(res => res.json())
      .then(data => {
        const found = data.categories.find((c: any) => c.id === catId);
        if (found) setCatName(found.name);
      })
      .catch(() => {});

    // Fetch index.json for category
    fetch(`./docs/${catId}/index.json`)
      .then(res => res.json())
      .then(data => {
        setCommands(data.commands || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading commands index", err);
        setLoading(false);
      });
  }, [catId]);

  return (
    <div>
      {/* Breadcrumb */}
      <div className="breadcrumbs">
        <Link to="/">Home</Link>
        <ChevronRight className="w-4 h-4 text-muted" />
        <span>{catName || catId}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <Link to="/" className="btn-action">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{catName || catId}</h1>
      </div>

      {loading ? (
        <div className="grid-commands">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="glass-card command-card skeleton">
              <div className="skeleton-title" />
              <div className="skeleton-text" />
              <div className="skeleton-text" style={{ width: '80%' }} />
            </div>
          ))}
        </div>
      ) : commands.length === 0 ? (
        <div className="empty-state">
          <AlertCircle className="empty-icon" />
          <h3>No commands found</h3>
          <p>There are no commands registered under this category yet.</p>
        </div>
      ) : (
        <div className="grid-commands">
          {commands.map((cmd: any) => (
            <Link to={`/command/${catId}/${cmd.name}`} key={cmd.name} className="glass-card command-card">
              <h3 className="command-card-title">
                .{cmd.name}
              </h3>
              <p className="command-card-desc">{cmd.description || "No description available."}</p>
              {cmd.tags && cmd.tags.length > 0 && (
                <div className="command-tags">
                  {cmd.tags.slice(0, 3).map((t: string) => (
                    <span key={t} className="badge-tag">{t}</span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Copy Button Component ---
function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={handleCopy} className="btn-copy">
      {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
      <span>{copied ? "Copied!" : label}</span>
    </button>
  );
}

// --- Simulated Mockup Preview for WhatsApp Msg Bubble ---
function ChatMockupPreview({ cmdName, details }: { cmdName: string; details: any }) {
  return (
    <div style={{
      background: '#0e121a',
      borderRadius: '1rem',
      padding: '1.5rem',
      border: '1px solid var(--border-color)',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
        <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600, textTransform: 'uppercase' }}>Simulated Output Bubble</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {/* Outgoing command request */}
        <div style={{ alignSelf: 'flex-end', background: '#075e54', color: '#fff', borderRadius: '8px 8px 0px 8px', padding: '0.6rem 1rem', maxWidth: '85%', fontSize: '0.9rem', boxShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
          .{cmdName} {details.examples?.[0] ? details.examples[0].replace(cmdName, "") : ""}
        </div>

        {/* Incoming bot response mockup */}
        <div style={{ alignSelf: 'flex-start', background: '#262d31', color: '#e1e9eb', borderRadius: '8px 8px 8px 0px', padding: '0.8rem 1rem', maxWidth: '85%', fontSize: '0.9rem', boxShadow: '0 1px 2px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {/* Header */}
          <div style={{ fontWeight: 'bold', color: '#a78bfa' }}>🤖 SHIROINE BOT</div>
          
          {/* Main Description */}
          <div>{details.description?.en || details.description?.id || "Processing request..."}</div>
          
          {/* Custom mock details depending on cmd */}
          {cmdName === 'tiktok' && (
            <div style={{ background: '#1a1f24', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', padding: '0.5rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#06b6d4', fontSize: '0.8rem' }}>
                <Play className="w-3 h-3 fill-current" /> Video Downloaded
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>👤 @creator_user</div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>🎵 original sound - creator</div>
            </div>
          )}

          {cmdName === 'ytmp3' && (
            <div style={{ background: '#1a1f24', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', padding: '0.5rem', marginTop: '0.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>Audio Transferred ✓</div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.2rem' }}>📂 ytmp3-download.mp3 (4.2 MB)</div>
            </div>
          )}

          {/* Limits warning */}
          {details.limitCost > 0 && (
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.4rem', marginTop: '0.4rem' }}>
              💎 Cost: {details.limitCost} Limit
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Command Detail View ---
function CommandDetailView({ favorites, toggleFavorite, addRecent }: {
  favorites: string[];
  toggleFavorite: (n: string) => void;
  addRecent: (name: string, category: string) => void;
}) {
  const { catId, cmdName } = useParams();
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    fetch(`./docs/${catId}/${cmdName}.json`)
      .then(res => res.json())
      .then(data => {
        setDetails(data);
        setLoading(false);
        addRecent(cmdName!, catId!);

        // Load related commands in category
        fetch(`./docs/${catId}/index.json`)
          .then(res => res.json())
          .then(catIndex => {
            const list = (catIndex.commands || [])
              .filter((c: any) => c.name !== cmdName)
              .slice(0, 3);
            setRelated(list);
          })
          .catch(() => {});
      })
      .catch(err => {
        console.error("Error loading command details", err);
        setLoading(false);
      });
  }, [catId, cmdName]);

  if (loading) {
    return (
      <div className="detail-layout">
        <div className="detail-main skeleton" style={{ height: '400px', borderRadius: '1.25rem' }} />
        <div className="detail-sidebar skeleton" style={{ height: '300px', borderRadius: '1.25rem' }} />
      </div>
    );
  }

  if (!details) {
    return (
      <div className="empty-state">
        <AlertCircle className="empty-icon" />
        <h3>Command Details Not Found</h3>
        <p>We couldn't retrieve metadata for the command: <strong>.{cmdName}</strong>.</p>
        <Link to="/" className="btn-copy" style={{ marginTop: '1rem' }}>Go Home</Link>
      </div>
    );
  }

  const isFavorite = favorites.includes(cmdName!);

  // Get keys to list dynamically (excluding default layout fields to show dynamic fields)
  const defaultKeys = [
    'name', 'aliases', 'category', 'description', 'usage', 'examples', 'permissions',
    'chatTypes', 'media', 'status', 'lastUpdated', 'source', 'limitCost', 'delaySeconds',
    'minArgs', 'requireMedia', 'customArgsMessage', 'display', 'showPromotion', 'nsfwOnly',
    'premiumOnly', 'level', 'commands'
  ];

  const dynamicFields = Object.keys(details).filter(k => !defaultKeys.includes(k));

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <Link to="/">Home</Link>
        <ChevronRight className="w-4 h-4 text-muted" />
        <Link to={`/category/${catId}`}>{catId}</Link>
        <ChevronRight className="w-4 h-4 text-muted" />
        <span>.{cmdName}</span>
      </div>

      {/* Main Header card */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>.{cmdName}</h1>
            {details.premiumOnly && (
              <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', background: 'var(--accent-glow)', border: '1px solid var(--accent)', color: 'var(--accent)', borderRadius: '9999px', fontWeight: 700 }}>
                ⭐ PREMIUM
              </span>
            )}
            {details.nsfwOnly && (
              <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: '9999px', fontWeight: 700 }}>
                🔞 NSFW ONLY
              </span>
            )}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', lineHeight: 1.6 }}>
            {details.description?.en || details.description?.id || "No description provided."}
          </p>
          {details.description?.id && details.description?.en && (
            <p style={{ fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              🇮🇩 {details.description.id}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => toggleFavorite(cmdName!)}
            className="btn-action"
            style={{ width: '2.75rem', height: '2.75rem', background: isFavorite ? 'var(--primary-glow)' : 'transparent', color: isFavorite ? 'var(--primary)' : 'inherit', border: isFavorite ? '1px solid var(--primary)' : '1px solid var(--border-color)' }}
            aria-label="Favorite command"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <CopyButton text={`.${cmdName}`} label="Copy Call" />
        </div>
      </div>

      {/* Main Details Grid Layout */}
      <div className="detail-layout">
        <div className="detail-main">
          {/* Usage block */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 className="section-title">
              <FileCode className="w-5 h-5 text-primary" />
              Usage Guide
            </h3>
            <div className="code-block-wrapper" style={{ marginTop: '1rem' }}>
              <span className="code-text">{details.usage || `.${cmdName}`}</span>
              <CopyButton text={details.usage || `.${cmdName}`} label="Copy Usage" />
            </div>
            
            {details.examples && details.examples.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Examples:</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {details.examples.map((ex: string, idx: number) => (
                    <div key={idx} className="code-block-wrapper" style={{ padding: '0.75rem 1rem', fontSize: '0.9rem' }}>
                      <span className="code-text" style={{ color: 'var(--text-secondary)' }}>.{ex}</span>
                      <CopyButton text={`.${ex}`} label="Copy Example" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Chat Output Mockup Preview */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 className="section-title">
              <Play className="w-5 h-5 text-accent" />
              Simulated Message Output
            </h3>
            <div style={{ marginTop: '1.25rem' }}>
              <ChatMockupPreview cmdName={cmdName!} details={details} />
            </div>
          </div>

          {/* Dynamic Extra Metadata fields (Reflection support) */}
          {dynamicFields.length > 0 && (
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 className="section-title">
                <Sparkles className="w-5 h-5 text-warning" />
                Plugin Extended Metadata
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.25rem' }}>
                {dynamicFields.map(key => {
                  const val = details[key];
                  let renderVal = "";
                  if (typeof val === 'object' && val !== null) {
                    renderVal = JSON.stringify(val);
                  } else {
                    renderVal = String(val);
                  }
                  return (
                    <div key={key} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span style={{ fontFamily: varKeyType(val) ? 'var(--font-mono)' : 'inherit', color: 'var(--text-primary)' }}>
                        {renderVal}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="detail-sidebar">
          {/* Metadata properties Card */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 className="section-title">Specifications</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.25rem' }}>
              <div className="meta-item">
                <span className="meta-label">Cooldown</span>
                <span className="meta-value">{details.delaySeconds || 0} seconds</span>
              </div>

              <div className="meta-item">
                <span className="meta-label">Limit Cost</span>
                <span className="meta-value">{details.limitCost || 0} limit</span>
              </div>

              <div className="meta-item">
                <span className="meta-label">Min Arguments</span>
                <span className="meta-value">{details.minArgs || 0}</span>
              </div>

              {details.requireMedia && (
                <div className="meta-item">
                  <span className="meta-label">Required Media</span>
                  <span className="meta-value">{details.requireMedia}</span>
                </div>
              )}

              {details.level > 0 && (
                <div className="meta-item">
                  <span className="meta-label">Required Level</span>
                  <span className="meta-value">LV. {details.level}</span>
                </div>
              )}
            </div>
          </div>

          {/* Related commands */}
          {related.length > 0 && (
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 className="section-title">Related Commands</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.25rem' }}>
                {related.map(rel => (
                  <Link
                    key={rel.name}
                    to={`/command/${catId}/${rel.name}`}
                    className="glass-card"
                    style={{ padding: '0.8rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.95rem' }}
                  >
                    <span style={{ fontWeight: 600 }}>.{rel.name}</span>
                    <ChevronRight className="w-4 h-4 text-muted" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helpers
const varKeyType = (val: any) => {
  return typeof val === 'object' || typeof val === 'boolean' || typeof val === 'number';
};

// --- Not Found View ---
function NotFoundView() {
  return (
    <div className="empty-state" style={{ marginTop: '2rem' }}>
      <AlertCircle className="empty-icon" style={{ color: 'var(--danger)' }} />
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>404</h1>
      <h3>Page Not Found</h3>
      <p>The documentation page you requested does not exist or has been moved.</p>
      <Link to="/" className="btn-copy" style={{ marginTop: '1.5rem' }}>
        Back to Home
      </Link>
    </div>
  );
}

// --- Search Overlay Modal ---
function SearchOverlay({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 150);
  const [results, setResults] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input automatically on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Fetch search index and filter
  useEffect(() => {
    if (debouncedQuery.trim() === "") {
      setResults([]);
      return;
    }

    fetch('./docs/search.json')
      .then(res => res.json())
      .then(data => {
        const queryLower = debouncedQuery.toLowerCase();
        const filtered = (data.commands || []).filter((cmd: any) => {
          return (
            cmd.name.toLowerCase().includes(queryLower) ||
            (cmd.aliases && cmd.aliases.some((a: string) => a.toLowerCase().includes(queryLower))) ||
            (cmd.tags && cmd.tags.some((t: string) => t.toLowerCase().includes(queryLower))) ||
            cmd.category.toLowerCase().includes(queryLower)
          );
        });
        setResults(filtered.slice(0, 8)); // Limit to top 8
        setSelectedIndex(0);
      })
      .catch(err => {
        console.error("Error matching search results", err);
      });
  }, [debouncedQuery]);

  // Keyboard navigation inside search results (ArrowUp, ArrowDown, Enter)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, results.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % Math.max(1, results.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        const item = results[selectedIndex];
        navigate(`/command/${item.category}/${item.name}`);
        onClose();
      }
    }
  };

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-modal" onClick={e => e.stopPropagation()}>
        <div className="search-modal-header">
          <Search className="w-5 h-5 text-muted" />
          <input
            ref={inputRef}
            type="text"
            className="search-modal-input"
            placeholder="Search commands, aliases, categories..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <kbd className="keyboard-shortcut" style={{ cursor: 'pointer' }} onClick={onClose}>ESC</kbd>
        </div>

        {results.length > 0 ? (
          <div className="search-results">
            {results.map((item, idx) => (
              <div
                key={item.name}
                className={`search-result-item ${idx === selectedIndex ? 'selected' : ''}`}
                onClick={() => {
                  navigate(`/command/${item.category}/${item.name}`);
                  onClose();
                }}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <div className="search-result-info">
                  <span className="search-result-name">
                    .{item.name}
                    {item.aliases && item.aliases.length > 0 && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                        (aliases: {item.aliases.join(', ')})
                      </span>
                    )}
                  </span>
                  <span className="search-result-cat">{item.category}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted" />
              </div>
            ))}
          </div>
        ) : query.trim() !== "" ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No commands matching "{query}" found.
          </div>
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Type a command name, alias, or keyword to search...
          </div>
        )}
      </div>
    </div>
  );
}
