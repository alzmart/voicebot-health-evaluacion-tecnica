import 'dotenv/config'; // Si usas ES Modules
// o en CommonJS:
// require('dotenv').config();
export default async function handler(req, res) {
  const { prompt } = req.body

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: "system", parts: [{ text: "Eres un asistente de salud. Haz preguntas básicas de diagnóstico y recomienda centros si es necesario." }] },
            { role: "user", parts: [{ text: prompt }] }
          ]
        })
      }
    )
    const data = await response.json()
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Buen día ¿Cómo puedo ayudarte?"
    res.status(200).json({ reply })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
