"use client";

import { motion, AnimatePresence } from "framer-motion";

interface CalculateButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isReady?: boolean;
}

function SadFace() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" fill="none">
      {/* Heart shape */}
      <path
        d="M50 88 C25 65, 2 45, 2 28 C2 14, 14 2, 28 2 C36 2, 44 7, 50 16 C56 7, 64 2, 72 2 C86 2, 98 14, 98 28 C98 45, 75 65, 50 88Z"
        className="fill-rose-900/90 stroke-pink-500/40"
        strokeWidth="1.5"
      />
      {/* Left eye — droopy */}
      <ellipse cx="36" cy="38" rx="4.5" ry="5" className="fill-pink-300/60" />
      <ellipse cx="36" cy="40" rx="2.5" ry="2.5" className="fill-pink-200/80" />
      {/* Right eye — droopy */}
      <ellipse cx="64" cy="38" rx="4.5" ry="5" className="fill-pink-300/60" />
      <ellipse cx="64" cy="40" rx="2.5" ry="2.5" className="fill-pink-200/80" />
      {/* Sad mouth */}
      <path
        d="M38 58 Q50 52, 62 58"
        className="stroke-pink-300/60"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Tear left */}
      <ellipse cx="32" cy="48" rx="2" ry="3" className="fill-blue-300/40" />
    </svg>
  );
}

function HappyFace() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" fill="none">
      {/* Heart shape */}
      <path
        d="M50 88 C25 65, 2 45, 2 28 C2 14, 14 2, 28 2 C36 2, 44 7, 50 16 C56 7, 64 2, 72 2 C86 2, 98 14, 98 28 C98 45, 75 65, 50 88Z"
        className="fill-pink-500 stroke-pink-300/50"
        strokeWidth="1.5"
      />
      {/* Shine */}
      <ellipse cx="28" cy="24" rx="8" ry="5" className="fill-white/15" transform="rotate(-20 28 24)" />
      {/* Left eye — happy squint */}
      <path
        d="M30 36 Q36 32, 42 36"
        className="stroke-white"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Right eye — happy squint */}
      <path
        d="M58 36 Q64 32, 70 36"
        className="stroke-white"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Blush */}
      <ellipse cx="30" cy="44" rx="6" ry="3.5" className="fill-rose-300/30" />
      <ellipse cx="70" cy="44" rx="6" ry="3.5" className="fill-rose-300/30" />
      {/* Big smile */}
      <path
        d="M36 52 Q50 64, 64 52"
        className="stroke-white"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Sparkle left */}
      <path d="M18 18 L20 14 L22 18 L26 20 L22 22 L20 26 L18 22 L14 20Z" className="fill-yellow-200/70" />
      {/* Sparkle right */}
      <path d="M78 14 L80 10 L82 14 L86 16 L82 18 L80 22 L78 18 L74 16Z" className="fill-yellow-200/70" />
    </svg>
  );
}

export default function CalculateButton({ onClick, disabled, isReady }: CalculateButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled || !isReady}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: 1,
        scale: 1,
        filter: isReady
          ? "drop-shadow(0 0 24px rgba(236,72,153,0.6))"
          : "drop-shadow(0 0 8px rgba(236,72,153,0.2))",
      }}
      transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
      whileHover={isReady ? { scale: 1.12 } : {}}
      whileTap={isReady ? { scale: 0.92 } : {}}
      className={`group relative flex h-36 w-36 shrink-0 flex-col items-center justify-center md:h-44 md:w-44 ${
        isReady ? "cursor-pointer" : "cursor-default"
      }`}
    >
      {/* Heart face */}
      <div className="relative h-28 w-28 md:h-36 md:w-36">
        <AnimatePresence mode="wait">
          {isReady ? (
            <motion.div
              key="happy"
              initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
              animate={{
                scale: [1, 1.15, 1, 1.1, 1],
                opacity: 1,
                rotate: 0,
              }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{
                scale: {
                  duration: 0.8,
                  repeat: Infinity,
                  repeatDelay: 0.4,
                  ease: "easeInOut",
                },
                opacity: { duration: 0.4, ease: "backOut" },
                rotate: { duration: 0.4, ease: "backOut" },
              }}
              className="h-full w-full"
            >
              <HappyFace />
            </motion.div>
          ) : (
            <motion.div
              key="sad"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full"
            >
              <SadFace />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Label */}
      {isReady && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-1 text-xs font-bold uppercase tracking-widest text-pink-200 md:text-sm"
        >
          Click to Calculate Love
        </motion.span>
      )}
    </motion.button>
  );
}
