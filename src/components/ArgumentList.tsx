import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Argument, generateId } from '@/lib/decisions';

interface ArgumentListProps {
  type: 'pro' | 'contra';
  arguments: Argument[];
  onChange: (args: Argument[]) => void;
}

const ArgumentList = ({ type, arguments: args, onChange }: ArgumentListProps) => {
  const [text, setText] = useState('');
  const [weight, setWeight] = useState(3);

  const isPro = type === 'pro';
  const label = isPro ? 'Pro' : 'Contra';

  const addArgument = () => {
    if (!text.trim()) return;
    onChange([...args, { id: generateId(), text: text.trim(), weight }]);
    setText('');
    setWeight(3);
  };

  const removeArgument = (id: string) => {
    onChange(args.filter(a => a.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); addArgument(); }
  };

  const totalWeight = args.reduce((sum, a) => sum + a.weight, 0);

  return (
    <div className={`rounded-xl border p-4 ${isPro ? 'border-pro bg-pro-muted' : 'border-contra bg-contra-muted'}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-sm font-semibold uppercase tracking-wider ${isPro ? 'text-pro' : 'text-contra'}`}>{label}</h3>
        <span className={`text-xs font-mono ${isPro ? 'text-pro' : 'text-contra'}`}>Σ {totalWeight}</span>
      </div>
      <div className="space-y-2 mb-3">
        {args.map((arg) => (
          <div key={arg.id} className="flex items-center gap-2 rounded-lg bg-background/50 px-3 py-2 text-sm">
            <span className="flex-1 text-foreground">{arg.text}</span>
            <span className={`font-mono text-xs font-medium ${isPro ? 'text-pro' : 'text-contra'}`}>{arg.weight}</span>
            <button onClick={() => removeArgument(arg.id)} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={handleKeyDown}
          placeholder={`${label}-Argument...`}
          className="flex-1 rounded-lg border border-border bg-background/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
        <select value={weight} onChange={(e) => setWeight(Number(e.target.value))}
          className="w-14 rounded-lg border border-border bg-background/50 px-2 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
          {[1, 2, 3, 4, 5].map(w => <option key={w} value={w}>{w}</option>)}
        </select>
        <button onClick={addArgument} disabled={!text.trim()}
          className={`rounded-lg p-2 transition-colors disabled:opacity-30 ${isPro ? 'bg-pro/20 text-pro hover:bg-pro/30' : 'bg-contra/20 text-contra hover:bg-contra/30'}`}>
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ArgumentList;
