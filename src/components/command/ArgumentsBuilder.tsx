import { CheckCircle2, XCircle, Terminal, Shield, MessageSquare, Sliders } from 'lucide-react';

interface ArgumentsBuilderProps {
  details: {
    args?: Record<string, { id?: string; en?: string } | string>;
    chatTypes?: Record<string, boolean>;
    permissions?: Record<string, boolean>;
    [key: string]: any;
  };
}

export function ArgumentsBuilder({ details }: ArgumentsBuilderProps) {
  const booleanKeys = Object.keys(details).filter(
    (k) => typeof details[k] === 'boolean' && !['success', 'status'].includes(k)
  );

  const chatTypes = Object.keys(details.chatTypes || {}).filter(
    (k) => details.chatTypes?.[k]
  );
  const permissions = Object.keys(details.permissions || {}).filter(
    (k) => details.permissions?.[k]
  );
  const args = details.args || {};
  const hasArgs = Object.keys(args).length > 0;

  return (
    <div className="space-y-6">
      {/* Parameter format */}
      {hasArgs && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Terminal className="h-3.5 w-3.5 text-primary" />
            <span>Format Parameter</span>
          </div>

          <div className="rounded-xl border border-border/80 bg-surface/60 p-4 space-y-3">
            <p className="text-xs text-muted-foreground">
              Gunakan parameter berikut setelah nama perintah (contoh:{' '}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-primary">
                .command --param
              </code>
              ):
            </p>

            <div className="divide-y divide-border/60">
              {Object.entries(args).map(([argName, argVal]) => {
                const descText =
                  typeof argVal === 'object' && argVal !== null
                    ? (argVal as any).id || (argVal as any).en || JSON.stringify(argVal)
                    : String(argVal);

                return (
                  <div
                    key={argName}
                    className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 py-2.5 first:pt-0 last:pb-0"
                  >
                    <code className="shrink-0 font-mono text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md w-fit">
                      {argName}
                    </code>
                    <span className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                      {descText}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Permissions */}
      {permissions.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Shield className="h-3.5 w-3.5 text-amber-500" />
            <span>Izin Diperlukan</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {permissions.map((p) => (
              <span
                key={p}
                className="inline-flex items-center gap-1 rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 font-mono text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase"
              >
                {p.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Chat Types */}
      {chatTypes.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <MessageSquare className="h-3.5 w-3.5 text-primary" />
            <span>Lingkup Obrolan</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {chatTypes.map((ct) => (
              <span
                key={ct}
                className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1 font-mono text-xs font-medium text-foreground capitalize"
              >
                {ct}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Boolean Statuses */}
      {booleanKeys.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Sliders className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Status Konfigurasi</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {booleanKeys.map((k) => {
              const val = details[k];
              return (
                <div
                  key={k}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                    val
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'border-border/60 bg-muted/60 text-muted-foreground'
                  }`}
                >
                  {val ? (
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  )}
                  <span>{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
