import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Heart,
  ChevronRight,
  AlertCircle,
  Play,
  Terminal,
  Info,
  Clock,
  Zap,
  Sparkles,
  AlertTriangle,
  ArrowLeft,
  Shield,
  Crown,
  Bot,
  Gamepad2,
} from 'lucide-react';
import { CopyButton } from '../components/ui/CopyButton';
import { ArgumentsBuilder } from '../components/command/ArgumentsBuilder';
import { SimulatedChat } from '../components/command/SimulatedChat';

interface CommandDetailProps {
  favorites: Array<{ name: string; category: string }>;
  toggleFavorite: (n: string, c: string) => void;
  addRecent: (name: string, category: string) => void;
}

export function CommandDetail({ favorites, toggleFavorite, addRecent }: CommandDetailProps) {
  const { catId, cmdName } = useParams();
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    fetch(`./docs/${catId}/${cmdName}.json`)
      .then((res) => res.json())
      .then((data) => {
        setDetails(data);
        setLoading(false);
        if (cmdName && catId) addRecent(cmdName, catId);

        fetch(`./docs/${catId}/index.json`)
          .then((res) => res.json())
          .then((catIndex) => {
            const list = (catIndex.commands || [])
              .filter((c: any) => c.name !== cmdName)
              .slice(0, 5);
            setRelated(list);
          })
          .catch(() => {});
      })
      .catch(() => setLoading(false));
  }, [catId, cmdName]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 rounded-xl bg-card/60 animate-pulse" />
        <div className="h-44 rounded-2xl bg-card/60 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 rounded-2xl bg-card/60 animate-pulse" />
          <div className="h-96 rounded-2xl bg-card/60 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="rounded-2xl border border-border/80 bg-card p-12 text-center space-y-4 max-w-lg mx-auto shadow-layer-1">
        <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="font-display text-xl font-bold text-foreground">
          Perintah Tidak Ditemukan
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Tidak dapat memuat metadata untuk .{cmdName}. Pastikan nama perintah valid.
        </p>
        <Link
          to={`/category/${catId || ''}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Kategori</span>
        </Link>
      </div>
    );
  }

  const isFavorite = favorites.some((f) => f.name === cmdName);
  const descText =
    typeof details.description === 'string'
      ? details.description
      : `${details.description?.id || ''} ${details.description?.en || ''}`;
  const descLower = descText.toLowerCase();

  const isOwner = Boolean(
    details.permissions?.owner ||
      catId === 'developer' ||
      catId === 'owner' ||
      descLower.includes('owner only')
  );
  const isAdmin = Boolean(
    details.permissions?.admin ||
      catId === 'store_admin' ||
      catId === 'admin' ||
      descLower.includes('admin only')
  );
  const isSubOwner = Boolean(details.permissions?.subowner);
  const isBot = Boolean(details.permissions?.bot || details.permissions?.hasbot);
  const isPrem = Boolean(
    details.premiumOnly ||
      descLower.includes('khusus premium') ||
      descLower.includes('premium only')
  );
  const isAi = catId === 'ai' || descLower.includes('ai limit') || descLower.includes('heavy ai limit');
  const isGame = catId === 'game' || catId === 'minigame';
  const cost = details.limitCost || 0;

  const hasRequireMedia =
    details.requireMedia &&
    (Array.isArray(details.requireMedia)
      ? details.requireMedia.length > 0
      : Boolean(details.requireMedia));
  const requireMediaLabel = Array.isArray(details.requireMedia)
    ? details.requireMedia.join(' / ')
    : details.requireMedia;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Breadcrumb Sticky Bar */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground"
      >
        <Link to="/" className="hover:text-primary transition-colors">
          Beranda
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link
          to={`/category/${catId}`}
          className="hover:text-primary transition-colors capitalize"
        >
          {catId}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-mono font-semibold text-primary">
          .{cmdName}
        </span>
      </nav>

      {/* Main Command Header Card */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-layer-1 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-3">
            {/* Title & Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-mono text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mr-1">
                .{cmdName}
              </h1>

              {/* Premium Badge */}
              {isPrem && (
                <span className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <Sparkles className="h-3 w-3" />
                  <span>{details.premiumOnly && details.premiumOnly !== 'all' ? `Prem ${details.premiumOnly}` : 'Premium'}</span>
                </span>
              )}

              {/* Owner Badge */}
              {isOwner && (
                <span className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-mono font-bold uppercase bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  <Crown className="h-3 w-3" />
                  <span>Owner</span>
                </span>
              )}

              {/* Sub-owner Badge */}
              {isSubOwner && (
                <span className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-mono font-bold uppercase bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  <span>Sub-owner</span>
                </span>
              )}

              {/* Admin Badge */}
              {isAdmin && (
                <span className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-mono font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Shield className="h-3 w-3" />
                  <span>Admin</span>
                </span>
              )}

              {/* Bot Admin Badge */}
              {isBot && (
                <span className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-mono font-bold uppercase bg-primary/10 text-primary border border-primary/20">
                  <Bot className="h-3 w-3" />
                  <span>Bot</span>
                </span>
              )}

              {/* Limit AI Badge */}
              {isAi && (
                <span className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-mono font-bold uppercase bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                  <Sparkles className="h-3 w-3" />
                  <span>{cost > 0 ? `${cost} Limit AI` : 'Limit AI'}</span>
                </span>
              )}

              {/* Daily Limit Badge */}
              {!isAi && cost > 0 && (
                <span className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-mono font-bold uppercase bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                  <Zap className="h-3 w-3" />
                  <span>{cost} Limit</span>
                </span>
              )}

              {/* Game Limit Badge */}
              {isGame && cost === 0 && (
                <span className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-mono font-bold uppercase bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  <Gamepad2 className="h-3 w-3" />
                  <span>Limit Game</span>
                </span>
              )}

              {/* NSFW Badge */}
              {details.nsfwOnly && (
                <span className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold uppercase bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  <AlertTriangle className="h-3 w-3" /> NSFW
                </span>
              )}

              {/* Cooldown Badge */}
              {details.delaySeconds > 0 && (
                <span className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-mono font-medium bg-muted text-muted-foreground border border-border">
                  <Clock className="h-3 w-3" /> {details.delaySeconds}s jeda
                </span>
              )}

              <span className="rounded-lg border border-border/80 bg-surface px-2.5 py-1 font-mono text-xs font-semibold text-muted-foreground uppercase">
                {catId}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-foreground/90 max-w-3xl leading-relaxed pt-1">
              {details.description?.id || details.description?.en || descText || 'Tidak ada deskripsi rinci untuk perintah ini.'}
            </p>

            {details.description?.en && details.description?.id && (
              <p className="text-xs text-muted-foreground max-w-3xl italic">
                EN: {details.description.en}
              </p>
            )}

            {/* Aliases */}
            {details.aliases && details.aliases.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                <span className="font-semibold">Alias:</span>
                <div className="flex flex-wrap gap-1.5 font-mono">
                  {details.aliases.map((a: string) => (
                    <span key={a} className="rounded bg-muted px-1.5 py-0.5 text-foreground/80">
                      .{a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => toggleFavorite(cmdName!, catId!)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
                isFavorite
                  ? 'border-rose-500/40 bg-rose-500/10 text-rose-500'
                  : 'border-border bg-surface text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
              aria-label={isFavorite ? 'Hapus dari favorit' : 'Tambah ke favorit'}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <CopyButton text={`.${cmdName}`} label="Salin Perintah" />
          </div>
        </div>

        {/* Require Media Warning Banner */}
        {hasRequireMedia && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-start gap-3 text-amber-700 dark:text-amber-300">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs sm:text-sm">
              <span className="font-semibold block">
                Memerlukan Lampiran Media ({requireMediaLabel})
              </span>
              <p className="text-amber-700/90 dark:text-amber-300/90 leading-relaxed">
                Kirim <strong>{requireMediaLabel}</strong> dengan caption{' '}
                <code className="rounded bg-black/10 dark:bg-white/10 px-1.5 py-0.5 font-mono font-bold">
                  .{cmdName}
                </code>{' '}
                atau <em>reply</em> pesan media tersebut dengan perintah ini.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 2-Column Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Usage, Examples, Video, Simulated Chat) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Usage Syntax Card */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-layer-1 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-foreground">
                <Terminal className="h-4 w-4 text-primary" />
                <span>Sintaks Penggunaan</span>
              </div>
              <CopyButton text={details.usage || `.${cmdName}`} size="sm" />
            </div>

            <div className="rounded-xl border border-border/80 bg-[#0B0F19] p-3.5 sm:p-4 text-emerald-400 font-mono text-xs sm:text-sm overflow-x-auto shadow-inner">
              <code>{details.usage || `.${cmdName}`}</code>
            </div>

            {/* Examples */}
            {details.examples && details.examples.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Contoh Penggunaan:
                </span>
                <div className="space-y-2">
                  {Array.from(new Set(details.examples)).map((ex: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-surface px-3.5 py-2.5 text-xs font-mono"
                    >
                      <span className="text-foreground/90 truncate">.{ex}</span>
                      <CopyButton text={`.${ex}`} size="sm" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tutorial Video / Image if available */}
          {details.videoUrl && (
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-layer-1 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-foreground">
                <Play className="h-4 w-4 text-primary" />
                <span>Video Tutorial</span>
              </div>
              <div className="overflow-hidden rounded-xl border border-border bg-black">
                {details.videoUrl.includes('youtube.com') || details.videoUrl.includes('youtu.be') ? (
                  <iframe
                    width="100%"
                    height="350"
                    src={details.videoUrl
                      .replace('watch?v=', 'embed/')
                      .replace('youtu.be/', 'www.youtube.com/embed/')}
                    title="Tutorial Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full aspect-video"
                  />
                ) : details.videoUrl.match(/\.(jpeg|jpg|gif|png|webp)($|\?)/i) ? (
                  <img
                    src={details.videoUrl}
                    alt="Tutorial Perintah"
                    className="w-full max-h-[400px] object-cover"
                  />
                ) : (
                  <video
                    src={details.videoUrl}
                    controls
                    className="w-full max-h-[400px]"
                  />
                )}
              </div>
            </div>
          )}

          {/* Interactive Chat Simulator */}
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block px-1">
              Pratinjau Simulasi Obrolan
            </span>
            <SimulatedChat cmdName={cmdName!} details={details} />
          </div>
        </div>

        {/* Right Column (Specifications & Arguments) */}
        <div className="space-y-6">
          
          {/* Specifications Box */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-layer-1 space-y-5">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-foreground">
              <Info className="h-4 w-4 text-primary" />
              <span>Spesifikasi Eksekusi</span>
            </div>

            <div className="divide-y divide-border/60">
              {/* Cooldown */}
              <div className="flex items-center justify-between py-2.5 first:pt-0">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Jeda (Cooldown)</span>
                </div>
                <span className="font-mono text-xs font-bold text-foreground">
                  {details.delaySeconds || 0} detik
                </span>
              </div>

              {/* Limit Cost & Type */}
              <div className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                  <span>Biaya / Kuota</span>
                </div>
                <div className="text-right">
                  {isAi ? (
                    <span className="font-mono text-xs font-bold text-violet-500">
                      {cost > 0 ? `${cost} Limit AI` : 'Kuota AI Harian'}
                    </span>
                  ) : isGame ? (
                    <span className="font-mono text-xs font-bold text-cyan-500">
                      Limit Game
                    </span>
                  ) : cost > 0 ? (
                    <span className="font-mono text-xs font-bold text-orange-500">
                      {cost} Limit Harian
                    </span>
                  ) : (
                    <span className="font-mono text-xs font-medium text-emerald-500">
                      Gratis / Bebas
                    </span>
                  )}
                </div>
              </div>

              {/* Minimum Args */}
              <div className="flex items-center justify-between py-2.5 last:pb-0">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Terminal className="h-3.5 w-3.5" />
                  <span>Argumen Minimal</span>
                </div>
                <span className="font-mono text-xs font-bold text-foreground">
                  {details.minArgs || 0} arg
                </span>
              </div>
            </div>

            {/* Arguments & Config Builder */}
            <div className="pt-2 border-t border-border/60">
              <ArgumentsBuilder details={details} />
            </div>
          </div>

          {/* Related Commands */}
          {related.length > 0 && (
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-layer-1 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Perintah Terkait
                </span>
                <Link
                  to={`/category/${catId}`}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Lihat Semua
                </Link>
              </div>

              <div className="space-y-2">
                {related.map((r) => (
                  <Link
                    key={r.name}
                    to={`/command/${catId}/${r.name}`}
                    className="flex items-center justify-between gap-2 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs hover:border-primary/50 hover:bg-muted transition-all"
                  >
                    <span className="font-mono font-semibold text-foreground">
                      .{r.name}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
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
