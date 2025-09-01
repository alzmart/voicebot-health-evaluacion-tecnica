export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { historial } = req.body; // <-- ahora recibimos todo el historial

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
                { text: "Eres un asistente de salud. Haz preguntas básicas de diagnóstico y recomienda centros si es necesario." }
              ]
            },
            // Mapear todo el historial (user + assistant)
            ...historial.map(msg => ({
              role: msg.role,
              parts: [{ text: msg.content }]
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

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Buen día, ¿cómo puedo ayudarte?";
    res.status(200).json({ reply });

  } catch (e) {
    console.error("❌ Error en backend:", e);
    res.status(500).json({ error: "Error al comunicarse con Gemini" });
  }
}
