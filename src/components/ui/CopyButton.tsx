import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export function CopyButton({ text, label, className = '', size = 'md' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Gagal menyalin:', err);
    }
  };

  const isSmall = size === 'sm';

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Salin teks"
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-semibold text-foreground transition-all duration-150 hover:bg-muted hover:border-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${copied ? 'border-success/50 text-success' : ''} ${className}`}
    >
      {copied ? (
        <Check className={`${isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-success`} />
      ) : (
        <Copy className={`${isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-muted-foreground`} />
      )}
      {label && <span>{copied ? 'Tersalin' : label}</span>}
    </button>
  );
}
