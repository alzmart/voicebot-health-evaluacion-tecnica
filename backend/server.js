// server.js
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Para __dirname en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// ✅ Ruta raíz para confirmar que el backend corre
app.get("/", (req, res) => {
  res.send("✅ VoiceBOT Backend activo y corriendo");
});

// ✅ Ejemplo de citas
app.get("/api/citas", (req, res) => {
  const citas = [
    { id: 1, paciente: "Ana Martínez", fecha: "2025-09-05", hora: "10:00", doctor: "Dr. López" },
    { id: 2, paciente: "Carlos Pérez", fecha: "2025-09-06", hora: "11:30", doctor: "Dra. Gómez" }
  ];
  res.json(citas);
});

// ✅ Endpoint LLM (Gemini)
app.post("/api/llm", async (req, res) => {
  const { historial } = req.body;

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
            ...historial.map((msg) => ({
              role: msg.rol === "usuario" ? "user" : "assistant", // 🔥 Traducción rol
              parts: [{ text: msg.contenido }]
            }))
          ]
        })
      }
    );

    const data = await response.json();

    if (process.env.NODE_ENV !== "production") {
      console.log("💬 Respuesta de Gemini:", JSON.stringify(data, null, 2));
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Lo siento, no entendí tu mensaje.";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("❌ Error llamando a Gemini:", err);
    return res.status(500).json({ error: "Error en el servidor" });
  }
});

// ✅ Servir frontend en producción
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(` Servidor corriendo en http://localhost:${PORT}`);
});

