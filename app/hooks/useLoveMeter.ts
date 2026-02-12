import { useState } from "react";

export interface LoveResult {
  percentage: number;
  summary: string;
  flamesMeaning: string;
  sign1: string;
  sign1Emoji: string;
  sign2: string;
  sign2Emoji: string;
  reasons: string[];
}

export function useLoveMeter() {
  const [name1, setName1] = useState("");
  const [dob1, setDob1] = useState("");
  const [name2, setName2] = useState("");
  const [dob2, setDob2] = useState("");
  const [result, setResult] = useState<LoveResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function calculate() {
    if (!name1.trim() || !name2.trim() || !dob1 || !dob2) return;

    setLoading(true);
    try {
      const res = await fetch("/api/love", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name1, name2, dob1, dob2 }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        percentage: 75,
        summary: `${name1} and ${name2} share a beautiful connection!`,
        flamesMeaning: "Love",
        sign1: "",
        sign1Emoji: "",
        sign2: "",
        sign2Emoji: "",
        reasons: [],
      });
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResult(null);
  }

  return {
    name1, setName1, dob1, setDob1,
    name2, setName2, dob2, setDob2,
    result, loading, calculate, reset,
  };
}
