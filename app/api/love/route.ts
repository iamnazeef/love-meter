import { NextResponse } from "next/server";
import OpenAI from "openai";
import { calculateFlames } from "@/app/lib/flames";
import { getZodiacSign, getZodiacEmoji } from "@/app/lib/zodiac";

const client = new OpenAI({
  apiKey: process.env.HF_TOKEN,
  baseURL: "https://router.huggingface.co/novita/v3/openai",
});

const DEFAULT_PROMPT =
  "You are a fun, romantic love compatibility analyst for Valentine's Day. Given two people's names, their FLAMES result, and zodiac signs, generate a creative and positive love compatibility reading. Be warm, playful, and only say positive things.";

export async function POST(req: Request) {
  try {
    const { name1, name2, dob1, dob2 } = await req.json();

    const flames = calculateFlames(name1, name2);
    const sign1 = getZodiacSign(dob1);
    const sign2 = getZodiacSign(dob2);

    const base = {
      flamesMeaning: flames.meaning,
      sign1,
      sign1Emoji: getZodiacEmoji(sign1),
      sign2,
      sign2Emoji: getZodiacEmoji(sign2),
    };

    const systemPrompt = process.env.LOVE_PROMPT || DEFAULT_PROMPT;

    const userMessage = `
Names: ${name1} and ${name2}
FLAMES result: ${flames.meaning}
Zodiac signs: ${sign1} and ${sign2}

Respond ONLY with valid JSON in this exact format (no markdown, no code fences):
{
  "percentage": <number between 60-99>,
  "summary": "<A detailed, heartfelt, and poetic love compatibility reading (8-12 sentences). Write it like a Snapchat astrological compatibility story — playful yet deep. Start with how their zodiac energies attract each other. Describe how their personalities complement and balance each other. Talk about the emotional chemistry and what sparks fly when they're together. Mention what kind of couple they'd be — the adventurous duo, the power couple, the cozy homebodies, etc. End with a romantic prediction about their future together. Use their actual names throughout. Keep the tone warm, fun, and magazine-style. Only positive — never mention any negatives or challenges.>",
  "reasons": ["<reason 1>", "<reason 2>", "<reason 3>", "<reason 4>", "<reason 5>"]
}
Only include positive things. Do not include anything negative.`;

    const completion = await client.chat.completions.create({
      model: "deepseek/deepseek-v3-0324",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.9,
      max_tokens: 1024,
    });

    const raw = completion.choices[0]?.message?.content ?? "";

    try {
      const cleaned = raw.replace(/```(?:json)?\s*/g, "").trim();
      const data = JSON.parse(cleaned);
      return NextResponse.json({
        ...base,
        percentage: Math.min(99, Math.max(60, Number(data.percentage) || 75)),
        summary: data.summary ?? "",
        reasons: Array.isArray(data.reasons) ? data.reasons : [],
      });
    } catch {
      return NextResponse.json({
        ...base,
        percentage: 75,
        summary: `${name1} and ${name2} share a truly beautiful connection — their bond is written in the stars, and together they create something magical that only grows stronger with time.`,
        reasons: ["Your energies complement each other beautifully", "A deep emotional understanding binds you", "Together you bring out the best in each other"],
      });
    }
  } catch (err) {
    console.error("Love API error:", err);
    return NextResponse.json(
      { error: String(err instanceof Error ? err.message : err) },
      { status: 500 },
    );
  }
}
