
import { Play } from 'lucide-react';

export function SimulatedChat({ cmdName, details }: { cmdName: string; details: any }) {
  // Try to find the best description
  const desc = details.description?.en || details.description?.id || "Memproses perintah...";

  const hasRequireMedia = details.requireMedia && (Array.isArray(details.requireMedia) ? details.requireMedia.length > 0 : !!details.requireMedia);
  const requireMediaLabel = Array.isArray(details.requireMedia) ? details.requireMedia.join(" / ") : details.requireMedia;
  const isDownloaderOrMedia = details.category === 'downloader' || 
    details.category === 'youtube' || 
    (Array.isArray(details.requireMedia) 
      ? details.requireMedia.includes('image') || details.requireMedia.includes('video')
      : (details.requireMedia === 'image' || details.requireMedia === 'video'));

  return (
    <div style={{
      background: '#0B141A', // WhatsApp Dark Mode BG
      backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")',
      backgroundSize: 'contain',
      borderRadius: '12px',
      padding: '1.5rem 1rem',
      border: '1px solid var(--border-color)',
      fontFamily: 'Helvetica, Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      {/* Outgoing Message (User) */}
      <div style={{
        alignSelf: 'flex-end',
        background: '#005C4B', // WhatsApp Dark Outgoing Bubble
        color: '#E9EDEF',
        borderRadius: '8px 0px 8px 8px',
        padding: '0.5rem 0.75rem',
        maxWidth: '85%',
        fontSize: '0.9rem',
        boxShadow: '0 1px 0.5px rgba(11,20,26,.13)',
        position: 'relative'
      }}>
        {hasRequireMedia && (
          <div style={{ background: '#111B21', borderRadius: '6px', overflow: 'hidden', marginBottom: '6px' }}>
            <div style={{ background: '#2A3942', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: '#8696A0' }}>[ Lampiran {requireMediaLabel} ]</div>
            </div>
          </div>
        )}
        .{cmdName} {details.examples?.[0] ? details.examples[0].replace(cmdName, "").trim() : ""}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
          <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)' }}>11:30</span>
          {/* Read ticks */}
          <svg viewBox="0 0 16 15" width="16" height="15"><path fill="#53bdeb" d="m15.01 3.316-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267c.143.14.364.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.51zm-4.1 0-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.72a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185c.143.14.364.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path></svg>
        </div>
      </div>

      {/* Incoming Message (Bot) */}
      <div style={{
        alignSelf: 'flex-start',
        background: '#202C33', // WhatsApp Dark Incoming Bubble
        color: '#E9EDEF',
        borderRadius: '0px 8px 8px 8px',
        padding: '0.5rem 0.75rem',
        maxWidth: '85%',
        fontSize: '0.9rem',
        boxShadow: '0 1px 0.5px rgba(11,20,26,.13)',
        position: 'relative'
      }}>
        {/* Author Name */}
        <div style={{ fontWeight: '600', color: '#A78BFA', fontSize: '0.8rem', marginBottom: '4px' }}>
          Shiroine Bot
        </div>

        {/* Dynamic content rendering based on tags/name */}
        {isDownloaderOrMedia ? (
          <div style={{ background: '#111B21', borderRadius: '6px', overflow: 'hidden', marginBottom: '6px' }}>
            <div style={{ background: '#2A3942', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '40px', height: '40px', background: 'rgba(0,0,0,0.5)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Play className="w-5 h-5 text-white fill-current" />
              </div>
            </div>
            <div style={{ padding: '6px 8px', fontSize: '0.8rem' }}>
              <span style={{ fontWeight: '600' }}>Media downloaded successfully</span>
              <div style={{ fontSize: '0.75rem', color: '#8696A0' }}>video.mp4 • 4.2 MB</div>
            </div>
          </div>
        ) : null}

        <div style={{ lineHeight: '1.4' }}>{desc}</div>

        {/* Footer (e.g. costs) */}
        {details.limitCost > 0 && (
          <div style={{ marginTop: '6px', fontSize: '0.75rem', color: '#8696A0', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '4px' }}>
            💎 Digunakan: {details.limitCost} limit
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2px' }}>
          <span style={{ fontSize: '0.65rem', color: '#8696A0' }}>11:30</span>
        </div>
      </div>
    </div>
  );
}
