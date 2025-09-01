// llm.js
import fetch from "node-fetch";

const respuestasRapidas = [
  {
    keywords: ["centros", "salud"],
    reply: "📍 Tenemos centros de salud en San Salvador, Santa Ana y San Miguel. ¿Quieres la dirección exacta?"
  },
  {
    keywords: ["cita", "agendar cita", "reservar cita"],
    reply: "📅 Claro, dime el día y la hora en la que deseas agendar tu cita médica."
  },
  {
    keywords: ["hola", "buenos días", "buenas tardes", "buenas noches"],
    reply: "👋 ¡Hola! Soy tu asistente de salud. ¿En qué puedo ayudarte hoy?"
  }
];

// Función para normalizar texto: quitar acentos y pasar a minúsculas
function normalizar(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quitar acentos
    .toLowerCase()
    .replace(/[^\w\s]/gi, "");       // quitar signos de puntuación
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { historial } = req.body;

  if (!historial || !Array.isArray(historial) || historial.length === 0) {
    return res.status(400).json({ error: "Historial vacío o inválido" });
  }

  const ultimoMsg = normalizar(historial[historial.length - 1]?.contenido || "");

  // 🔹 Revisar respuestas rápidas
  for (const resp of respuestasRapidas) {
    if (resp.keywords.some(k => ultimoMsg.includes(normalizar(k)))) {
      return res.status(200).json({ reply: resp.reply });
    }
  }

  // 🔹 Si no aplica respuesta rápida → llamar a Gemini
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "system",
              parts: [
                {
                  text: "Eres un asistente de salud amable y claro. Haz preguntas básicas de diagnóstico y recomienda centros si es necesario."
                }
              ]
            },
            ...historial.map(msg => ({
              role: msg.rol === 'usuario' ? 'user' : 'assistant',
              parts: [{ text: msg.contenido }]
            }))
          ]
        })
      }
    );

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.map(p => p.text).join('') || "Lo siento, no entendí tu mensaje.";

    return res.status(200).json({ reply });

  } catch (err) {
    console.error("Error llamando a Gemini:", err);
    return res.status(500).json({ error: "Error en el servidor" });
  }
}


