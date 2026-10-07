// El formulario arma el mensaje y abre WhatsApp. No se envía nada solo.
import type { FormEvent } from "react";
import { DIRECCION, HORARIOS, INSTAGRAM, MAPA, OPCIONES_SERVICIO, TELEFONO, wa } from "../textos";
import Hexagonos from "./Hexagonos";

const campo = "mt-2 w-full rounded-lg border border-linea bg-carbon px-3.5 py-3 text-hueso outline-none transition focus:border-oro";
const etiqueta = "block text-xs font-semibold tracking-[0.18em] text-ceniza uppercase";

function armarMensaje(f: FormData) {
  const v = (k: string) => String(f.get(k) ?? "").trim();
  const dia = v("dia");
  const franja = v("franja");
  const lineas = [
    "Hola AutoShine! Quiero pedir un turno.",
    "",
    `Servicio: ${v("servicio")}`,
    `Vehículo: ${v("tipo")}${v("modelo") ? ` - ${v("modelo")}` : ""}`,
    `Cuándo: ${dia}${franja === "Me da igual" ? "" : `, ${franja.toLowerCase()}`}`,
  ];
  if (v("nombre")) lineas.push(`Mi nombre: ${v("nombre")}`);
  if (v("nota")) lineas.push(`Aclaración: ${v("nota")}`);
  lineas.push("", "Gracias!");
  return lineas.join("\n");
}

export default function Turno() {
  const enviar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    window.open(wa(armarMensaje(new FormData(e.currentTarget))), "_blank", "noopener");
  };

  return (
    <section id="turno" className="relative overflow-hidden border-t border-linea bg-carbon-2 py-24">
      <Hexagonos className="opacity-40" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-[1.4fr_1fr] md:px-10">
        <div>
          <p className="etiqueta">Turnos</p>
          <h2 className="titulo mt-4 text-5xl md:text-7xl">
            Pedí tu <span className="oro">turno</span>
          </h2>
          <p className="mt-5 max-w-lg text-ceniza">Completá los datos y se abre tu WhatsApp con el mensaje ya armado. Vos lo mandás cuando quieras.</p>

          <form onSubmit={enviar} className="mt-10 grid gap-5 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className={etiqueta}>Qué necesitás</span>
              <select name="servicio" className={campo}>
                {OPCIONES_SERVICIO.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </label>
            <label>
              <span className={etiqueta}>Vehículo</span>
              <select name="tipo" className={campo}>
                <option>Auto</option>
                <option>Camioneta o pick-up</option>
                <option>Moto</option>
              </select>
            </label>
            <label>
              <span className={etiqueta}>Marca y modelo</span>
              <input name="modelo" className={campo} placeholder="VW Gol, Hilux, Rouser…" autoComplete="off" />
            </label>
            <label>
              <span className={etiqueta}>Día que te sirve</span>
              <select name="dia" className={campo}>
                {["Lo antes posible", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"].map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </label>
            <label>
              <span className={etiqueta}>Horario</span>
              <select name="franja" className={campo}>
                <option>Por la mañana</option>
                <option>Por la tarde</option>
                <option>Me da igual</option>
              </select>
            </label>
            <label className="sm:col-span-2">
              <span className={etiqueta}>Tu nombre</span>
              <input name="nombre" className={campo} placeholder="Cómo te llamamos" autoComplete="given-name" />
            </label>
            <label className="sm:col-span-2">
              <span className={etiqueta}>Algo que quieras aclarar (opcional)</span>
              <textarea name="nota" rows={3} className={campo} placeholder="Tiene pelo de perro en el asiento de atrás, las ópticas están muy amarillas…" />
            </label>
            <button type="submit" className="flex items-center justify-center gap-2 rounded-full bg-wa px-6 py-4 font-semibold text-carbon transition hover:brightness-110 sm:col-span-2">
              Abrir WhatsApp con el turno
            </button>
          </form>
        </div>

        <aside className="space-y-5 self-start md:mt-24">
          <div className="rounded-2xl bg-oro p-6 text-carbon">
            <p className="text-xs font-bold tracking-[0.2em] uppercase">Horarios</p>
            <dl className="mt-3 space-y-1.5">
              {HORARIOS.map(([d, h]) => (
                <div key={d} className="flex justify-between gap-4">
                  <dt className="font-semibold">{d}</dt>
                  <dd>{h}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="rounded-2xl border border-linea bg-carbon p-6">
            <p className="etiqueta">Dónde estamos</p>
            <p className="mt-3">{DIRECCION}</p>
            <a href={MAPA} target="_blank" rel="noopener" className="mt-3 inline-block text-oro-claro underline-offset-4 hover:underline">
              Cómo llegar →
            </a>
          </div>
          <div className="rounded-2xl border border-linea bg-carbon p-6">
            <p className="etiqueta">Escribinos</p>
            <a href={wa("Hola AutoShine!")} target="_blank" rel="noopener" className="mt-3 block hover:text-oro-claro">
              {TELEFONO}
            </a>
            <a href={INSTAGRAM} target="_blank" rel="noopener" className="mt-1 block text-ceniza hover:text-oro-claro">
              @autoshine.detailing
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
