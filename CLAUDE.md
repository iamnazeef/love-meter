# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — dev server (localhost:3000)
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — ESLint (v9 flat config, next/core-web-vitals + typescript)

No test framework configured yet.

## Architecture

Next.js 16 app using App Router (`app/` directory), React 19, TypeScript, Tailwind CSS v4.

- `app/layout.tsx` — root layout, Geist font setup via next/font/google
- `app/page.tsx` — home page
- `app/globals.css` — Tailwind + CSS custom properties for light/dark theming
- `@/*` path alias maps to repo root (tsconfig)
- Server components by default; add `"use client"` only when needed
