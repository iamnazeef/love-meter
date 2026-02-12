const SIGNS = [
  "Capricorn", "Aquarius", "Pisces", "Aries", "Taurus", "Gemini",
  "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius",
] as const;

export type ZodiacSign = (typeof SIGNS)[number];

// month/day cutoffs for each sign
const SIGN_DATES: [number, number, ZodiacSign][] = [
  [1, 20, "Capricorn"], [2, 19, "Aquarius"], [3, 20, "Pisces"],
  [4, 20, "Aries"], [5, 21, "Taurus"], [6, 21, "Gemini"],
  [7, 22, "Cancer"], [8, 23, "Leo"], [9, 23, "Virgo"],
  [10, 23, "Libra"], [11, 22, "Scorpio"], [12, 22, "Sagittarius"],
];

export function getZodiacSign(dob: string): ZodiacSign {
  const [, m, d] = dob.split("-").map(Number);
  for (const [month, day, sign] of SIGN_DATES) {
    if (m === month && d <= day) return sign;
  }
  if (m === 12 && d >= 23) return "Capricorn";
  const idx = SIGN_DATES.findIndex(([month]) => month === m);
  return idx > 0 ? SIGN_DATES[idx - 1][2] : "Capricorn";
}

const EMOJI: Record<ZodiacSign, string> = {
  Aries: "\u2648", Taurus: "\u2649", Gemini: "\u264A", Cancer: "\u264B",
  Leo: "\u264C", Virgo: "\u264D", Libra: "\u264E", Scorpio: "\u264F",
  Sagittarius: "\u2650", Capricorn: "\u2651", Aquarius: "\u2652", Pisces: "\u2653",
};

export function getZodiacEmoji(sign: ZodiacSign) {
  return EMOJI[sign];
}
