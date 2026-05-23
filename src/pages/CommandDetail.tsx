import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Heart, ChevronRight, AlertCircle, Play, TerminalSquare, Info } from 'lucide-react';
import { CopyButton } from '../components/ui/CopyButton';
import { ArgumentsBuilder } from '../components/command/ArgumentsBuilder';
import { SimulatedChat } from '../components/command/SimulatedChat';

export function CommandDetail({ favorites, toggleFavorite, addRecent }: {
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
        if (cmdName && catId) addRecent(cmdName, catId);

        fetch(`./docs/${catId}/index.json`)
          .then(res => res.json())
          .then(catIndex => {
            const list = (catIndex.commands || [])
              .filter((c: any) => c.name !== cmdName)
              .slice(0, 4);
            setRelated(list);
          }).catch(() => {});
      }).catch(() => setLoading(false));
  }, [catId, cmdName]);

  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div className="card skeleton" style={{ height: '400px' }} />
        <div className="card skeleton" style={{ height: '300px' }} />
      </div>
    );
  }

  if (!details) {
    return (
      <div className="card flex-center" style={{ flexDirection: 'column', padding: '4rem 2rem', gap: '1rem', marginTop: '2rem' }}>
        <AlertCircle className="w-10 h-10 text-danger" />
        <h3 style={{ fontSize: '1.25rem' }}>Command Not Found</h3>
        <p className="text-secondary">Could not retrieve metadata for .{cmdName}</p>
        <Link to="/" className="btn" style={{ marginTop: '1rem' }}>Go Home</Link>
      </div>
    );
  }

  const isFavorite = favorites.includes(cmdName!);

  return (
    <div>
      <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '0.5rem', marginBottom: '2rem', fontSize: '0.9rem' }}>
        <Link to="/" className="text-secondary hover:text-primary">Home</Link>
        <ChevronRight className="w-4 h-4 text-muted" />
        <Link to={`/category/${catId}`} className="text-secondary hover:text-primary" style={{ textTransform: 'capitalize' }}>{catId}</Link>
        <ChevronRight className="w-4 h-4 text-muted" />
        <span className="text-primary">.{cmdName}</span>
      </div>

      <div className="card" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>.{cmdName}</h1>
            {details.premiumOnly && <span className="badge badge-warning">⭐ PREMIUM</span>}
            {details.nsfwOnly && <span className="badge badge-danger">🔞 NSFW</span>}
          </div>
          <p className="text-secondary" style={{ fontSize: '1.1rem', maxWidth: '700px', lineHeight: 1.6 }}>
            {details.description?.en || details.description?.id || "No description provided."}
          </p>
          {details.description?.id && details.description?.en && (
            <p className="text-muted" style={{ fontStyle: 'italic', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              🇮🇩 {details.description.id}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => toggleFavorite(cmdName!)} className="btn-icon card card-interactive flex-center" style={{ width: '44px', height: '44px', color: isFavorite ? 'var(--danger)' : 'var(--text-muted)', background: isFavorite ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-card)' }}>
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <CopyButton text={`.${cmdName}`} label="Copy" className="card card-interactive" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem' }} className="responsive-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 className="section-title"><TerminalSquare className="w-5 h-5 text-primary" /> Usage</h3>
            <div className="code-block flex-between" style={{ marginTop: '1rem' }}>
              <span>{details.usage || `.${cmdName}`}</span>
              <CopyButton text={details.usage || `.${cmdName}`} />
            </div>
            {details.examples && details.examples.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Examples:</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
                  {details.examples.map((ex: string, idx: number) => (
                    <div key={idx} className="code-block flex-between" style={{ padding: '0.75rem 1rem' }}>
                      <span className="text-secondary">.{ex}</span>
                      <CopyButton text={`.${ex}`} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 className="section-title"><Play className="w-5 h-5 text-accent" /> Simulated Output</h3>
            <div style={{ marginTop: '1rem' }}>
              <SimulatedChat cmdName={cmdName!} details={details} />
            </div>
          </div>

        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 className="section-title"><Info className="w-5 h-5 text-primary" /> Specifications</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                <span className="text-secondary">Cooldown</span>
                <span style={{ fontWeight: 600 }}>{details.delaySeconds || 0}s</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                <span className="text-secondary">Limit Cost</span>
                <span style={{ fontWeight: 600 }}>{details.limitCost || 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                <span className="text-secondary">Min Args</span>
                <span style={{ fontWeight: 600 }}>{details.minArgs || 0}</span>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <ArgumentsBuilder details={details} />
            </div>
          </div>

          {related.length > 0 && (
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 className="section-title">Related</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                {related.map(r => (
                  <Link key={r.name} to={`/command/${catId}/${r.name}`} className="card card-interactive flex-between" style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>.{r.name}</span>
                    <ChevronRight className="w-4 h-4 text-muted" />
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .responsive-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
