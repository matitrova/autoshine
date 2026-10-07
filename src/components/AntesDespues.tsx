// Deslizador de antes y después. Solo aparece si en textos.ts hay pares reales del mismo auto.
import { useState } from "react";
import { ANTES_DESPUES } from "../textos";

function Par({ antes, despues, titulo }: (typeof ANTES_DESPUES)[number]) {
  const [corte, setCorte] = useState(50);
  return (
    <figure>
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl md:aspect-[16/10]">
        <img src={despues} alt={`${titulo}, después`} className="absolute inset-0 h-full w-full object-cover" />
        <img src={antes} alt={`${titulo}, antes`} className="absolute inset-0 h-full w-full object-cover" style={{ clipPath: `inset(0 ${100 - corte}% 0 0)` }} />
        <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-oro shadow-[0_0_12px_#f2b705]" style={{ left: `${corte}%` }} />
        <span className="etiqueta absolute top-3 left-3 rounded bg-black/60 px-2 py-1">Antes</span>
        <span className="etiqueta absolute top-3 right-3 rounded bg-black/60 px-2 py-1">Después</span>
        <input
          type="range"
          min={0}
          max={100}
          value={corte}
          onChange={(e) => setCorte(Number(e.target.value))}
          aria-label={`Comparar antes y después: ${titulo}`}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      <figcaption className="mt-3 text-sm text-ceniza">{titulo}</figcaption>
    </figure>
  );
}

export default function AntesDespues() {
  if (ANTES_DESPUES.length === 0) return null;
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 md:px-10">
      <p className="etiqueta">Antes y después</p>
      <h2 className="titulo mt-4 text-4xl md:text-6xl">
        Deslizá y <span className="oro">mirá</span>
      </h2>
      <div className="mt-12 grid gap-10 md:grid-cols-2">
        {ANTES_DESPUES.map((par) => (
          <Par key={par.titulo} {...par} />
        ))}
      </div>
    </section>
  );
}
