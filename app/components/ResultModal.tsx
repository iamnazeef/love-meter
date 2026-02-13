"use client";

import { useRef, useCallback } from "react";
import { toPng } from "html-to-image";
import type { LoveResult } from "@/app/hooks/useLoveMeter";

interface ResultModalProps {
  result: LoveResult;
  name1: string;
  name2: string;
  onClose: () => void;
}

export default function ResultModal({ result, name1, name2, onClose }: ResultModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleShare = useCallback(async () => {
    if (!cardRef.current) return;

    const el = cardRef.current;
    const prevMaxH = el.style.maxHeight;
    const prevOverflow = el.style.overflow;
    el.style.maxHeight = "none";
    el.style.overflow = "visible";

    // Show CTA, hide buttons for screenshot
    const shareHides = el.querySelectorAll<HTMLElement>(".share-hide");
    const shareShows = el.querySelectorAll<HTMLElement>(".share-show");
    shareHides.forEach((e) => (e.style.display = "none"));
    shareShows.forEach((e) => (e.style.display = "block"));

    const dataUrl = await toPng(el, {
      backgroundColor: "#1a0a10",
      pixelRatio: 2,
    });

    el.style.maxHeight = prevMaxH;
    el.style.overflow = prevOverflow;
    shareHides.forEach((e) => (e.style.display = ""));
    shareShows.forEach((e) => (e.style.display = ""));

    const res = await fetch(dataUrl);
    const blob = await res.blob();

    const file = new File([blob], "love-result.png", { type: "image/png" });

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        title: "Love Compatibility Result",
        text: `${name1} & ${name2} — ${result.percentage}% compatible!\n\nTry yours now: https://love-meterr.vercel.app/`,
        files: [file],
      });
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "love-result.png";
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [name1, name2, result.percentage]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div
        ref={cardRef}
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white/10 p-8 text-center text-white backdrop-blur-lg"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="share-hide absolute right-4 top-4 text-2xl text-white/60 hover:text-white"
        >
          &times;
        </button>

        {/* Percentage */}
        <div className="mb-2 text-7xl font-extrabold text-pink-300">
          {result.percentage}%
        </div>
        <p className="mb-4 text-lg font-semibold text-pink-200">Love Compatibility</p>

        {/* Names + Signs */}
        <div className="mb-4 flex items-center justify-center gap-3 text-base">
          <span>{name1} {result.sign1Emoji}</span>
          <span className="text-pink-400">&amp;</span>
          <span>{name2} {result.sign2Emoji}</span>
        </div>

        {/* AI Summary */}
        <p className="mb-6 text-sm leading-relaxed text-white/80">{result.summary}</p>

        {/* FLAMES result */}
        <div className="mb-4 rounded-xl bg-white/10 px-4 py-3">
          <span className="text-sm text-white/60">FLAMES says: </span>
          <span className="font-bold text-pink-300">{result.flamesMeaning}</span>
        </div>

        {/* Zodiac match */}
        <div className="mb-6 rounded-xl bg-white/10 px-4 py-3 text-sm">
          <span className="text-white/60">Zodiac: </span>
          <span>{result.sign1} {result.sign1Emoji} &times; {result.sign2} {result.sign2Emoji}</span>
        </div>

        {/* Reasons */}
        {result.reasons?.length > 0 && (
          <div className="mb-6">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-pink-300/70">Why You Match</p>
            <ul className="space-y-2 text-left text-sm">
              {result.reasons.map((reason, i) => (
                <li key={i} className="flex gap-2">
                  <span className="shrink-0 text-pink-400">&hearts;</span>
                  <span className="text-white/80">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* CTA for shared image */}
        <div className="share-show mb-6 hidden rounded-xl bg-pink-500/20 px-4 py-3 text-sm">
          <p className="font-semibold text-pink-300">Try yours now!</p>
          <p className="text-white/70">love-meterr.vercel.app</p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleShare}
            className="share-hide rounded-full bg-pink-500/80 px-6 py-3 font-semibold text-white transition-colors hover:bg-pink-500"
          >
            Share Result
          </button>
          <button
            onClick={onClose}
            className="share-hide rounded-full border border-pink-400/30 px-6 py-3 font-semibold text-pink-200 transition-colors hover:bg-white/10"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
