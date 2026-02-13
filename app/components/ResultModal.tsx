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

  const captureCard = useCallback(async () => {
    if (!cardRef.current) return null;

    const el = cardRef.current;
    const prevMaxH = el.style.maxHeight;
    const prevOverflow = el.style.overflow;
    el.style.maxHeight = "none";
    el.style.overflow = "visible";

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

    return dataUrl;
  }, []);

  const handleShare = useCallback(async () => {
    const dataUrl = await captureCard();
    if (!dataUrl) return;

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
  }, [captureCard, name1, name2, result.percentage]);

  const handleStoryShare = useCallback(async () => {
    const dataUrl = await captureCard();
    if (!dataUrl) return;

    // Draw card centered on a 1080x1920 story canvas
    const img = new Image();
    img.src = dataUrl;
    await new Promise((r) => (img.onload = r));

    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext("2d")!;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 1920);
    grad.addColorStop(0, "#1a0a10");
    grad.addColorStop(1, "#0d0509");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1920);

    // Scale card to fit width with padding, leave room for URL at bottom
    const pad = 60;
    const urlSpace = 100;
    const scale = (1080 - pad * 2) / img.width;
    const drawW = img.width * scale;
    const drawH = img.height * scale;
    const x = (1080 - drawW) / 2;
    const y = (1920 - drawH - urlSpace) / 2;
    ctx.drawImage(img, x, y, drawW, drawH);

    // Draw URL below the card
    ctx.textAlign = "center";
    ctx.fillStyle = "#f9a8d4"; // pink-300
    ctx.font = "bold 32px sans-serif";
    ctx.fillText("Try yours now!", 540, y + drawH + 50);
    ctx.fillStyle = "#ffffff99";
    ctx.font = "28px sans-serif";
    ctx.fillText("love-meterr.vercel.app", 540, y + drawH + 90);

    const storyBlob = await new Promise<Blob>((r) =>
      canvas.toBlob((b) => r(b!), "image/png")
    );
    const file = new File([storyBlob], "love-story.png", { type: "image/png" });

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file] });
    } else {
      const url = URL.createObjectURL(storyBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "love-story.png";
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [captureCard]);

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
        <div className="share-hide flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleShare}
            className="rounded-full bg-pink-500/80 px-6 py-3 font-semibold text-white transition-colors hover:bg-pink-500"
          >
            Share Result
          </button>
          <button
            onClick={handleStoryShare}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
            Story
          </button>
          <button
            onClick={onClose}
            className="rounded-full border border-pink-400/30 px-6 py-3 font-semibold text-pink-200 transition-colors hover:bg-white/10"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
