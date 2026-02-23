export const challenges = [
  "Trinke 2L Wasser",
  "Lies 10 Seiten",
  "Meditiere 5 Minuten",
  "Geh 15 Min spazieren",
  "Räum deinen Schreibtisch auf",
  "Ruf jemanden an, den du magst",
  "Kein Social Media für 1 Stunde",
  "Mach 10 Liegestütze (oder Kniebeugen)",
  "Iss ein Stück Obst",
  "Schreib 3 Dinge auf, für die du dankbar bist",
  "Lerne ein neues Wort",
  "Hör dir einen Podcast an",
  "Mach dein Bett",
  "Plan den morgigen Tag",
  "Atme 2 Min tief durch",
];

export function getDailyChallenge(): string {
  const today = new Date().toISOString().split('T')[0];
  const hash = today.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  const index = Math.abs(hash) % challenges.length;
  return challenges[index];
}
