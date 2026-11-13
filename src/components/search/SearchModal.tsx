import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, CornerDownLeft, Sparkles } from 'lucide-react';

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

interface CommandSearchItem {
  name: string;
  category: string;
  description?: string;
  aliases?: string[];
  tags?: string[];
  premiumOnly?: boolean;
}

export function SearchModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 120);
  const [results, setResults] = useState<CommandSearchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [allCommands, setAllCommands] = useState<CommandSearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    setLoading(true);
    fetch('./docs/search.json')
      .then(res => res.json())
      .then(data => {
        setAllCommands(data.commands || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Gagal memuat data pencarian:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (debouncedQuery.trim() === '') {
      setResults([]);
      return;
    }

    const q = debouncedQuery.toLowerCase().trim().replace(/^\./, '');
    const filtered = allCommands.filter((cmd) => {
      const nameMatch = cmd.name?.toLowerCase().includes(q);
      const aliasMatch = cmd.aliases && cmd.aliases.some((a) => a?.toLowerCase().includes(q));
      const tagMatch = cmd.tags && cmd.tags.some((t) => t?.toLowerCase().includes(q));
      const catMatch = cmd.category?.toLowerCase().includes(q);
      const descMatch = typeof cmd.description === 'string' && cmd.description.toLowerCase().includes(q);
      return nameMatch || aliasMatch || tagMatch || catMatch || descMatch;
    });

    setResults(filtered.slice(0, 15));
    setSelectedIndex(0);
  }, [debouncedQuery, allCommands]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((p) => (p + 1) % Math.max(1, results.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((p) => (p - 1 + results.length) % Math.max(1, results.length));
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
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center bg-background/80 backdrop-blur-sm px-4 pt-16 sm:pt-24 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-layer-2 animate-in zoom-in-95 duration-150 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-border bg-surface px-4 py-3.5">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Cari perintah, alias, tag, atau kategori..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm sm:text-base font-normal text-foreground placeholder:text-muted-foreground outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Bersihkan pencarian"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono font-medium text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {loading && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Memuat indeks perintah...
            </div>
          )}

          {!loading && query.trim() === '' && (
            <div className="p-8 text-center">
              <p className="text-sm font-medium text-muted-foreground">
                Ketik nama perintah (contoh: <code className="font-mono text-primary">menu</code>, <code className="font-mono text-primary">ai</code>, <code className="font-mono text-primary">sticker</code>)
              </p>
              <p className="mt-1 text-xs text-muted-foreground/80">
                Total {allCommands.length} perintah tersedia dalam registry.
              </p>
            </div>
          )}

          {!loading && query.trim() !== '' && results.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Tidak ada perintah yang sesuai dengan kueri "{query}".
            </div>
          )}

          {results.map((r, i) => {
            const isSelected = i === selectedIndex;
            return (
              <div
                key={`${r.category}-${r.name}`}
                onClick={() => {
                  navigate(`/command/${r.category}/${r.name}`);
                  onClose();
                }}
                onMouseEnter={() => setSelectedIndex(i)}
                className={`group flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 cursor-pointer transition-colors duration-150 ${
                  isSelected
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-foreground hover:bg-muted/70 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border font-mono text-xs font-semibold ${
                      isSelected
                        ? 'border-primary/40 bg-primary/20 text-primary'
                        : 'border-border bg-surface text-muted-foreground group-hover:text-foreground'
                    }`}
                  >
                    .
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold truncate">
                        .{r.name}
                      </span>
                      {r.premiumOnly && (
                        <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          <Sparkles className="h-2.5 w-2.5" /> Premium
                        </span>
                      )}
                    </div>
                    {r.aliases && r.aliases.length > 0 && (
                      <p className="text-xs text-muted-foreground truncate">
                        Alias: {r.aliases.join(', ')}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="rounded-md border border-border/60 bg-surface px-2 py-0.5 text-[11px] font-mono font-medium text-muted-foreground uppercase">
                    {r.category}
                  </span>
                  {isSelected && (
                    <CornerDownLeft className="h-3.5 w-3.5 text-primary" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Keyboard Hints Footer */}
        <div className="flex items-center justify-between border-t border-border bg-surface/70 px-4 py-2.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">↑</kbd>
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">↓</kbd>
              <span>Navigasi</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">↵</kbd>
              <span>Buka</span>
            </span>
          </div>
          <span className="font-mono text-[11px]">{results.length} hasil</span>
        </div>
      </div>
    </div>
  );
}
