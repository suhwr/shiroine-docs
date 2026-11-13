import { Play, CheckCheck, FileText, Zap, Sparkles } from 'lucide-react';

interface SimulatedChatProps {
  cmdName: string;
  details: {
    description?: { en?: string; id?: string } | string;
    requireMedia?: string | string[];
    category?: string;
    limitCost?: number;
    limitType?: string;
    examples?: string[];
    [key: string]: any;
  };
}

export function SimulatedChat({ cmdName, details }: SimulatedChatProps) {
  let desc = 'Memproses perintah...';
  if (typeof details.description === 'string') {
    desc = details.description;
  } else if (details.description && typeof details.description === 'object') {
    desc = details.description.id || details.description.en || 'Memproses perintah...';
  }

  const hasRequireMedia =
    details.requireMedia &&
    (Array.isArray(details.requireMedia)
      ? details.requireMedia.length > 0
      : Boolean(details.requireMedia));
  const requireMediaLabel = Array.isArray(details.requireMedia)
    ? details.requireMedia.join(' / ')
    : details.requireMedia;

  const isDownloaderOrMedia =
    details.category === 'downloader' ||
    details.category === 'youtube' ||
    (Array.isArray(details.requireMedia)
      ? details.requireMedia.includes('image') || details.requireMedia.includes('video')
      : details.requireMedia === 'image' || details.requireMedia === 'video');

  const exampleArgs = details.examples?.[0]
    ? details.examples[0].replace(new RegExp(`^\\.?${cmdName}\\s*`, 'i'), '').trim()
    : '';

  const isAi = details.category === 'ai' || details.limitType === 'ai';
  const cost = details.limitCost || 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-[#0B141A] shadow-layer-1 text-slate-100 font-sans">
      {/* WhatsApp Simulated Header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-[#202C33] px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/30 text-[11px] font-bold text-primary-foreground">
            S
          </div>
          <div>
            <div className="text-xs font-semibold text-white leading-tight">Shiroine Bot</div>
            <div className="text-[10px] text-emerald-400 leading-tight">online</div>
          </div>
        </div>
        <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-mono text-white/70">
          Simulasi Obrolan
        </span>
      </div>

      {/* Chat Messages Body */}
      <div className="flex flex-col gap-3 p-4 sm:p-5 text-sm min-h-[200px] justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#111B21] to-[#0B141A]">
        {/* Outgoing Message (User) */}
        <div className="self-end max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-tr-xs bg-[#005C4B] p-3 text-slate-100 shadow-sm space-y-1.5">
          {hasRequireMedia && (
            <div className="rounded-lg bg-[#111B21]/80 p-2 border border-white/10 text-xs flex items-center gap-2 text-white/80">
              <FileText className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>[Lampiran Media: {requireMediaLabel}]</span>
            </div>
          )}
          <div className="font-mono text-xs font-semibold">
            .{cmdName} {exampleArgs}
          </div>
          <div className="flex items-center justify-end gap-1 text-[10px] text-white/60">
            <span>12:00</span>
            <CheckCheck className="h-3 w-3 text-[#53bdeb]" />
          </div>
        </div>

        {/* Incoming Message (Bot) */}
        <div className="self-start max-w-[88%] sm:max-w-[80%] rounded-2xl rounded-tl-xs bg-[#202C33] p-3.5 text-slate-100 shadow-sm space-y-2">
          <div className="font-semibold text-xs text-[#818cf8]">Shiroine Bot</div>

          {isDownloaderOrMedia && (
            <div className="rounded-xl overflow-hidden bg-[#111B21] border border-white/10">
              <div className="h-24 bg-white/5 flex items-center justify-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white">
                  <Play className="h-5 w-5 fill-current ml-0.5" />
                </div>
              </div>
              <div className="p-2.5 text-xs">
                <div className="font-semibold text-white">Media Berhasil Diunduh</div>
                <div className="text-[11px] text-white/60">media_shiroine.mp4 • 4.8 MB</div>
              </div>
            </div>
          )}

          <div className="text-xs sm:text-sm leading-relaxed text-slate-200">
            {desc}
          </div>

          {/* Quota / Limit Info */}
          {isAi ? (
            <div className="pt-2 border-t border-white/10 flex items-center gap-1.5 text-[11px] text-violet-300">
              <Sparkles className="h-3 w-3 text-violet-400 shrink-0" />
              <span>Limit AI terpakai: {cost > 0 ? cost : 1} limit</span>
            </div>
          ) : cost > 0 ? (
            <div className="pt-2 border-t border-white/10 flex items-center gap-1.5 text-[11px] text-amber-300">
              <Zap className="h-3 w-3 text-amber-400 shrink-0" />
              <span>Limit harian terpakai: {cost} poin</span>
            </div>
          ) : null}

          <div className="flex justify-end text-[10px] text-white/50">
            <span>12:00</span>
          </div>
        </div>
      </div>
    </div>
  );
}
