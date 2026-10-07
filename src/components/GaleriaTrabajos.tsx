// Adaptado de "3D Parallax Unfurling Gallery" de Piyush (21st.dev, MIT).
// Cambios: usa el scroll de la página (el original traía una caja con scroll propio), mide
// la mitad de alto, fotos reales del taller, título que se desvanece al empezar y borde dorado.
import { useMemo, useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { TRABAJOS } from "../textos";

function Foto({ src }: { src: string }) {
  return (
    <div className="relative h-[220px] w-full flex-shrink-0 overflow-hidden rounded-md bg-carbon-2 sm:h-[300px] md:h-[400px]">
      <img src={src} alt="Auto terminado en el taller de AutoShine" loading="lazy" className="h-full w-full object-cover opacity-85 transition-opacity duration-300 hover:opacity-100" />
    </div>
  );
}

export default function GaleriaTrabajos() {
  const contenedor = useRef<HTMLElement>(null);

  // Cuatro columnas; cada una se repite para que nunca se vea el final al desplazarse
  const columnas = useMemo(
    () => [0, 1, 2, 3].map((c) => {
      const base = TRABAJOS.filter((_, i) => i % 4 === c);
      return [...base, ...base];
    }),
    [],
  );

  const { scrollYProgress } = useScroll({ target: contenedor, offset: ["start start", "end end"] });
  const progreso = useSpring(scrollYProgress, { stiffness: 100, damping: 20, mass: 0.5 });

  const ancho = useTransform(progreso, [0, 0.15], ["90vw", "100vw"]);
  const alto = useTransform(progreso, [0, 0.15], ["80vh", "100vh"]);
  const radio = useTransform(progreso, [0, 0.15], ["40px", "0px"]);
  const borde = useTransform(progreso, [0, 0.15], ["2px", "0px"]);
  const tituloOpacidad = useTransform(progreso, [0, 0.12], [1, 0]);

  const rotateY = useTransform(progreso, [0.15, 1], [-45, -8]);
  const rotateX = useTransform(progreso, [0.15, 1], [25, 4]);
  const rotateZ = useTransform(progreso, [0.15, 1], [15, 2]);
  const z = useTransform(progreso, [0.15, 1], [-800, 0]);

  const ys = [
    useTransform(progreso, [0.15, 1], ["0%", "-40%"]),
    useTransform(progreso, [0.15, 1], ["-40%", "10%"]),
    useTransform(progreso, [0.15, 1], ["0%", "-40%"]),
    useTransform(progreso, [0.15, 1], ["-30%", "20%"]),
  ];

  return (
    <section ref={contenedor} id="trabajos" className="relative h-[320vh] w-full bg-carbon">
      <div className="sticky top-0 flex h-[100svh] w-full items-center justify-center overflow-hidden">
        <motion.div
          style={{ width: ancho, height: alto, borderRadius: radio, borderWidth: borde, borderColor: "rgba(242,183,5,0.35)" }}
          className="relative mx-auto flex max-w-[1920px] items-center justify-center overflow-hidden bg-black"
        >
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center" style={{ perspective: "1000px" }}>
            <div className="absolute inset-0 z-20 shadow-[inset_0_100px_150px_-50px_rgba(0,0,0,1),inset_0_-100px_150px_-50px_rgba(0,0,0,1)]" />
            <div className="absolute inset-0 z-20 shadow-[inset_150px_0_150px_-50px_rgba(0,0,0,1),inset_-150px_0_150px_-50px_rgba(0,0,0,1)]" />

            <motion.div
              style={{ rotateX, rotateY, rotateZ, z, transformStyle: "preserve-3d" }}
              className="flex h-[150vh] w-[120vw] origin-center items-center justify-center gap-4 md:gap-6"
            >
              {columnas.map((col, c) => (
                <motion.div key={c} style={{ y: ys[c] }} className="pointer-events-auto flex w-[22vw] min-w-[160px] flex-col gap-4 md:gap-6">
                  {col.map((src, i) => (
                    <Foto key={`${c}-${i}`} src={src} />
                  ))}
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div style={{ opacity: tituloOpacidad }} className="pointer-events-none relative z-30 bg-[radial-gradient(closest-side,rgba(0,0,0,0.9),rgba(0,0,0,0.6)_60%,transparent)] px-10 py-20 text-center">
            <p className="etiqueta">Trabajos</p>
            <h2 className="titulo mt-4 text-5xl text-white md:text-7xl">
              Pasaron por <span className="oro">el taller</span>
            </h2>
            <p className="mx-auto mt-5 max-w-md text-white/75">Fotos reales de autos que salieron de Pepe Mercau 890. Seguí bajando.</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
