"use client";

import type { IconType } from "react-icons";
import {
  SiAssemblyscript,
  SiC,
  SiClojure,
  SiCplusplus,
  SiCsharp,
  SiCrystal,
  SiCss3,
  SiD,
  SiDart,
  SiElixir,
  SiErlang,
  SiFsharp,
  SiFortran,
  SiGo,
  SiGnubash,
  SiGroovy,
  SiHaskell,
  SiHtml5,
  SiJava,
  SiJavascript,
  SiJson,
  SiJulia,
  SiKotlin,
  SiLua,
  SiMarkdown,
  SiNim,
  SiNix,
  SiObjectivec,
  SiPerl,
  SiPhp,
  SiPowershell,
  SiPython,
  SiR,
  SiRuby,
  SiRust,
  SiScala,
  SiSolidity,
  SiSqlite,
  SiSwift,
  SiTailwindcss,
  SiTypescript,
  SiWebassembly,
  SiXml,
  SiYaml,
  SiZig,
} from "react-icons/si";

import { cn } from "@/lib/utils";

type LanguageConfig = {
  Icon: IconType;
  bg: string;
  iconClass: string;
};

const LANGUAGE_MAP: Record<string, LanguageConfig> = {
  // ─────────────────────────────────────────────
  // JAVASCRIPT / TYPESCRIPT
  // ─────────────────────────────────────────────

  javascript: {
    Icon: SiJavascript,
    bg: "bg-[#F7DF1E]",
    iconClass: "text-[#323330]",
  },

  js: {
    Icon: SiJavascript,
    bg: "bg-[#F7DF1E]",
    iconClass: "text-[#323330]",
  },

  typescript: {
    Icon: SiTypescript,
    bg: "bg-[#3178C6]",
    iconClass: "text-white",
  },

  ts: {
    Icon: SiTypescript,
    bg: "bg-[#3178C6]",
    iconClass: "text-white",
  },

  // ─────────────────────────────────────────────
  // JVM
  // ─────────────────────────────────────────────

  java: {
    Icon: SiJava,
    bg: "bg-[#ED8B00]",
    iconClass: "text-white",
  },

  kotlin: {
    Icon: SiKotlin,
    bg: "bg-[#7F52FF]",
    iconClass: "text-white",
  },

  scala: {
    Icon: SiScala,
    bg: "bg-[#DC322F]",
    iconClass: "text-white",
  },

  groovy: {
    Icon: SiGroovy,
    bg: "bg-[#4298B8]",
    iconClass: "text-white",
  },

  // ─────────────────────────────────────────────
  // PYTHON / RUBY / PHP
  // ─────────────────────────────────────────────

  python: {
    Icon: SiPython,
    bg: "bg-[#3776AB]",
    iconClass: "text-white",
  },

  py: {
    Icon: SiPython,
    bg: "bg-[#3776AB]",
    iconClass: "text-white",
  },

  ruby: {
    Icon: SiRuby,
    bg: "bg-[#CC342D]",
    iconClass: "text-white",
  },

  rb: {
    Icon: SiRuby,
    bg: "bg-[#CC342D]",
    iconClass: "text-white",
  },

  php: {
    Icon: SiPhp,
    bg: "bg-[#777BB4]",
    iconClass: "text-white",
  },

  // ─────────────────────────────────────────────
  // C FAMILY
  // ─────────────────────────────────────────────

  c: {
    Icon: SiC,
    bg: "bg-[#A8B9CC]",
    iconClass: "text-[#283593]",
  },

  "c++": {
    Icon: SiCplusplus,
    bg: "bg-[#00599C]",
    iconClass: "text-white",
  },

  cpp: {
    Icon: SiCplusplus,
    bg: "bg-[#00599C]",
    iconClass: "text-white",
  },

  "c#": {
    Icon: SiCsharp,
    bg: "bg-[#512BD4]",
    iconClass: "text-white",
  },

  csharp: {
    Icon: SiCsharp,
    bg: "bg-[#512BD4]",
    iconClass: "text-white",
  },

  cs: {
    Icon: SiCsharp,
    bg: "bg-[#512BD4]",
    iconClass: "text-white",
  },

  objectivec: {
    Icon: SiObjectivec,
    bg: "bg-[#438EFF]",
    iconClass: "text-white",
  },

  "objective-c": {
    Icon: SiObjectivec,
    bg: "bg-[#438EFF]",
    iconClass: "text-white",
  },

  // ─────────────────────────────────────────────
  // MODERN SYSTEM LANGUAGES
  // ─────────────────────────────────────────────

  go: {
    Icon: SiGo,
    bg: "bg-[#00ADD8]",
    iconClass: "text-white",
  },

  golang: {
    Icon: SiGo,
    bg: "bg-[#00ADD8]",
    iconClass: "text-white",
  },

  rust: {
    Icon: SiRust,
    bg: "bg-[#000000]",
    iconClass: "text-white",
  },

  swift: {
    Icon: SiSwift,
    bg: "bg-[#F05138]",
    iconClass: "text-white",
  },

  dart: {
    Icon: SiDart,
    bg: "bg-[#0175C2]",
    iconClass: "text-white",
  },

  d: {
    Icon: SiD,
    bg: "bg-[#B03931]",
    iconClass: "text-white",
  },

  zig: {
    Icon: SiZig,
    bg: "bg-[#F7A41D]",
    iconClass: "text-black",
  },

  nim: {
    Icon: SiNim,
    bg: "bg-[#FFE953]",
    iconClass: "text-[#000000]",
  },

  crystal: {
    Icon: SiCrystal,
    bg: "bg-[#000000]",
    iconClass: "text-white",
  },

  // ─────────────────────────────────────────────
  // FUNCTIONAL LANGUAGES
  // ─────────────────────────────────────────────

  haskell: {
    Icon: SiHaskell,
    bg: "bg-[#5E5086]",
    iconClass: "text-white",
  },

  elixir: {
    Icon: SiElixir,
    bg: "bg-[#4B275F]",
    iconClass: "text-white",
  },

  erlang: {
    Icon: SiErlang,
    bg: "bg-[#A90533]",
    iconClass: "text-white",
  },

  clojure: {
    Icon: SiClojure,
    bg: "bg-[#5881D8]",
    iconClass: "text-white",
  },

  fsharp: {
    Icon: SiFsharp,
    bg: "bg-[#378BBA]",
    iconClass: "text-white",
  },

  "f#": {
    Icon: SiFsharp,
    bg: "bg-[#378BBA]",
    iconClass: "text-white",
  },

  // ─────────────────────────────────────────────
  // SCRIPTING LANGUAGES
  // ─────────────────────────────────────────────

  lua: {
    Icon: SiLua,
    bg: "bg-[#000080]",
    iconClass: "text-white",
  },

  perl: {
    Icon: SiPerl,
    bg: "bg-[#39457E]",
    iconClass: "text-white",
  },

  bash: {
    Icon: SiGnubash,
    bg: "bg-[#4EAA25]",
    iconClass: "text-white",
  },

  shell: {
    Icon: SiGnubash,
    bg: "bg-[#4EAA25]",
    iconClass: "text-white",
  },

  sh: {
    Icon: SiGnubash,
    bg: "bg-[#4EAA25]",
    iconClass: "text-white",
  },

  powershell: {
    Icon: SiPowershell,
    bg: "bg-[#5391FE]",
    iconClass: "text-white",
  },

  ps1: {
    Icon: SiPowershell,
    bg: "bg-[#5391FE]",
    iconClass: "text-white",
  },

  // ─────────────────────────────────────────────
  // WEB
  // ─────────────────────────────────────────────

  html: {
    Icon: SiHtml5,
    bg: "bg-[#E34F26]",
    iconClass: "text-white",
  },

  html5: {
    Icon: SiHtml5,
    bg: "bg-[#E34F26]",
    iconClass: "text-white",
  },

  css: {
    Icon: SiCss3,
    bg: "bg-[#1572B6]",
    iconClass: "text-white",
  },

  sass: {
    Icon: SiCss3,
    bg: "bg-[#CC6699]",
    iconClass: "text-white",
  },

  scss: {
    Icon: SiCss3,
    bg: "bg-[#CC6699]",
    iconClass: "text-white",
  },

  tailwind: {
    Icon: SiTailwindcss,
    bg: "bg-[#06B6D4]",
    iconClass: "text-white",
  },

  "tailwind css": {
    Icon: SiTailwindcss,
    bg: "bg-[#06B6D4]",
    iconClass: "text-white",
  },

  // ─────────────────────────────────────────────
  // DATA / CONFIG / DOCUMENTATION
  // ─────────────────────────────────────────────

  json: {
    Icon: SiJson,
    bg: "bg-[#000000]",
    iconClass: "text-[#F7DF1E]",
  },

  yaml: {
    Icon: SiYaml,
    bg: "bg-[#CB171E]",
    iconClass: "text-white",
  },

  yml: {
    Icon: SiYaml,
    bg: "bg-[#CB171E]",
    iconClass: "text-white",
  },

  xml: {
    Icon: SiXml,
    bg: "bg-[#005FAD]",
    iconClass: "text-white",
  },

  markdown: {
    Icon: SiMarkdown,
    bg: "bg-[#000000]",
    iconClass: "text-white",
  },

  md: {
    Icon: SiMarkdown,
    bg: "bg-[#000000]",
    iconClass: "text-white",
  },

  nix: {
    Icon: SiNix,
    bg: "bg-[#5277C3]",
    iconClass: "text-white",
  },

  sql: {
    Icon: SiSqlite,
    bg: "bg-[#003B57]",
    iconClass: "text-white",
  },

  // ─────────────────────────────────────────────
  // SCIENTIFIC / DATA
  // ─────────────────────────────────────────────

  r: {
    Icon: SiR,
    bg: "bg-[#276DC3]",
    iconClass: "text-white",
  },

  julia: {
    Icon: SiJulia,
    bg: "bg-[#9558B2]",
    iconClass: "text-white",
  },

  fortran: {
    Icon: SiFortran,
    bg: "bg-[#734F96]",
    iconClass: "text-white",
  },

  // ─────────────────────────────────────────────
  // SMART CONTRACTS / WEBASSEMBLY
  // ─────────────────────────────────────────────

  solidity: {
    Icon: SiSolidity,
    bg: "bg-[#363636]",
    iconClass: "text-white",
  },

  sol: {
    Icon: SiSolidity,
    bg: "bg-[#363636]",
    iconClass: "text-white",
  },

  webassembly: {
    Icon: SiWebassembly,
    bg: "bg-[#654FF0]",
    iconClass: "text-white",
  },

  wasm: {
    Icon: SiWebassembly,
    bg: "bg-[#654FF0]",
    iconClass: "text-white",
  },

  assemblyscript: {
    Icon: SiAssemblyscript,
    bg: "bg-[#007ACC]",
    iconClass: "text-white",
  },
};

/**
 * Normalizes language names returned by GitHub
 * or detected from file extensions.
 */
function normalizeLanguage(language?: string | null) {
  if (!language) return "";

  return language
    .trim()
    .toLowerCase()
    .replace(/\.language$/, "");
}

export function getLanguageConfig(
  language?: string | null
): LanguageConfig | null {
  const key = normalizeLanguage(language);

  return LANGUAGE_MAP[key] ?? null;
}

export function LanguageIcon({
  language,
  className,
}: {
  language?: string | null;
  className?: string;
}) {
  const config = getLanguageConfig(language);

  if (!config) {
    return (
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted",
          className
        )}
      >
        <span className="text-xs font-bold text-muted-foreground">
          {"</>"}
        </span>
      </div>
    );
  }

  const { Icon, bg, iconClass } = config;

  return (
    <div
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-lg",
        bg,
        className
      )}
    >
      <Icon className={cn("size-4", iconClass)} />
    </div>
  );
}

export default LanguageIcon;