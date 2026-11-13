import { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronRight,
  Search,
  Sparkles,
  Shield,
  Crown,
  Layers,
  X,
  Zap,
  Gamepad2,
  Bot,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { CopyButton } from '../components/ui/CopyButton';

interface CommandSummary {
  name: string;
  description?: string;
  descriptionId?: string;
  descriptionEn?: string;
  aliases?: string[];
  category?: string;
  permissions?: {
    owner?: boolean;
    subowner?: boolean;
    admin?: boolean;
    bot?: boolean;
    hasbot?: boolean;
    [key: string]: any;
  };
  premiumOnly?: string;
  limitCost?: number;
  limitType?: 'ai' | 'game' | 'daily' | 'none';
  nsfwOnly?: boolean;
  delaySeconds?: number;
  minArgs?: number;
  requireMedia?: string[];
  tags?: string[];
}

export function CategoryDetail() {
  const { catId } = useParams();
  const [commands, setCommands] = useState<CommandSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [catName, setCatName] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'premium' | 'limit' | 'ai' | 'admin' | 'owner'>('all');

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

  // Counts for filter pills
  const counts = useMemo(() => {
    let premium = 0;
    let limit = 0;
    let ai = 0;
    let admin = 0;
    let owner = 0;

    commands.forEach((c) => {
      const isOwner = Boolean(c.permissions?.owner || catId === 'developer' || catId === 'owner');
      const isAdmin = Boolean(c.permissions?.admin || catId === 'store_admin' || catId === 'admin');
      const isPrem = Boolean(c.premiumOnly);
      const isAi = c.limitType === 'ai' || catId === 'ai';
      const hasLimit = (c.limitCost || 0) > 0 || isAi || c.limitType === 'game';

      if (isPrem) premium++;
      if (hasLimit) limit++;
      if (isAi) ai++;
      if (isAdmin) admin++;
      if (isOwner) owner++;
    });

    return { all: commands.length, premium, limit, ai, admin, owner };
  }, [commands, catId]);

  const filteredCommands = useMemo(() => {
    return commands.filter((cmd) => {
      const isOwner = Boolean(cmd.permissions?.owner || catId === 'developer' || catId === 'owner');
      const isAdmin = Boolean(cmd.permissions?.admin || catId === 'store_admin' || catId === 'admin');
      const isPrem = Boolean(cmd.premiumOnly);
      const isAi = cmd.limitType === 'ai' || catId === 'ai';
      const hasLimit = (cmd.limitCost || 0) > 0 || isAi || cmd.limitType === 'game';

      // Type filter
      if (activeFilter === 'premium' && !isPrem) return false;
      if (activeFilter === 'limit' && !hasLimit) return false;
      if (activeFilter === 'ai' && !isAi) return false;
      if (activeFilter === 'admin' && !isAdmin) return false;
      if (activeFilter === 'owner' && !isOwner) return false;

      // Text query
      if (filterQuery.trim()) {
        const q = filterQuery.toLowerCase().trim().replace(/^\./, '');
        const nameMatch = cmd.name?.toLowerCase().includes(q);
        const descMatch = `${cmd.description || ''} ${cmd.descriptionId || ''} ${cmd.descriptionEn || ''}`
          .toLowerCase()
          .includes(q);
        const aliasMatch = cmd.aliases?.some((a) => a.toLowerCase().includes(q));
        const tagMatch = cmd.tags?.some((t) => t.toLowerCase().includes(q));
        return nameMatch || descMatch || aliasMatch || tagMatch;
      }
      return true;
    });
  }, [commands, filterQuery, activeFilter, catId]);

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
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeFilter === 'all'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'border border-border bg-surface text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          Semua ({counts.all})
        </button>

        {counts.premium > 0 && (
          <button
            onClick={() => setActiveFilter('premium')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === 'premium'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'border border-border bg-surface text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Sparkles className="h-3 w-3" />
            Premium ({counts.premium})
          </button>
        )}

        {counts.ai > 0 && (
          <button
            onClick={() => setActiveFilter('ai')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === 'ai'
                ? 'bg-violet-600 text-white shadow-xs'
                : 'border border-border bg-surface text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Sparkles className="h-3 w-3" />
            Limit AI ({counts.ai})
          </button>
        )}

        {counts.limit > 0 && (
          <button
            onClick={() => setActiveFilter('limit')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === 'limit'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'border border-border bg-surface text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Zap className="h-3 w-3" />
            Pakai Limit ({counts.limit})
          </button>
        )}

        {counts.admin > 0 && (
          <button
            onClick={() => setActiveFilter('admin')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === 'admin'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'border border-border bg-surface text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Shield className="h-3 w-3" />
            Admin ({counts.admin})
          </button>
        )}

        {counts.owner > 0 && (
          <button
            onClick={() => setActiveFilter('owner')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === 'owner'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'border border-border bg-surface text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Crown className="h-3 w-3" />
            Owner ({counts.owner})
          </button>
        )}
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
              : 'Belum ada perintah yang terdaftar dalam kriteria filter ini.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredCommands.map((cmd) => {
            const isOwner = Boolean(
              cmd.permissions?.owner || catId === 'developer' || catId === 'owner'
            );
            const isAdmin = Boolean(
              cmd.permissions?.admin || catId === 'store_admin' || catId === 'admin'
            );
            const isSubOwner = Boolean(cmd.permissions?.subowner);
            const isBot = Boolean(cmd.permissions?.bot || cmd.permissions?.hasbot);
            const isPrem = Boolean(cmd.premiumOnly);
            const isAi = cmd.limitType === 'ai' || catId === 'ai';
            const isGame = cmd.limitType === 'game' || catId === 'game' || catId === 'minigame';
            const cost = cmd.limitCost || 0;

            return (
              <div
                key={cmd.name}
                className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 hover:border-primary/60 hover:shadow-elevation-hover transition-all duration-200"
              >
                <div className="space-y-3">
                  {/* Command Header and Badges */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/command/${catId}/${cmd.name}`}
                        className="font-mono text-base font-bold text-foreground group-hover:text-primary transition-colors hover:underline"
                      >
                        .{cmd.name}
                      </Link>
                    </div>

                    {/* Rich Badges Row */}
                    <div className="flex flex-wrap gap-1.5 items-center">
                      {/* Premium Badge */}
                      {isPrem && (
                        <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          <Sparkles className="h-2.5 w-2.5" />
                          <span>{cmd.premiumOnly && cmd.premiumOnly !== 'all' ? `Prem ${cmd.premiumOnly}` : 'Premium'}</span>
                        </span>
                      )}

                      {/* Owner Badge */}
                      {isOwner && (
                        <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                          <Crown className="h-2.5 w-2.5" />
                          <span>Owner</span>
                        </span>
                      )}

                      {/* Sub-owner Badge */}
                      {isSubOwner && (
                        <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                          <span>Sub-owner</span>
                        </span>
                      )}

                      {/* Admin Badge */}
                      {isAdmin && (
                        <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <Shield className="h-2.5 w-2.5" />
                          <span>Admin</span>
                        </span>
                      )}

                      {/* Bot Admin */}
                      {isBot && (
                        <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase bg-primary/10 text-primary border border-primary/20">
                          <Bot className="h-2.5 w-2.5" />
                          <span>Bot</span>
                        </span>
                      )}

                      {/* Limit AI Badge */}
                      {isAi && (
                        <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                          <Sparkles className="h-2.5 w-2.5" />
                          <span>{cost > 0 ? `${cost} Limit AI` : 'Limit AI'}</span>
                        </span>
                      )}

                      {/* Daily Limit Badge */}
                      {!isAi && cost > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                          <Zap className="h-2.5 w-2.5" />
                          <span>{cost} Limit</span>
                        </span>
                      )}

                      {/* Game Limit Badge */}
                      {isGame && cost === 0 && (
                        <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                          <Gamepad2 className="h-2.5 w-2.5" />
                          <span>Limit Game</span>
                        </span>
                      )}

                      {/* NSFW Badge */}
                      {cmd.nsfwOnly && (
                        <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                          <AlertTriangle className="h-2.5 w-2.5" />
                          <span>NSFW</span>
                        </span>
                      )}

                      {/* Media Required Badge */}
                      {cmd.requireMedia && cmd.requireMedia.length > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-mono font-medium uppercase bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                          <FileText className="h-2.5 w-2.5" />
                          <span>Media</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {cmd.description || cmd.descriptionId || cmd.descriptionEn || 'Tidak ada deskripsi rinci untuk perintah ini.'}
                  </p>

                  {/* Tags */}
                  {cmd.tags && cmd.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {cmd.tags
                        .filter(
                          (t) =>
                            ![
                              cmd.name.toLowerCase(),
                              catId?.toLowerCase(),
                              'limit-ai',
                              'limit ai',
                              'limit harian',
                            ].includes(t)
                        )
                        .slice(0, 3)
                        .map((t) => (
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
            );
          })}
        </div>
      )}
    </div>
  );
}
