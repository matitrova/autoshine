// Todo lo que se puede querer cambiar sin tocar componentes.
// Los textos salen de la página anterior y del Instagram @autoshine.detailing: nada inventado.

// Sin confirmar: se dedujo de "2665-111306" del flyer. Si los mensajes no llegan, es acá.
export const WHATSAPP = "5492665111306";
export const TELEFONO = "2665-111306";
export const DIRECCION = "Av. Pepe Mercau 890, Merlo, San Luis";
export const MAPA = "https://www.google.com/maps/search/?api=1&query=Av.%20Pepe%20Mercau%20890%2C%20Merlo%2C%20San%20Luis";
export const INSTAGRAM = "https://www.instagram.com/autoshine.detailing";

// El flyer dice 8:30 y un posteo 9:30: queda el del flyer hasta que Facundo confirme.
export const HORARIOS: [string, string][] = [
  ["Lunes a viernes", "8:30 a 18:00"],
  ["Sábados", "9:00 a 18:30"],
];

export const wa = (texto: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
export const consultar = (servicio: string) => wa(`Hola AutoShine! Vi la página y quería consultar por: ${servicio}.`);

export const foto = (nombre: string) => `./fotos/${nombre}.webp`;

export const PILARES = [
  { titulo: "Limpiamos", texto: "Interior, exterior, chasis y motor" },
  { titulo: "Pulimos", texto: "Pintura, ópticas y acrílicos" },
  { titulo: "Protegemos", texto: "Tratamiento cerámico y sellado" },
];

// Los seis que se muestran con foto gigante. "foto" = nombre base en public/fotos (-h / -v).
export const SERVICIOS = [
  {
    titulo: "Lavado completo",
    corto: "Lavado",
    texto: "Interior y exterior, más chasis y motor. El lavado de siempre, hecho como corresponde: sin marcar la pintura y secando a fondo.",
    foto: "lavado",
  },
  {
    titulo: "Pulido y abrillantado",
    corto: "Pulido",
    texto: "Corrección de pintura con pulidora orbital. Sacamos el micro-rayado y los remolinos que dejan los lavados mal hechos, y devolvemos el reflejo.",
    foto: "pulido",
  },
  {
    titulo: "Tratamiento cerámico",
    corto: "Cerámico",
    texto: "Máxima repelencia y protección de la pintura. El agua resbala, la suciedad no se agarra y cada lavado posterior es mucho más rápido.",
    foto: "ceramico",
  },
  {
    titulo: "Restauración de ópticas",
    corto: "Ópticas",
    texto: "Si están opacas o amarillas, no hace falta comprarlas nuevas. Las pulimos y sellamos para que vuelvan a dar luz.",
    foto: "opticas",
  },
  {
    titulo: "Camionetas y pick-ups",
    corto: "Camionetas",
    texto: "Mismo trabajo, más superficie: carrocería, chasis y lavado con protección de la caja de carga, que es la parte que más sufre.",
    foto: "camionetas",
  },
  {
    titulo: "Motos y cuatris",
    corto: "Motos",
    texto: "Lavado y detallado con el cuidado que pide tener todo a la vista: motor, llantas, plásticos y cromados.",
    foto: "motos",
  },
];

export const OTROS_SERVICIOS = [
  {
    titulo: "Limpieza de tapizados",
    texto: "Extracción profunda de telas, techo y alfombras. Recuperamos la textura, el color y la suavidad original del material.",
  },
  {
    titulo: "Sellado acrílico",
    texto: "Una capa de brillo y protección sobre la pintura ya pulida. Es el paso que hace que el trabajo dure.",
  },
  {
    titulo: "Pulido de tablero",
    texto: "Los acrílicos del tablero se rayan y se opacan con el trapo seco. Los pulimos y sellamos hasta que se vuelven a leer sin reflejos.",
  },
];

export const TRABAJOS = Array.from({ length: 20 }, (_, i) => foto(`trabajo-${String(i + 1).padStart(2, "0")}`));

export const PRODUCTOS = ["Menzerna", "Meguiar's", "Vonixx", "Toxic Shine", "Laffitte Detail", "Overcars"];

// Pares reales del mismo auto: { antes, despues, titulo }. Vacío = la sección no se muestra.
export const ANTES_DESPUES: { antes: string; despues: string; titulo: string }[] = [];

// Solo preguntas cuya respuesta ya sabemos. Pendiente con Facundo: cuánto tarda cada trabajo
// y si hay que dejar el auto.
export const PREGUNTAS = [
  {
    p: "¿Cuánto sale?",
    r: "Depende del tamaño del vehículo y de cómo llega. Escribinos por WhatsApp con la marca y el modelo y te pasamos el valor en el momento, sin vueltas.",
  },
  {
    p: "¿Qué diferencia hay entre el sellado acrílico y el cerámico?",
    r: "El acrílico es una capa de brillo y protección sobre la pintura ya pulida. El cerámico va un paso más allá: máxima repelencia, el agua resbala y la suciedad no se agarra, así que cada lavado posterior es mucho más rápido.",
  },
  {
    p: "¿Trabajan con camionetas y motos?",
    r: "Sí: autos, camionetas, pick-ups y motos. En las pick-ups también lavamos y protegemos la caja de carga.",
  },
  {
    p: "¿Qué productos usan?",
    r: "Profesionales, no de góndola: Menzerna, Meguiar's, Vonixx, Toxic Shine, Laffitte Detail y Overcars.",
  },
  {
    p: "¿Cómo saco turno?",
    r: "Desde el formulario de abajo: elegís el servicio y el día, y se abre tu WhatsApp con el mensaje armado. También podés escribirnos directo.",
  },
];

export const OPCIONES_SERVICIO = [
  "Lavado completo",
  "Full detail",
  "Limpieza de tapizados",
  "Restauración de ópticas",
  "Pulido y abrillantado",
  "Tratamiento cerámico",
  "Sellado acrílico",
  "Pulido de tablero y acrílicos",
  "Lavado de camioneta o pick-up",
  "Lavado y detallado de moto",
  "Todavía no sé, quiero que me asesoren",
];
