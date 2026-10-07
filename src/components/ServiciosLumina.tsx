// Adaptado de "Lumina Interactive List" de Hardik Kachhiyani (21st.dev).
// Cambios: WebGL directo en vez de cargar three.js entero para un solo rectángulo; solo el
// efecto "vidrio" (los otros cuatro del original eran stubs); framer-motion en vez de GSAP;
// textos de AutoShine; se pausa fuera de pantalla; sin WebGL cae a una foto común.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SERVICIOS, consultar, foto } from "../textos";

const TRANSICION_MS = 2200;
const SLIDE_MS = 6500;

const VERT = `attribute vec2 p; varying vec2 vUv;
void main() { vUv = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }`;

// El shader "glass" del original con sus valores por defecto ya aplicados (todos 1.0).
const FRAG = `precision highp float;
uniform sampler2D uTexture1, uTexture2;
uniform float uProgress;
uniform vec2 uResolution, uTexture1Size, uTexture2Size;
varying vec2 vUv;
vec2 cover(vec2 uv, vec2 t) {
  vec2 s = uResolution / t; float k = max(s.x, s.y);
  vec2 sz = t * k; vec2 off = (uResolution - sz) * 0.5;
  return (uv * uResolution - off) / sz;
}
void main() {
  float time = uProgress * 5.0;
  vec2 uv1 = cover(vUv, uTexture1Size), uv2 = cover(vUv, uTexture2Size);
  float br = uProgress * length(uResolution) * 0.85;
  vec2 p = vUv * uResolution, c = uResolution * 0.5;
  float d = length(p - c), nd = d / max(br, 0.001);
  float inside = smoothstep(br + 3.0, br - 3.0, d);
  vec4 img;
  if (inside > 0.0) {
    float ro = 0.08 * pow(smoothstep(0.3, 1.0, nd), 1.5);
    vec2 dir = d > 0.0 ? (p - c) / d : vec2(0.0);
    vec2 duv = uv2 - dir * ro;
    duv += vec2(sin(time + nd * 10.0), cos(time * 0.8 + nd * 8.0)) * 0.015 * nd * inside;
    float ca = 0.02 * pow(smoothstep(0.3, 1.0, nd), 1.2);
    img = vec4(texture2D(uTexture2, duv + dir * ca * 1.2).r, texture2D(uTexture2, duv + dir * ca * 0.2).g,
               texture2D(uTexture2, duv - dir * ca * 0.8).b, 1.0);
    img.rgb += smoothstep(0.95, 1.0, nd) * (1.0 - smoothstep(1.0, 1.01, nd)) * 0.08;
  } else {
    img = texture2D(uTexture2, uv2);
  }
  if (uProgress > 0.95) img = mix(img, texture2D(uTexture2, uv2), (uProgress - 0.95) / 0.05);
  gl_FragColor = mix(texture2D(uTexture1, uv1), img, inside);
}`;

const suave = (x: number) => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2); // power2.inOut

function cargar(src: string) {
  return new Promise<HTMLImageElement>((ok, mal) => {
    const im = new Image();
    im.onload = () => ok(im);
    im.onerror = mal;
    im.src = src;
  });
}

type Motor = { ir: (i: number) => boolean };

function crearMotor(canvas: HTMLCanvasElement, imagenes: HTMLImageElement[], inicial: number): Motor | null {
  const gl = canvas.getContext("webgl", { antialias: false });
  if (!gl) return null;
  const shader = (tipo: number, src: string) => {
    const s = gl.createShader(tipo)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
  const pos = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(pos);
  gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  const texturas = imagenes.map((im) => {
    const t = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
    // Medidas no potencia de 2: sin mipmaps y con bordes fijos, como pide WebGL 1
    for (const [k, v] of [
      [gl.TEXTURE_MIN_FILTER, gl.LINEAR],
      [gl.TEXTURE_MAG_FILTER, gl.LINEAR],
      [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE],
      [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE],
    ])
      gl.texParameteri(gl.TEXTURE_2D, k, v);
    return t;
  });
  const u = (n: string) => gl.getUniformLocation(prog, n);
  gl.uniform1i(u("uTexture1"), 0);
  gl.uniform1i(u("uTexture2"), 1);

  let desde = inicial;
  let hacia = inicial;
  let progreso = 0;
  let animando = false;

  const dibujar = () => {
    const pares: [number, number][] = [[0, desde], [1, hacia]];
    for (const [unidad, i] of pares) {
      gl.activeTexture(gl.TEXTURE0 + unidad);
      gl.bindTexture(gl.TEXTURE_2D, texturas[i]);
      gl.uniform2f(u(`uTexture${unidad + 1}Size`), imagenes[i].naturalWidth, imagenes[i].naturalHeight);
    }
    gl.uniform1f(u("uProgress"), progreso);
    gl.uniform2f(u("uResolution"), canvas.width, canvas.height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };
  const medir = () => {
    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    dibujar();
  };
  new ResizeObserver(medir).observe(canvas);
  medir();

  return {
    ir(i) {
      if (animando || i === hacia) return false;
      desde = hacia;
      hacia = i;
      animando = true;
      const t0 = performance.now();
      const paso = (t: number) => {
        const x = Math.min((t - t0) / TRANSICION_MS, 1);
        progreso = suave(x);
        if (x >= 1) {
          progreso = 0;
          desde = hacia;
          animando = false;
        } else requestAnimationFrame(paso);
        dibujar();
      };
      requestAnimationFrame(paso);
      return true;
    },
  };
}

export default function ServiciosLumina() {
  const seccion = useRef<HTMLElement>(null);
  const lienzo = useRef<HTMLCanvasElement>(null);
  const motor = useRef<Motor | null>(null);
  const [actual, setActual] = useState(0);
  const actualRef = useRef(0);
  actualRef.current = actual;
  const [webgl, setWebgl] = useState(false);
  const [visible, setVisible] = useState(false);
  const quieto = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  // Recorte horizontal para compu y vertical para celular, generados por scripts/fotos.py
  const fotos = useMemo(() => {
    const sufijo = window.innerWidth > window.innerHeight ? "h" : "v";
    return SERVICIOS.map((s) => foto(`${s.foto}-${sufijo}`));
  }, []);

  useEffect(() => {
    let vivo = true;
    Promise.all(fotos.map(cargar))
      .then((imgs) => {
        if (!vivo || !lienzo.current) return;
        motor.current = crearMotor(lienzo.current, imgs, actualRef.current);
        setWebgl(motor.current !== null);
      })
      .catch(() => setWebgl(false));
    return () => {
      vivo = false;
    };
  }, [fotos]);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.4 });
    io.observe(seccion.current!);
    return () => io.disconnect();
  }, []);

  const ir = useCallback(
    (i: number) => {
      if (i === actual) return;
      // Con WebGL, el motor decide si puede (no corta una transición a la mitad)
      if (motor.current && !motor.current.ir(i)) return;
      setActual(i);
    },
    [actual],
  );

  useEffect(() => {
    if (!visible || quieto) return;
    const t = setTimeout(() => ir((actual + 1) % SERVICIOS.length), SLIDE_MS);
    return () => clearTimeout(t);
  }, [actual, visible, quieto, ir]);

  const s = SERVICIOS[actual];

  return (
    <section ref={seccion} id="servicios" className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-black">
      {/* Foto común: se ve mientras carga WebGL y queda si el teléfono no lo tiene */}
      {!webgl && (
        <AnimatePresence>
          <motion.img
            key={actual}
            src={fotos[actual]}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          />
        </AnimatePresence>
      )}
      <canvas ref={lienzo} className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${webgl ? "opacity-100" : "opacity-0"}`} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/10 to-black/85" />

      <div className="absolute top-20 right-6 left-6 flex items-center justify-between md:top-24 md:right-10 md:left-10">
        <p className="etiqueta">Lo que hacemos</p>
        <p className="font-mono text-sm tracking-widest text-white/80" aria-live="polite">
          {String(actual + 1).padStart(2, "0")} <span className="text-white/40">/ {String(SERVICIOS.length).padStart(2, "0")}</span>
        </p>
      </div>

      <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 md:inset-x-10 md:max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.div key={actual} initial="fuera" animate="dentro" exit="salida">
            <h2 className="titulo text-[8.5vw] text-white sm:text-6xl lg:text-7xl" aria-label={s.titulo}>
              {/* Letras agrupadas por palabra: así el renglón nunca corta una palabra al medio */}
              {s.titulo.split(" ").map((palabra, w, palabras) => {
                const antes = palabras.slice(0, w).join(" ").length + (w ? 1 : 0);
                return (
                  <span key={w} aria-hidden className="inline-block whitespace-nowrap">
                    {palabra.split("").map((letra, j) => (
                      <motion.span
                        key={j}
                        className="inline-block"
                        variants={{
                          fuera: { opacity: 0, y: 24, filter: "blur(8px)" },
                          dentro: { opacity: 1, y: 0, filter: "blur(0px)", transition: { delay: 0.25 + (antes + j) * 0.025, duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
                          salida: { opacity: 0, y: -16, transition: { duration: 0.3, delay: (antes + j) * 0.01 } },
                        }}
                      >
                        {letra}
                      </motion.span>
                    ))}
                    {w < palabras.length - 1 && "\u00a0"}
                  </span>
                );
              })}
            </h2>
            <motion.p
              className="mt-5 max-w-xl text-base leading-relaxed text-white/85 md:text-lg"
              variants={{ fuera: { opacity: 0, y: 16 }, dentro: { opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.6 } }, salida: { opacity: 0 } }}
            >
              {s.texto}
            </motion.p>
            <motion.a
              href={consultar(s.titulo)}
              target="_blank"
              rel="noopener"
              className="mt-7 inline-flex items-center gap-2 rounded-full border border-oro/60 px-5 py-2.5 text-sm font-semibold text-oro-claro transition hover:bg-oro hover:text-carbon"
              variants={{ fuera: { opacity: 0 }, dentro: { opacity: 1, transition: { delay: 0.8 } }, salida: { opacity: 0 } }}
            >
              Consultar por WhatsApp
            </motion.a>
          </motion.div>
        </AnimatePresence>
      </div>

      <nav aria-label="Servicios" className="absolute inset-x-3 bottom-20 grid grid-cols-3 md:inset-x-10 md:bottom-8 md:grid-cols-6">
        {SERVICIOS.map((item, i) => (
          <button
            key={item.titulo}
            onClick={() => ir(i)}
            aria-current={i === actual}
            className="group flex flex-col px-2 py-2.5 text-left transition hover:-translate-y-0.5"
          >
            <span className="mb-2.5 block h-px w-full overflow-hidden bg-white/20">
              {i === actual && (
                <span
                  key={actual}
                  className="block h-full bg-gradient-to-r from-oro to-white"
                  style={{
                    animation: quieto ? undefined : `llenar ${SLIDE_MS}ms linear forwards`,
                    animationPlayState: visible ? "running" : "paused",
                    width: quieto ? "100%" : undefined,
                  }}
                />
              )}
            </span>
            <span
              className={`truncate text-[10px] tracking-[0.18em] uppercase transition-all md:text-xs ${i === actual ? "text-white" : "text-white/50 group-hover:text-white/80"}`}
            >
              {item.corto}
            </span>
          </button>
        ))}
      </nav>
    </section>
  );
}
