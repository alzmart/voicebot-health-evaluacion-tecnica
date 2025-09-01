export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { historial } = req.body; // recibimos todo el historial

  // Log solo en desarrollo
  if (process.env.NODE_ENV !== "production") {
    console.log("📝 Historial recibido:", historial);
  }

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
                  text: "Eres un asistente de salud. Haz preguntas básicas de diagnóstico y recomienda centros si es necesario."
                }
              ]
            },
            // Mapear todo el historial (usuario + asistente)
            ...historial.map(msg => ({
              role: msg.rol,           // 'usuario' o 'asistente'
              parts: [{ text: msg.contenido }] // <-- coincide con el nuevo VoiceBot
            }))
          ]
        })
      }
    );

    const data = await response.json();

    // Log solo en desarrollo
    if (process.env.NODE_ENV !== "production") {
      console.log("💬 Respuesta de Gemini:", data);
    }

    // Extraer la respuesta del primer output de Gemini
    const reply = data.candidates?.[0]?.content?.map(p => p.text).join('') || "Lo siento, no entendí tu mensaje.";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Error llamando a Gemini:", err);
    return res.status(500).json({ error: "Error en el servidor" });
  }
}

