import { Plus, X } from 'lucide-react';
import { Argument } from '@/lib/decisions';

interface ArgumentListProps {
  type: 'pro' | 'contra';
  arguments: Argument[];
  onChange: (args: Argument[]) => void;
}

const ArgumentList = ({ type, arguments: args, onChange }: ArgumentListProps) => {
  const isPro = type === 'pro';
  const color = isPro ? 'emerald' : 'rose';

  const handleAdd = () => {
    onChange([...args, { id: crypto.randomUUID(), text: '', weight: 3 }]);
  };

  const handleUpdate = (id: string, text: string, weight: number) => {
    onChange(args.map(a => a.id === id ? { ...a, text, weight } : a));
  };

  const handleRemove = (id: string) => {
    onChange(args.filter(a => a.id !== id));
  };

  return (
    <div className={`space-y-3 rounded-3xl border border-white/5 bg-gradient-to-br from-${color}-500/5 to-transparent p-5 backdrop-blur-sm shadow-sm`}>
      <div className="flex items-center justify-between mb-1">
        <h3 className={`text-xs font-bold uppercase tracking-wider text-${color}-500 flex items-center gap-2`}>
          <div className={`h-2 w-2 rounded-full bg-${color}-500 shadow-[0_0_10px_currentColor]`} />
          {isPro ? 'Pro Argumente' : 'Contra Argumente'}
        </h3>
        <span className="text-[10px] font-mono text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full">{args.length}</span>
      </div>

      <div className="space-y-3">
        {args.map((arg) => (
          <div key={arg.id} className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-200">
            <div className="flex-1 space-y-2 rounded-2xl border border-white/5 bg-black/20 p-3 hover:border-white/10 transition-colors">
              <input
                type="text"
                value={arg.text}
                onChange={(e) => handleUpdate(arg.id, e.target.value, arg.weight)}
                placeholder="Argument..."
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
              />
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground/60">Gewichtung</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={arg.weight}
                  onChange={(e) => handleUpdate(arg.id, arg.text, Number(e.target.value))}
                  className={`h-1 flex-1 rounded-full appearance-none bg-white/10 cursor-pointer accent-${color}-500 hover:accent-${color}-400 transition-all`}
                />
                <span className={`text-xs font-mono font-bold text-${color}-500 w-3 text-center`}>{arg.weight}</span>
              </div>
            </div>
            <button onClick={() => handleRemove(arg.id)} className="text-muted-foreground/30 hover:text-red-400 p-2 rounded-xl hover:bg-red-400/10 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <button onClick={handleAdd}
        className={`w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-${color}-500/20 py-3 text-xs font-medium text-${color}-500/70 hover:bg-${color}-500/10 hover:text-${color}-500 hover:border-${color}-500/40 transition-all duration-300`}>
        <Plus className="h-3.5 w-3.5" /> Argument hinzufügen
      </button>
    </div>
  );
};

export default ArgumentList;
