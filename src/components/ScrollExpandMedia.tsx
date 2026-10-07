// Adaptado de "Scroll Media Expansion Hero" de Arunachalam (21st.dev, MIT), vía el portfolio.
// Cambios para AutoShine: foto en vez de video, título en dos renglones que se separan,
// fondo propio (el techo de hexágonos) y brillo dorado. Mantiene teclado, "reducir
// movimiento" (arranca expandida) y que los links #seccion expandan antes de saltar.
import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
  imagen: string;
  alt: string;
  titulo: [string, string];
  pista?: string;
  fondo?: ReactNode;
  children?: ReactNode;
}

const reducirMovimiento = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function ScrollExpandMedia({ imagen, alt, titulo, pista, fondo, children }: Props) {
  const [progreso, setProgreso] = useState(() => (reducirMovimiento() ? 1 : 0));
  const [expandida, setExpandida] = useState(() => reducirMovimiento());
  const [inicioTouch, setInicioTouch] = useState(0);
  const [esMovil, setEsMovil] = useState(false);

  useEffect(() => {
    const avanzar = (delta: number) => {
      const nuevo = Math.min(Math.max(progreso + delta, 0), 1);
      setProgreso(nuevo);
      if (nuevo >= 1) setExpandida(true);
    };
    const enLaPunta = () => window.scrollY <= 5;

    const rueda = (e: WheelEvent) => {
      if (expandida && e.deltaY < 0 && enLaPunta()) {
        setExpandida(false);
        e.preventDefault();
      } else if (!expandida) {
        e.preventDefault();
        avanzar(e.deltaY * 0.0009);
      }
    };
    const tocar = (e: TouchEvent) => setInicioTouch(e.touches[0].clientY);
    const mover = (e: TouchEvent) => {
      if (!inicioTouch) return;
      const y = e.touches[0].clientY;
      const delta = inicioTouch - y;
      if (expandida && delta < -20 && enLaPunta()) {
        setExpandida(false);
        e.preventDefault();
      } else if (!expandida) {
        e.preventDefault();
        avanzar(delta * (delta < 0 ? 0.008 : 0.005));
        setInicioTouch(y);
      }
    };
    const soltar = () => setInicioTouch(0);
    const tecla = (e: KeyboardEvent) => {
      const abajo = ["ArrowDown", "PageDown", " ", "End"].includes(e.key);
      const arriba = ["ArrowUp", "PageUp", "Home"].includes(e.key);
      if (!expandida && abajo) {
        e.preventDefault();
        avanzar(e.key === "End" ? 1 : 0.25);
      } else if (expandida && arriba && enLaPunta()) {
        e.preventDefault();
        setExpandida(false);
        avanzar(-0.25);
      }
    };
    const fijarArriba = () => {
      if (!expandida) window.scrollTo(0, 0);
    };
    // Un link del menú (#turno) abre la portada y recién ahí salta.
    const saltar = () => {
      const destino = document.getElementById(location.hash.slice(1));
      if (!destino) return;
      setProgreso(1);
      setExpandida(true);
      requestAnimationFrame(() => requestAnimationFrame(() => destino.scrollIntoView()));
    };

    window.addEventListener("wheel", rueda, { passive: false });
    window.addEventListener("touchstart", tocar, { passive: false });
    window.addEventListener("touchmove", mover, { passive: false });
    window.addEventListener("touchend", soltar);
    window.addEventListener("keydown", tecla);
    window.addEventListener("scroll", fijarArriba);
    window.addEventListener("hashchange", saltar);
    return () => {
      window.removeEventListener("wheel", rueda);
      window.removeEventListener("touchstart", tocar);
      window.removeEventListener("touchmove", mover);
      window.removeEventListener("touchend", soltar);
      window.removeEventListener("keydown", tecla);
      window.removeEventListener("scroll", fijarArriba);
      window.removeEventListener("hashchange", saltar);
    };
  }, [progreso, expandida, inicioTouch]);

  useEffect(() => {
    const medir = () => setEsMovil(window.innerWidth < 768);
    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, []);

  const ancho = 300 + progreso * (esMovil ? 650 : 1250);
  const alto = 400 + progreso * (esMovil ? 200 : 400);
  const separar = progreso * (esMovil ? 180 : 150);
  const mostrarContenido = expandida || progreso >= 1;

  return (
    <div className="overflow-x-hidden">
      <section className="relative flex min-h-[100dvh] flex-col items-center justify-start">
        <div className="relative flex min-h-[100dvh] w-full flex-col items-center">
          {fondo && (
            <motion.div className="absolute inset-0 z-0 h-[100dvh]" animate={{ opacity: 1 - progreso * 0.85 }} transition={{ duration: 0.1 }}>
              {fondo}
            </motion.div>
          )}

          <div className="relative z-10 mx-auto flex w-full flex-col items-center justify-start">
            <div className="relative flex h-[100dvh] w-full flex-col items-center justify-center">
              <div
                className="absolute top-1/2 left-1/2 z-0 -translate-x-1/2 -translate-y-1/2 rounded-2xl"
                style={{
                  width: `${ancho}px`,
                  height: `${alto}px`,
                  maxWidth: "95vw",
                  maxHeight: "85vh",
                  boxShadow: `0 0 ${60 + progreso * 60}px rgba(242, 183, 5, ${0.18 + progreso * 0.12})`,
                }}
              >
                <div className="pointer-events-none relative h-full w-full">
                  <img src={imagen} alt={alt} className="h-full w-full rounded-xl object-cover" fetchPriority="high" />
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-black"
                    initial={{ opacity: 0.55 }}
                    animate={{ opacity: 0.5 - progreso * 0.25 }}
                    transition={{ duration: 0.2 }}
                  />
                </div>

                {pista && (
                  <p
                    className="etiqueta relative z-10 mt-4 text-center whitespace-nowrap"
                    style={{ transform: `translateX(${separar}vw)`, opacity: 1 - progreso }}
                  >
                    {pista}
                  </p>
                )}
              </div>

              <h1 className="titulo relative z-10 flex w-full flex-col items-center justify-center px-4 text-center text-[13vw] drop-shadow-[0_0_30px_rgba(0,0,0,0.6)] md:text-8xl lg:text-9xl">
                <span className="text-white" style={{ transform: `translateX(-${separar}vw)` }}>
                  {titulo[0]}
                </span>
                <span className="oro" style={{ transform: `translateX(${separar}vw)` }}>
                  {titulo[1]}
                </span>
              </h1>
            </div>

            <motion.section
              className="flex w-full flex-col"
              inert={!mostrarContenido}
              initial={{ opacity: 0 }}
              animate={{ opacity: mostrarContenido ? 1 : 0 }}
              transition={{ duration: 0.7 }}
            >
              {children}
            </motion.section>
          </div>
        </div>
      </section>
    </div>
  );
}
