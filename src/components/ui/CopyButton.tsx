import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function CopyButton({ text, label, className = '' }: { text: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback
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
      console.error('Failed to copy', err);
    }
  };

  return (
    <button onClick={handleCopy} className={`btn ${className}`}>
      {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
      {label && <span>{copied ? "Copied!" : label}</span>}
    </button>
  );
}
