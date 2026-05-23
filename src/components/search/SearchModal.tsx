import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export function SearchModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 150);
  const [results, setResults] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (debouncedQuery.trim() === "") {
      setResults([]);
      return;
    }
    fetch('./docs/search.json')
      .then(res => res.json())
      .then(data => {
        const q = debouncedQuery.toLowerCase();
        const filtered = (data.commands || []).filter((cmd: any) => {
          return (
            cmd.name.toLowerCase().includes(q) ||
            (cmd.aliases && cmd.aliases.some((a: string) => a.toLowerCase().includes(q))) ||
            (cmd.tags && cmd.tags.some((t: string) => t.toLowerCase().includes(q))) ||
            cmd.category.toLowerCase().includes(q)
          );
        });
        setResults(filtered.slice(0, 10));
        setSelectedIndex(0);
      })
      .catch(console.error);
  }, [debouncedQuery]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(p => (p + 1) % Math.max(1, results.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(p => (p - 1 + results.length) % Math.max(1, results.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        const item = results[selectedIndex];
        navigate(`/command/${item.category}/${item.name}`);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="search-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      zIndex: 9999, display: 'flex', justifyContent: 'center', paddingTop: '10vh'
    }} onClick={onClose}>
      <div className="search-modal" style={{
        width: '100%', maxWidth: '600px', margin: '0 1rem', maxHeight: '70vh', height: 'fit-content',
        background: 'var(--bg-main)', borderRadius: '16px', border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-hover)', display: 'flex', flexDirection: 'column'
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem', borderBottom: '1px solid var(--border-color)' }}>
          <Search className="w-5 h-5 text-muted" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search commands..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ flexGrow: 1, fontSize: '1.1rem', background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)' }}
          />
        </div>
        <div style={{ overflowY: 'auto', padding: '0.5rem', maxHeight: '50vh' }}>
          {results.map((r, i) => (
            <div
              key={r.name}
              onClick={() => {
                navigate(`/command/${r.category}/${r.name}`);
                onClose();
              }}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.75rem 1rem', cursor: 'pointer', borderRadius: '8px',
                background: i === selectedIndex ? 'var(--bg-card-hover)' : 'transparent',
                color: i === selectedIndex ? 'var(--text-primary)' : 'var(--text-secondary)'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>.{r.name}</span>
                {r.aliases?.length > 0 && <span style={{ fontSize: '0.8rem' }}>Also: {r.aliases.join(', ')}</span>}
              </div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>{r.category}</span>
            </div>
          ))}
          {query && results.length === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No results found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
