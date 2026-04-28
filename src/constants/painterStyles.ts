import { PainterStyle } from "../types";

export const PAINTER_STYLES: PainterStyle[] = [
  {
    id: "editorial",
    name: "Editorial Aesthetic (Default)",
    bg: "bg-stone-50",
    text: "text-stone-900",
    accent: "bg-red-600",
    border: "border-stone-900",
    cardBg: "bg-white",
    font: "font-serif",
    shadow: "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
    headerBg: "bg-white border-b-4 border-stone-900"
  },
  {
    id: "van-gogh",
    name: "Van Gogh (Starry Night)",
    bg: "bg-[#0f172a]",
    text: "text-yellow-100",
    accent: "bg-yellow-500",
    border: "border-yellow-600",
    cardBg: "bg-[#1e293b]",
    font: "font-sans",
    shadow: "shadow-lg shadow-blue-900/50"
  },
  {
    id: "mondrian",
    name: "Mondrian (Composition)",
    bg: "bg-white",
    text: "text-black",
    accent: "bg-red-500",
    border: "border-black border-4",
    cardBg: "bg-white",
    font: "font-sans font-bold",
    shadow: "shadow-none"
  },
  {
    id: "basquiat",
    name: "Basquiat (Neo-Expressionism)",
    bg: "bg-zinc-900",
    text: "text-zinc-100",
    accent: "bg-amber-400",
    border: "border-amber-400 border-dashed",
    cardBg: "bg-zinc-800",
    font: "font-mono"
  },
  {
    id: "kusama",
    name: "Kusama (Dots)",
    bg: "bg-red-600",
    text: "text-white",
    accent: "bg-white text-black",
    border: "border-white",
    cardBg: "bg-red-500",
    font: "font-sans"
  },
  // Adding placeholders for more as requested (total 20 intended)
  { id: "hokusai", name: "Hokusai (Great Wave)", bg: "bg-blue-50", text: "text-blue-950", accent: "bg-blue-800", border: "border-blue-900", cardBg: "bg-white", font: "font-serif" },
  { id: "klimt", name: "Klimt (Gold Phase)", bg: "bg-gray-900", text: "text-yellow-200", accent: "bg-yellow-600", border: "border-yellow-400", cardBg: "bg-gray-800", font: "font-serif" },
  { id: "banksy", name: "Banksy (Street Art)", bg: "bg-zinc-200", text: "text-zinc-900", accent: "bg-red-500", border: "border-zinc-800", cardBg: "bg-white", font: "font-mono" },
  { id: "monet", name: "Monet (Impressionism)", bg: "bg-teal-50", text: "text-teal-900", accent: "bg-pink-300", border: "border-pink-200", cardBg: "bg-white", font: "font-serif" },
  { id: "dali", name: "Dali (Surrealism)", bg: "bg-orange-50", text: "text-red-950", accent: "bg-red-800", border: "border-red-900", cardBg: "bg-white", font: "font-serif italic" },
  { id: "warhol", name: "Warhol (Pop Art)", bg: "bg-fuchsia-400", text: "text-black", accent: "bg-cyan-400", border: "border-yellow-300", cardBg: "bg-green-300", font: "font-black" },
  { id: "picasso", name: "Picasso (Cubism)", bg: "bg-slate-200", text: "text-slate-900", accent: "bg-blue-600", border: "border-slate-800", cardBg: "bg-slate-100", font: "font-sans" },
  { id: "matisse", name: "Matisse (Fauvism)", bg: "bg-yellow-50", text: "text-blue-800", accent: "bg-green-500", border: "border-red-400", cardBg: "bg-white", font: "font-sans" },
  { id: "giger", name: "Giger (Biomechanical)", bg: "bg-black", text: "text-zinc-500", accent: "bg-zinc-700", border: "border-zinc-800", cardBg: "bg-zinc-900", font: "font-mono text-xs" },
  { id: "pollock", name: "Pollock (Drip)", bg: "bg-white", text: "text-black", accent: "bg-black", border: "border-black border-double", cardBg: "bg-white", font: "font-sans" },
  { id: "haring", name: "Haring (Pop Art)", bg: "bg-yellow-400", text: "text-black", accent: "bg-white", border: "border-black border-[6px]", cardBg: "bg-white", font: "font-sans font-bold" },
  { id: "magritte", name: "Magritte (Surrealism)", bg: "bg-sky-100", text: "text-slate-900", accent: "bg-slate-800", border: "border-slate-400", cardBg: "bg-white", font: "font-serif" },
  { id: "okeefe", name: "O'Keeffe (Modernism)", bg: "bg-rose-50", text: "text-rose-900", accent: "bg-rose-600", border: "border-rose-200", cardBg: "bg-white", font: "font-serif" },
  { id: "hopper", name: "Hopper (Realism)", bg: "bg-[#2d3a3a]", text: "text-yellow-50", accent: "bg-orange-700", border: "border-black", cardBg: "bg-[#1a2020]", font: "font-serif" },
  { id: "rothko", name: "Rothko (Color Field)", bg: "bg-red-950", text: "text-red-100", accent: "bg-orange-800", border: "border-orange-900", cardBg: "bg-red-900", font: "font-serif" },
];
