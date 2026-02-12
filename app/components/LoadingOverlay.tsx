"use client";

import { motion } from "framer-motion";

const floatingHearts = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  size: 14 + Math.random() * 20,
  delay: Math.random() * 2,
  duration: 2 + Math.random() * 2,
}));

export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-black/70 backdrop-blur-md">
      {/* Floating hearts background */}
      {floatingHearts.map((h) => (
        <motion.span
          key={h.id}
          initial={{ y: "100vh", opacity: 0 }}
          animate={{ y: "-20vh", opacity: [0, 1, 1, 0] }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
          className="pointer-events-none absolute text-pink-500/40"
          style={{ left: `${h.x}%`, fontSize: h.size }}
        >
          &hearts;
        </motion.span>
      ))}

      {/* Center content */}
      <div className="relative flex flex-col items-center">
        {/* Pulsing glow ring */}
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute h-40 w-40 rounded-full bg-pink-500/20 blur-2xl"
        />

        {/* Beating heart */}
        <motion.div
          animate={{ scale: [1, 1.2, 1, 1.15, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          className="relative mb-6 text-8xl text-pink-500"
          style={{ filter: "drop-shadow(0 0 20px rgba(236,72,153,0.6))" }}
        >
          &hearts;
        </motion.div>

        {/* Text */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 text-2xl font-bold text-white"
        >
          Calculating Love
        </motion.p>

        {/* Animated dots */}
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
              className="text-2xl text-pink-400"
            >
              &hearts;
            </motion.span>
          ))}
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-sm text-pink-200/60"
        >
          Reading the stars for you...
        </motion.p>
      </div>
    </div>
  );
}
