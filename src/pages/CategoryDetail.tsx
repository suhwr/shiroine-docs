import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronRight, AlertCircle } from 'lucide-react';

export function CategoryDetail() {
  const { catId } = useParams();
  const [commands, setCommands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [catName, setCatName] = useState("");

  useEffect(() => {
    fetch('./docs/categories.json')
      .then(res => res.json())
      .then(data => {
        const found = data.categories.find((c: any) => c.id === catId);
        if (found) setCatName(found.name);
      }).catch(() => {});

    fetch(`./docs/${catId}/index.json`)
      .then(res => res.json())
      .then(data => {
        setCommands(data.commands || []);
        setLoading(false);
      }).catch(() => setLoading(false));
  }, [catId]);

  return (
    <div className="animate-enter">
      <div className="flex-center animate-enter stagger-1" style={{ justifyContent: 'flex-start', gap: '0.5rem', marginBottom: '2rem', fontSize: '0.9rem' }}>
        <Link to="/" viewTransition className="text-secondary hover:text-primary">Home</Link>
        <ChevronRight className="w-4 h-4 text-muted" />
        <span className="text-primary">{catName || catId}</span>
      </div>

      <div className="flex-center animate-enter stagger-2" style={{ justifyContent: 'flex-start', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/" viewTransition className="btn-icon card card-interactive">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, textTransform: 'capitalize' }} className="text-gradient">{catName || catId} Commands</h1>
      </div>

      {loading ? (
        <div className="grid-cols-auto animate-enter stagger-3">
          {[1,2,3,4,5,6].map(n => <div key={n} className="card skeleton" style={{ height: '120px' }} />)}
        </div>
      ) : commands.length === 0 ? (
        <div className="card flex-center animate-enter stagger-3" style={{ flexDirection: 'column', padding: '4rem 2rem', gap: '1rem' }}>
          <AlertCircle className="w-10 h-10 text-muted" />
          <h3 className="text-secondary">No commands found</h3>
        </div>
      ) : (
        <div className="grid-cols-auto animate-enter stagger-3">
          {commands.map((cmd: any, idx: number) => (
            <Link to={`/command/${catId}/${cmd.name}`} key={cmd.name} viewTransition className="card card-interactive animate-enter" style={{ animationDelay: `${0.15 + (idx * 0.05)}s`, padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>.{cmd.name}</div>
              <div className="text-secondary" style={{ fontSize: '0.9rem', marginBottom: '1rem', flexGrow: 1 }}>{cmd.description || "No description"}</div>
              {cmd.tags && (
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {cmd.tags.slice(0, 3).map((t: string) => (
                    <span key={t} className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{t}</span>
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
