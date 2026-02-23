import { type Decision } from '@/lib/decisions';
import { Award, ArrowRight } from 'lucide-react';

interface ResultCardProps {
  decision: Pick<Decision, 'proScore' | 'contraScore' | 'result' | 'resultText'>;
}

const ResultCard = ({ decision }: ResultCardProps) => {
  const isPositive = decision.result === 'Dafür';
  const color = isPositive ? 'emerald' : 'rose';
  const gradient = isPositive ? 'from-emerald-500/20 to-teal-500/10' : 'from-rose-500/20 to-orange-500/10';

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-${color}-500/30 bg-gradient-to-br ${gradient} p-8 shadow-2xl shadow-${color}-500/10 backdrop-blur-md transition-all animate-in zoom-in-95 duration-500`}>
      <div className={`absolute top-0 right-0 p-8 opacity-10 text-${color}-500 rotate-12`}>
        <Award className="h-24 w-24" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center space-y-4">
        <div className={`rounded-full bg-${color}-500/20 p-3 shadow-[0_0_20px_currentColor] text-${color}-400`}>
          <ArrowRight className={`h-8 w-8 ${isPositive ? '-rotate-45' : 'rotate-45'} transition-transform duration-700`} />
        </div>

        <h2 className={`text-4xl font-black tracking-tight text-${color}-400 drop-shadow-sm`}>
          {decision.result}
        </h2>

        <div className="flex items-center gap-6 pt-2">
          <div className="text-center">
            <span className="block text-2xl font-bold text-emerald-400">{decision.proScore}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500/60">Pro</span>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="text-center">
            <span className="block text-2xl font-bold text-rose-400">{decision.contraScore}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500/60">Contra</span>
          </div>
        </div>

        <p className="max-w-[260px] text-sm font-medium text-foreground/80 leading-relaxed pt-2">
          {decision.resultText}
        </p>
      </div>

      {/* Decorative glow */}
      <div className={`absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-${color}-500/20 blur-3xl`} />
    </div>
  );
};

export default ResultCard;
