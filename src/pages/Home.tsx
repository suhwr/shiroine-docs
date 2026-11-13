import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Sparkles,
  ChevronRight,
  Heart,
  History,
  Layers,
  Film,
  Cpu,
  Terminal,
  Download,
  Smile,
  Gamepad2,
  Users,
  Image,
  Dices,
  Music,
  Crown,
  User,
  ShoppingBag,
  Store,
  Briefcase,
  Wrench,
  PlaySquare,
  BookOpen,
} from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  description: string;
}

interface HomeProps {
  favorites: Array<{ name: string; category: string }>;
  recents: Array<{ name: string; category: string }>;
}

function getCategoryIcon(catId: string) {
  switch (catId) {
    case 'ai':
      return <Sparkles className="h-5 w-5 text-primary" />;
    case 'animanga':
      return <Film className="h-5 w-5 text-indigo-400" />;
    case 'bot':
      return <Cpu className="h-5 w-5 text-blue-400" />;
    case 'developer':
      return <Terminal className="h-5 w-5 text-emerald-400" />;
    case 'downloader':
      return <Download className="h-5 w-5 text-cyan-400" />;
    case 'fun':
      return <Smile className="h-5 w-5 text-amber-400" />;
    case 'game':
      return <Gamepad2 className="h-5 w-5 text-purple-400" />;
    case 'general':
      return <Layers className="h-5 w-5 text-sky-400" />;
    case 'group':
      return <Users className="h-5 w-5 text-teal-400" />;
    case 'media':
      return <Image className="h-5 w-5 text-rose-400" />;
    case 'minigame':
      return <Dices className="h-5 w-5 text-orange-400" />;
    case 'music':
      return <Music className="h-5 w-5 text-pink-400" />;
    case 'owner':
      return <Crown className="h-5 w-5 text-amber-500" />;
    case 'profile':
      return <User className="h-5 w-5 text-violet-400" />;
    case 'search':
      return <Search className="h-5 w-5 text-blue-400" />;
    case 'store':
      return <ShoppingBag className="h-5 w-5 text-emerald-500" />;
    case 'store_admin':
      return <Store className="h-5 w-5 text-cyan-500" />;
    case 'store_owner':
      return <Briefcase className="h-5 w-5 text-blue-500" />;
    case 'tools':
      return <Wrench className="h-5 w-5 text-amber-400" />;
    case 'youtube':
      return <PlaySquare className="h-5 w-5 text-red-500" />;
    default:
      return <Terminal className="h-5 w-5 text-primary" />;
  }
}

export function Home({ favorites, recents }: HomeProps) {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('./docs/categories.json')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6 pt-4 sm:pt-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
          <BookOpen className="h-3.5 w-3.5" />
          <span>Panduan Resmi & Registri Perintah</span>
        </div>

        <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
          Dokumentasi Lengkap{' '}
          <span className="text-primary">
            Shiroine Bot
          </span>
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Temukan daftar perintah WhatsApp, dokumentasi parameter, hak akses izin, dan panduan penggunaan interaktif.
        </p>

        {/* Big Search Bar Trigger */}
        <div className="pt-2 max-w-xl mx-auto">
          <div
            onClick={() => window.dispatchEvent(new CustomEvent('open-search'))}
            className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 sm:px-5 py-3.5 sm:py-4 shadow-layer-1 hover:border-primary/60 hover:shadow-elevation-hover transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center gap-3 text-muted-foreground group-hover:text-foreground transition-colors">
              <Search className="h-5 w-5 text-primary" />
              <span className="text-sm sm:text-base font-normal">
                Cari perintah, alias, atau topik...
              </span>
            </div>
            <kbd className="hidden sm:inline-flex items-center rounded-lg border border-border bg-surface px-2.5 py-1 font-mono text-xs font-semibold text-muted-foreground shadow-2xs">
              Ctrl + K
            </kbd>
          </div>
        </div>

        {/* Quick Highlights */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-medium text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>500+ Perintah Siap Pakai</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span>20+ Kategori Fitur</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span>Simulasi Obrolan Nyata</span>
          </div>
        </div>
      </section>

      {/* Recents and Favorites Grid */}
      {(favorites.length > 0 || recents.length > 0) && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Favorites */}
          {favorites.length > 0 && (
            <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 space-y-4 shadow-layer-1">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-foreground">
                <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
                <span>Perintah Favorit</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {favorites.map((f) => (
                  <Link
                    key={f.name}
                    to={`/command/${f.category}/${f.name}`}
                    className="flex items-center justify-between gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-medium hover:border-primary/50 hover:bg-muted transition-all"
                  >
                    <span className="font-mono font-semibold text-foreground truncate">
                      .{f.name}
                    </span>
                    <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground uppercase shrink-0">
                      {f.category}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Recents */}
          {recents.length > 0 && (
            <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 space-y-4 shadow-layer-1">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-foreground">
                <History className="h-4 w-4 text-primary" />
                <span>Terakhir Dilihat</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {recents.map((r) => (
                  <Link
                    key={r.name}
                    to={`/command/${r.category}/${r.name}`}
                    className="flex items-center justify-between gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-medium hover:border-primary/50 hover:bg-muted transition-all"
                  >
                    <span className="font-mono font-semibold text-foreground truncate">
                      .{r.name}
                    </span>
                    <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground uppercase shrink-0">
                      {r.category}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Categories Grid Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Kategori Perintah
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Pilih kategori untuk melihat seluruh perintah beserta spesifikasinya.
            </p>
          </div>
          <span className="rounded-lg border border-border/80 bg-surface px-2.5 py-1 font-mono text-xs font-semibold text-muted-foreground">
            {categories.length} Kategori
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-36 rounded-2xl border border-border/60 bg-card/60 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 hover:border-primary/60 hover:shadow-elevation-hover transition-all duration-200"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface shadow-2xs group-hover:border-primary/40 group-hover:scale-105 transition-all">
                      {getCategoryIcon(cat.id)}
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>

                  <div>
                    <h3 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors capitalize">
                      {cat.name}
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground font-mono">
                  <span>/{cat.id}</span>
                  <span className="text-primary font-semibold group-hover:underline">
                    Buka panduan
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
