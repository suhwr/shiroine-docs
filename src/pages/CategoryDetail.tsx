import { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronRight,
  Search,
  Sparkles,
  Shield,
  Layers,
  X,
} from 'lucide-react';
import { CopyButton } from '../components/ui/CopyButton';

interface CommandSummary {
  name: string;
  description?: string;
  premiumOnly?: boolean;
  permissions?: {
    owner?: boolean;
    subowner?: boolean;
    admin?: boolean;
    bot?: boolean;
    hasbot?: boolean;
    [key: string]: any;
  };
  tags?: string[];
}

export function CategoryDetail() {
  const { catId } = useParams();
  const [commands, setCommands] = useState<CommandSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [catName, setCatName] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [permissionFilter, setPermissionFilter] = useState<'all' | 'premium' | 'admin' | 'owner'>('all');

  useEffect(() => {
    fetch('./docs/categories.json')
      .then((res) => res.json())
      .then((data) => {
        const found = data.categories?.find((c: any) => c.id === catId);
        if (found) setCatName(found.name);
      })
      .catch(() => {});

    fetch(`./docs/${catId}/index.json`)
      .then((res) => res.json())
      .then((data) => {
        setCommands(data.commands || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [catId]);

  const filteredCommands = useMemo(() => {
    return commands.filter((cmd) => {
      // Permission filter
      if (permissionFilter === 'premium' && !cmd.premiumOnly) return false;
      if (permissionFilter === 'admin' && !cmd.permissions?.admin) return false;
      if (permissionFilter === 'owner' && !cmd.permissions?.owner) return false;

      // Search query
      if (filterQuery.trim()) {
        const q = filterQuery.toLowerCase().trim().replace(/^\./, '');
        const nameMatch = cmd.name?.toLowerCase().includes(q);
        const descMatch = cmd.description?.toLowerCase().includes(q);
        const tagMatch = cmd.tags?.some((t) => t.toLowerCase().includes(q));
        return nameMatch || descMatch || tagMatch;
      }
      return true;
    });
  }, [commands, filterQuery, permissionFilter]);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground"
      >
        <Link to="/" className="hover:text-primary transition-colors">
          Beranda
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium capitalize">
          {catName || catId}
        </span>
      </nav>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/80">
        <div className="flex items-center gap-3.5">
          <Link
            to="/"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-foreground hover:bg-muted hover:border-primary/50 transition-colors shadow-2xs"
            aria-label="Kembali ke beranda"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground capitalize">
              {catName || catId}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Total {commands.length} perintah dalam kategori ini.
            </p>
          </div>
        </div>

        {/* In-category Search Filter */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Saring perintah kategori..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface pl-9 pr-8 py-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60 transition-colors shadow-2xs"
          />
          {filterQuery && (
            <button
              onClick={() => setFilterQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Hapus filter"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setPermissionFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            permissionFilter === 'all'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'border border-border bg-surface text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          Semua ({commands.length})
        </button>
        <button
          onClick={() => setPermissionFilter('premium')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            permissionFilter === 'premium'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'border border-border bg-surface text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          <Sparkles className="h-3 w-3" />
          Premium
        </button>
        <button
          onClick={() => setPermissionFilter('admin')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            permissionFilter === 'admin'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'border border-border bg-surface text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          <Shield className="h-3 w-3" />
          Admin
        </button>
        <button
          onClick={() => setPermissionFilter('owner')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            permissionFilter === 'owner'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'border border-border bg-surface text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          <Shield className="h-3 w-3" />
          Owner
        </button>
      </div>

      {/* Commands Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-36 rounded-2xl border border-border/60 bg-card/60 animate-pulse"
            />
          ))}
        </div>
      ) : filteredCommands.length === 0 ? (
        <div className="rounded-2xl border border-border/80 bg-card p-12 text-center space-y-3 shadow-layer-1">
          <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <Layers className="h-6 w-6" />
          </div>
          <h3 className="font-display text-base font-bold text-foreground">
            Tidak ada perintah yang ditemukan
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
            {filterQuery
              ? `Tidak ada hasil yang cocok dengan kueri "${filterQuery}". Coba kata kunci lain.`
              : 'Belum ada perintah yang terdaftar dalam kategori ini.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredCommands.map((cmd) => (
            <div
              key={cmd.name}
              className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 hover:border-primary/60 hover:shadow-elevation-hover transition-all duration-200"
            >
              <div className="space-y-3">
                {/* Command Header */}
                <div className="flex items-start justify-between gap-2">
                  <Link
                    to={`/command/${catId}/${cmd.name}`}
                    className="font-mono text-base font-bold text-foreground group-hover:text-primary transition-colors hover:underline"
                  >
                    .{cmd.name}
                  </Link>
                  <div className="flex flex-wrap gap-1 items-center justify-end">
                    {cmd.premiumOnly && (
                      <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        <Sparkles className="h-2.5 w-2.5" /> Premium
                      </span>
                    )}
                    {cmd.permissions?.owner && (
                      <span className="rounded px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                        Owner
                      </span>
                    )}
                    {cmd.permissions?.subowner && (
                      <span className="rounded px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                        Sub-owner
                      </span>
                    )}
                    {cmd.permissions?.admin && (
                      <span className="rounded px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Admin
                      </span>
                    )}
                    {cmd.permissions?.bot && (
                      <span className="rounded px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase bg-primary/10 text-primary border border-primary/20">
                        Bot
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {cmd.description || 'Tidak ada deskripsi rinci untuk perintah ini.'}
                </p>

                {/* Tags */}
                {cmd.tags && cmd.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {cmd.tags.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-border/60 bg-surface px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
                <CopyButton text={`.${cmd.name}`} size="sm" />
                <Link
                  to={`/command/${catId}/${cmd.name}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  <span>Detail</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
