import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Heart, History, ChevronRight, Search } from 'lucide-react';

export function Home({ favorites, recents }: { favorites: Array<{name: string, category: string}>, recents: any[] }) {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('./docs/categories.json')
      .then(res => res.json())
      .then(data => {
        setCategories(data.categories || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="animate-enter">
      <div style={{ maxWidth: '600px', margin: '0 auto 3rem', textAlign: 'center' }} className="animate-enter stagger-1">
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }} className="text-gradient">
          Documentation Hub
        </h1>
        <p className="text-secondary" style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
          Explore commands, plugins, and integration guides.
        </p>
        <div 
          className="search-input-wrapper card card-interactive" 
          style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
          onClick={() => window.dispatchEvent(new CustomEvent('open-search'))}
        >
          <Search className="text-muted w-5 h-5" />
          <span className="text-muted" style={{ flexGrow: 1, textAlign: 'left' }}>Search commands...</span>
          <kbd style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'var(--bg-body)', borderRadius: '4px', color: 'var(--text-muted)' }}>Ctrl K</kbd>
        </div>
      </div>

      <div className="section-title animate-enter stagger-2">
        <Cpu className="text-primary w-5 h-5" />
        Browse Categories
      </div>
      
      {loading ? (
        <div className="grid-cols-auto animate-enter stagger-3" style={{ marginTop: '1.5rem' }}>
          {[1,2,3,4].map(n => <div key={n} className="card skeleton" style={{ height: '140px' }} />)}
        </div>
      ) : (
        <div className="grid-cols-auto animate-enter stagger-3" style={{ marginTop: '1.5rem' }}>
          {categories.map((cat, idx) => (
            <Link to={`/category/${cat.id}`} key={cat.id} viewTransition className={`card card-interactive animate-enter`} style={{ animationDelay: `${0.15 + (idx * 0.05)}s`, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{cat.name}</span>
                <ChevronRight className="text-muted w-5 h-5" />
              </div>
              <p className="text-secondary" style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>{cat.description}</p>
            </Link>
          ))}
        </div>
      )}

      {(recents.length > 0 || favorites.length > 0) && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
          {favorites.length > 0 && (
            <div>
              <div className="section-title">
                <Heart className="text-danger w-5 h-5" />
                Favorites
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                {favorites.map(f => (
                  <div key={f.name} className="card flex-between animate-enter" style={{ padding: '1rem 1.25rem' }}>
                    <span style={{ fontWeight: 600 }}>.{f.name}</span>
                    <Link to={`/command/${f.category}/${f.name}`} viewTransition className="btn">View</Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {recents.length > 0 && (
            <div>
              <div className="section-title">
                <History className="text-accent w-5 h-5" />
                Recently Viewed
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                {recents.map(r => (
                  <div key={r.name} className="card flex-between animate-enter" style={{ padding: '1rem 1.25rem' }}>
                    <span style={{ fontWeight: 600 }}>.{r.name}</span>
                    <Link to={`/command/${r.category}/${r.name}`} viewTransition className="btn">View</Link>
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
