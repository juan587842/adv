"use client";

import { X, Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface JsonViewerModalProps {
  data: Record<string, any>;
  onClose: () => void;
}

export function JsonViewerModal({ data, onClose }: JsonViewerModalProps) {
  const [copied, setCopied] = useState(false);
  const jsonStr = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="bg-surface border border-primary/20 p-6 rounded-2xl w-full max-w-lg shadow-2xl relative max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h2 className="text-lg font-bold font-headline text-on-surface">Metadados (JSON)</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-semibold hover:bg-primary/20 transition-colors"
            >
              {copied ? <><CheckCircle2 size={14} /> Copiado!</> : <><Copy size={14} /> Copiar</>}
            </button>
            <button
              onClick={onClose}
              className="text-secondary/40 hover:text-secondary bg-surface-container hover:bg-surface-container-highest p-2 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto rounded-xl bg-background/60 border border-primary/10 p-4">
          <pre className="text-xs font-mono text-secondary/80 whitespace-pre-wrap break-words leading-relaxed">
            {jsonStr}
          </pre>
        </div>
      </div>
    </div>
  );
}
