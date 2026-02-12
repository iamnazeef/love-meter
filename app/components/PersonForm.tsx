"use client";

import { motion } from "framer-motion";
import DatePicker from "./DatePicker";

interface PersonFormProps {
  label: string;
  name: string;
  dob: string;
  onNameChange: (value: string) => void;
  onDobChange: (value: string) => void;
  index?: number;
}

export default function PersonForm({
  label,
  name,
  dob,
  onNameChange,
  onDobChange,
  index = 0,
}: PersonFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
      whileHover={{ scale: 1.03 }}
      className="relative w-full md:w-72"
    >
      {/* Gradient border wrapper */}
      <div className="rounded-3xl bg-gradient-to-br from-pink-500/60 via-rose-400/40 to-red-500/60 p-[1.5px]">
        <div className="rounded-3xl bg-black/50 px-7 py-8 backdrop-blur-xl">
          {/* Title */}
          <div className="mb-6 flex items-center justify-center gap-2">
            <span className="text-lg text-pink-400">&hearts;</span>
            <h2 className="text-xl font-semibold tracking-wide text-white/90">
              {label}
            </h2>
            <span className="text-lg text-pink-400">&hearts;</span>
          </div>

          {/* Name field */}
          <div className="group mb-6">
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-pink-300/70">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter name..."
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              className="w-full border-b-2 border-white/15 bg-transparent px-1 pb-2 pt-1 text-base text-white placeholder-white/30 outline-none transition-all duration-300 focus:border-pink-400 focus:shadow-[0_2px_12px_-2px_rgba(236,72,153,0.4)]"
            />
          </div>

          {/* DOB field */}
          <div className="group">
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-pink-300/70">
              Date of Birth
            </label>
            <DatePicker value={dob} onChange={onDobChange} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
