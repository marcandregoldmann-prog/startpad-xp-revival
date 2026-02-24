export interface Argument {
  id: string;
  text: string;
  weight: number;
}

export interface Decision {
  id: string;
  title: string;
  pros: Argument[];
  contras: Argument[];
  proScore: number;
  contraScore: number;
  result: 'pro' | 'contra' | 'neutral';
  resultText: string;
  createdAt: string;
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function calculateResult(
  pros: Argument[],
  contras: Argument[],
): Pick<Decision, 'proScore' | 'contraScore' | 'result' | 'resultText'> {
  const proScore = pros.reduce((sum, a) => sum + a.weight, 0);
  const contraScore = contras.reduce((sum, a) => sum + a.weight, 0);

  let result: Decision['result'];
  let resultText: string;

  if (proScore > contraScore) {
    result = 'pro';
    resultText = 'Rational sinnvoll';
  } else if (contraScore > proScore) {
    result = 'contra';
    resultText = 'Eher nicht sinnvoll';
  } else {
    result = 'neutral';
    resultText = 'Unentschieden – Bauchgefühl prüfen';
  }

  return { proScore, contraScore, result, resultText };
}

export function loadDecisions(): Decision[] {
  try {
    const data = localStorage.getItem('clearmind-decisions');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveDecision(decision: Decision): void {
  const decisions = loadDecisions();
  decisions.unshift(decision);
  localStorage.setItem('clearmind-decisions', JSON.stringify(decisions));
}

export function deleteDecision(id: string): void {
  const decisions = loadDecisions().filter((d) => d.id !== id);
  localStorage.setItem('clearmind-decisions', JSON.stringify(decisions));
}
