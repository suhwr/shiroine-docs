
import { CheckCircle2, XCircle } from 'lucide-react';

export function ArgumentsBuilder({ details }: { details: any }) {
  // Render booleans as Status Chips
  const booleanKeys = Object.keys(details).filter(k => typeof details[k] === 'boolean');
  
  // Render arrays like chatTypes as badges
  const chatTypes = details.chatTypes || [];
  const permissions = details.permissions || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Boolean Statuses */}
      {booleanKeys.length > 0 && (
        <div>
          <h4 className="text-secondary" style={{ fontSize: '0.85rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Status Configuration</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {booleanKeys.map(k => (
              <div key={k} className={`badge ${details[k] ? 'badge-success' : 'badge-danger'}`} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                {details[k] ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                {k.replace(/([A-Z])/g, ' $1').trim()}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat Types */}
      {chatTypes.length > 0 && (
        <div>
          <h4 className="text-secondary" style={{ fontSize: '0.85rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Supported Chats</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {chatTypes.map((ct: string) => (
              <span key={ct} className="badge" style={{ textTransform: 'capitalize' }}>{ct}</span>
            ))}
          </div>
        </div>
      )}

      {/* Permissions */}
      {permissions.length > 0 && (
        <div>
          <h4 className="text-secondary" style={{ fontSize: '0.85rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Permissions Required</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {permissions.map((p: string) => (
              <span key={p} className="badge badge-warning" style={{ textTransform: 'capitalize' }}>{p.replace('_', ' ')}</span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
