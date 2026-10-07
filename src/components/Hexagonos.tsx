// El techo del taller: un panal de tubos LED (cada lado es un tubo, con un hueco en
// los vértices, como en la foto) y una luz que lo barre de punta a punta.
import { useMemo } from "react";

const LADO = 56; // lado del hexágono, en unidades del viewBox
const HUECO = 7; // espacio entre tubos en cada vértice
const ANCHO = 1600;
const ALTO = 1000;

// Hexágonos con la parte plana arriba. Cada celda dibuja solo sus 3 lados de abajo:
// los de arriba los aporta la celda vecina, así ningún tubo se dibuja dos veces.
function panal() {
  const h = Math.sqrt(3) * LADO;
  const f = HUECO / LADO;
  let d = "";
  for (let col = -1; col * 1.5 * LADO < ANCHO + LADO; col++) {
    for (let fila = -1; fila * h < ALTO + h; fila++) {
      const cx = col * 1.5 * LADO;
      const cy = fila * h + (col % 2 ? h / 2 : 0);
      for (let k = 0; k < 3; k++) {
        const a1 = (Math.PI / 3) * k;
        const a2 = (Math.PI / 3) * (k + 1);
        const x1 = cx + LADO * Math.cos(a1);
        const y1 = cy + LADO * Math.sin(a1);
        const dx = cx + LADO * Math.cos(a2) - x1;
        const dy = cy + LADO * Math.sin(a2) - y1;
        d += `M${(x1 + dx * f).toFixed(1)} ${(y1 + dy * f).toFixed(1)}l${(dx * (1 - 2 * f)).toFixed(1)} ${(dy * (1 - 2 * f)).toFixed(1)}`;
      }
    }
  }
  return d;
}

interface Props {
  /** Visto como techo, en perspectiva (para la portada). */
  techo?: boolean;
  className?: string;
}

export default function Hexagonos({ techo = false, className = "" }: Props) {
  const d = useMemo(panal, []);
  const svg = (clase: string, trazo: string) => (
    <svg viewBox={`0 0 ${ANCHO} ${ALTO}`} preserveAspectRatio="xMidYMid slice" className={`absolute inset-0 h-full w-full ${clase}`}>
      <path d={d} className={trazo} />
    </svg>
  );

  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div
        className="absolute inset-0"
        style={techo ? { transform: "perspective(900px) rotateX(58deg) scale(2.4)", transformOrigin: "50% 0%" } : undefined}
      >
        {svg("", "hex-base")}
        {svg("hex-luz", "hex-brillo")}
      </div>
    </div>
  );
}
