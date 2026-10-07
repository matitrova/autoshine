import AntesDespues from "./components/AntesDespues";
import GaleriaTrabajos from "./components/GaleriaTrabajos";
import Hexagonos from "./components/Hexagonos";
import ScrollExpandMedia from "./components/ScrollExpandMedia";
import ServiciosLumina from "./components/ServiciosLumina";
import Turno from "./components/Turno";
import WhatsAppFlotante from "./components/WhatsAppFlotante";
import { DIRECCION, INSTAGRAM, OTROS_SERVICIOS, PILARES, PREGUNTAS, PRODUCTOS, consultar, foto } from "./textos";

function Encabezado() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent px-4 pt-3 pb-6 md:px-8">
      <a href="#" className="flex items-center gap-2.5" aria-label="AutoShine, inicio">
        <img src="./logo.jpg" alt="" className="h-9 w-9 rounded-full ring-1 ring-oro/50" />
        <span className="titulo text-sm tracking-wide text-white">AutoShine</span>
      </a>
      <nav className="flex items-center gap-5 text-sm">
        <a href="#servicios" className="hidden text-white/75 hover:text-white md:inline">Servicios</a>
        <a href="#trabajos" className="hidden text-white/75 hover:text-white md:inline">Trabajos</a>
        <a href="#preguntas" className="hidden text-white/75 hover:text-white md:inline">Preguntas</a>
        <a href="#turno" className="rounded-full bg-oro px-4 py-2 font-semibold text-carbon transition hover:bg-oro-claro">
          Pedí tu turno
        </a>
      </nav>
    </header>
  );
}

function Pilares() {
  return (
    <div className="relative overflow-hidden px-6 py-20 md:px-16 md:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="etiqueta">Merlo, San Luis · desde 2020</p>
        <p className="mt-5 max-w-2xl text-2xl leading-snug text-white md:text-4xl">
          Sabemos cómo hacerlo. Lavado, pulido y protección de pintura, <span className="oro font-semibold">hechos a mano y con tiempo.</span>
        </p>
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-linea bg-linea md:grid-cols-3">
          {PILARES.map((p, i) => (
            <div key={p.titulo} className="bg-carbon p-7 md:p-9">
              <span className="font-mono text-xs text-oro">0{i + 1}</span>
              <h3 className="titulo mt-3 text-3xl text-white">{p.titulo}</h3>
              <p className="mt-2 text-ceniza">{p.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OtrosServicios() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:px-10">
      <p className="etiqueta">También hacemos</p>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {OTROS_SERVICIOS.map((s) => (
          <a key={s.titulo} href={consultar(s.titulo)} target="_blank" rel="noopener" className="group rounded-2xl border border-linea p-7 transition hover:border-oro/60">
            <h3 className="titulo text-xl text-white">{s.titulo}</h3>
            <p className="mt-3 text-sm leading-relaxed text-ceniza">{s.texto}</p>
            <span className="mt-5 inline-block text-sm font-semibold text-oro-claro">Consultar →</span>
          </a>
        ))}
      </div>
    </section>
  );
}

function Taller() {
  return (
    <section className="relative overflow-hidden border-y border-linea py-24">
      <Hexagonos className="opacity-60" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2 md:px-10">
        <div className="grid grid-cols-2 gap-4">
          <img src={foto("taller")} alt="El taller de AutoShine con el techo de luces hexagonales" loading="lazy" className="aspect-[3/4] w-full rounded-2xl object-cover" />
          <img src={foto("mesa")} alt="Productos y herramientas en la mesa de trabajo" loading="lazy" className="mt-12 aspect-[3/4] w-full rounded-2xl object-cover" />
        </div>
        <div>
          <p className="etiqueta">El taller</p>
          <h2 className="titulo mt-4 text-[7vw] md:text-6xl">
            Productos profesionales, <span className="oro">no de góndola</span>
          </h2>
          <p className="mt-5 text-ceniza [overflow-wrap:anywhere]">
            Trabajamos en {DIRECCION}. Capacitación realizada en{" "}
            <a href="https://www.instagram.com/mati_andrade_acrylicshine" target="_blank" rel="noopener" className="text-oro-claro hover:underline">
              @mati_andrade_acrylicshine
            </a>
            .
          </p>
          <ul className="mt-8 flex flex-wrap gap-2.5">
            {PRODUCTOS.map((p) => (
              <li key={p} className="rounded-full border border-linea bg-carbon/80 px-4 py-2 text-sm font-medium tracking-wide text-hueso">
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Preguntas() {
  return (
    <section id="preguntas" className="mx-auto max-w-3xl px-6 py-24 md:px-10">
      <p className="etiqueta">Preguntas frecuentes</p>
      <h2 className="titulo mt-4 text-4xl md:text-6xl">
        Lo que nos <span className="oro">preguntan</span>
      </h2>
      <div className="mt-10 divide-y divide-linea border-y border-linea">
        {PREGUNTAS.map(({ p, r }) => (
          <details key={p} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold text-white">
              {p}
              <span className="text-2xl text-oro transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 leading-relaxed text-ceniza">{r}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function Pie() {
  return (
    <footer className="border-t border-linea px-6 py-10 pb-24 text-sm text-ceniza md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 md:flex-row md:items-center">
        <p>
          <span className="titulo text-hueso">AutoShine</span> · Estética vehicular · {DIRECCION} · Desde 2020
        </p>
        <nav className="flex gap-5">
          <a href={INSTAGRAM} target="_blank" rel="noopener" className="hover:text-hueso">Instagram</a>
          <a href="./privacidad.html" className="hover:text-hueso">Privacidad</a>
        </nav>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <Encabezado />
      <main>
        <ScrollExpandMedia
          imagen={foto("portada")}
          alt="VW Golf recién terminado bajo el techo de luces hexagonales del taller"
          titulo={["Que tu auto", "vuelva a brillar"]}
          pista="Deslizá para entrar"
          fondo={<Hexagonos techo />}
        >
          <Pilares />
        </ScrollExpandMedia>
        <ServiciosLumina />
        <OtrosServicios />
        <GaleriaTrabajos />
        <AntesDespues />
        <Taller />
        <Preguntas />
        <Turno />
      </main>
      <Pie />
      <WhatsAppFlotante />
    </>
  );
}
