import { Decision } from '@/lib/decisions';
import { CheckCircle, XCircle, MinusCircle } from 'lucide-react';

interface ResultCardProps {
  decision: Pick<Decision, 'proScore' | 'contraScore' | 'result' | 'resultText'>;
}

const ResultCard = ({ decision }: ResultCardProps) => {
  const { proScore, contraScore, result, resultText } = decision;
  const total = proScore + contraScore || 1;
  const proPercent = Math.round((proScore / total) * 100);

  const iconMap = {
    pro: <CheckCircle className="h-8 w-8 text-pro" />,
    contra: <XCircle className="h-8 w-8 text-contra" />,
    neutral: <MinusCircle className="h-8 w-8 text-neutral" />,
  };

  const colorMap = { pro: 'text-pro', contra: 'text-contra', neutral: 'text-neutral' };

  return (
    <div className="rounded-xl border border-border bg-card p-6 text-center space-y-4">
      <div className="flex justify-center">{iconMap[result]}</div>
      <p className={`text-lg font-semibold ${colorMap[result]}`}>{resultText}</p>
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-mono text-muted-foreground">
          <span>Pro: {proScore}</span>
          <span>Contra: {contraScore}</span>
        </div>
        <div className="h-2 rounded-full bg-contra-muted overflow-hidden">
          <div className="h-full rounded-full bg-pro transition-all duration-500" style={{ width: `${proPercent}%` }} />
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
