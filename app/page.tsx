"use client";

import dynamic from "next/dynamic";
import { useLoveMeter } from "./hooks/useLoveMeter";

const PersonForm = dynamic(() => import("./components/PersonForm"), { ssr: false });
const CalculateButton = dynamic(() => import("./components/CalculateButton"), { ssr: false });
const ResultModal = dynamic(() => import("./components/ResultModal"), { ssr: false });
const LoadingOverlay = dynamic(() => import("./components/LoadingOverlay"), { ssr: false });
const HeartConfetti = dynamic(() => import("./components/HeartConfetti"), { ssr: false });

export default function Home() {
  const {
    name1, setName1, dob1, setDob1,
    name2, setName2, dob2, setDob2,
    result, loading, calculate, reset,
  } = useLoveMeter();

  const isReady = !!(name1.trim() && name2.trim() && dob1 && dob2);

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center"
      style={{
        backgroundImage: "url(/bg.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 my-auto flex w-full max-w-4xl flex-col items-center gap-6 px-6 py-12 md:flex-row md:items-center md:justify-center md:gap-8">
        <PersonForm
          label="His"
          name={name1}
          dob={dob1}
          onNameChange={setName1}
          onDobChange={setDob1}
          index={0}
        />

        <CalculateButton onClick={calculate} disabled={loading} isReady={isReady} />

        <PersonForm
          label="Her"
          name={name2}
          dob={dob2}
          onNameChange={setName2}
          onDobChange={setDob2}
          index={1}
        />
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-auto pb-4 pt-8 text-center text-sm text-white/50">
        Developed by{" "}
        <a
          href="https://github.com/iamnazeef"
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-300/70 underline underline-offset-2 hover:text-pink-300"
        >
          Nazeef
        </a>
      </footer>

      {loading && <LoadingOverlay />}

      {result && (
        <>
          <HeartConfetti />
          <ResultModal result={result} name1={name1} name2={name2} onClose={reset} />
        </>
      )}
    </div>
  );
}
