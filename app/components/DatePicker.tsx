"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { DayPicker } from "react-day-picker";
import { format, parse, isValid } from "date-fns";
import "react-day-picker/style.css";

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
}

export default function DatePicker({ value, onChange }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const selected = value ? parse(value, "yyyy-MM-dd", new Date()) : undefined;
  const display = selected && isValid(selected) ? format(selected, "MMM d, yyyy") : "";

  const updatePos = useCallback(() => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const popupHeight = 340;
    const above = spaceBelow < popupHeight && rect.top > popupHeight;
    setPos({
      top: above
        ? rect.top + window.scrollY - popupHeight - 8
        : rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX + rect.width / 2,
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    updatePos();
    window.addEventListener("scroll", updatePos, true);
    window.addEventListener("resize", updatePos);
    return () => {
      window.removeEventListener("scroll", updatePos, true);
      window.removeEventListener("resize", updatePos);
    };
  }, [open, updatePos]);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (
        btnRef.current?.contains(target) ||
        popupRef.current?.contains(target)
      )
        return;
      setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full border-b-2 border-white/15 bg-transparent px-1 pb-2 pt-1 text-left text-base text-white outline-none transition-all duration-300 hover:border-white/30 focus:border-pink-400 focus:shadow-[0_2px_12px_-2px_rgba(236,72,153,0.4)]"
      >
        {display || <span className="text-white/30">Select date...</span>}
      </button>

      {open &&
        createPortal(
          <div
            ref={popupRef}
            className="fixed rounded-2xl border border-white/10 bg-black/90 p-3 shadow-2xl shadow-pink-500/10 backdrop-blur-xl"
            style={{
              top: pos.top,
              left: pos.left,
              transform: "translateX(-50%)",
              zIndex: 9999,
            }}
          >
            <DayPicker
              mode="single"
              selected={selected}
              defaultMonth={selected || new Date(2000, 0)}
              captionLayout="dropdown"
              startMonth={new Date(1950, 0)}
              endMonth={new Date()}
              onSelect={(day) => {
                if (day) {
                  onChange(format(day, "yyyy-MM-dd"));
                  setOpen(false);
                }
              }}
              classNames={{
                root: "love-calendar",
                month_caption: "text-pink-200 font-semibold text-sm mb-2",
                weekday: "text-pink-400/60 text-xs font-medium",
                day: "text-white/80 text-sm rounded-lg hover:bg-pink-500/30 transition-colors w-9 h-9",
                selected: "!bg-pink-500 !text-white font-bold",
                today: "ring-1 ring-pink-400/50",
                chevron: "fill-pink-400",
                nav: "mb-1",
                dropdowns: "flex gap-2",
                dropdown:
                  "bg-black/80 text-pink-200 text-sm border border-white/10 rounded-lg px-2 py-1 outline-none",
              }}
            />
          </div>,
          document.body,
        )}
    </>
  );
}
