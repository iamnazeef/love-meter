const FLAMES = ["F", "L", "A", "M", "E", "S"] as const;

const MEANINGS: Record<string, string> = {
  F: "Friends",
  L: "Love",
  A: "Affection",
  M: "Marriage",
  E: "Eternal",
  S: "Soulmates",
};

export function calculateFlames(name1: string, name2: string) {
  const a = name1.toLowerCase().replace(/\s/g, "").split("");
  const b = name2.toLowerCase().replace(/\s/g, "").split("");

  // Cancel common letters one-by-one
  const remaining1 = [...a];
  const remaining2 = [...b];

  for (let i = remaining1.length - 1; i >= 0; i--) {
    const idx = remaining2.indexOf(remaining1[i]);
    if (idx !== -1) {
      remaining1.splice(i, 1);
      remaining2.splice(idx, 1);
    }
  }

  const count = remaining1.length + remaining2.length;
  if (count === 0) return { letter: "L", meaning: MEANINGS["L"] };

  // Eliminate letters from FLAMES by cycling
  const active = [...FLAMES];
  let idx = 0;
  while (active.length > 1) {
    idx = (idx + count - 1) % active.length;
    active.splice(idx, 1);
    if (idx === active.length) idx = 0;
  }

  const letter = active[0];
  return { letter, meaning: MEANINGS[letter] };
}
