import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Importar handlers de endpoints
import centrosHandler from './api/centros.js';
import citasHandler from './api/citas.js';

dotenv.config();
const app = express();
const PORT = 3000;

// Obtener __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());

// Servir frontend compilado (dist/)
app.use(express.static(path.join(__dirname, '../dist')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// ✅ Endpoint para LLM con historial
app.post('/api/llm', async (req, res) => {
  try {
    const { historial } = req.body;
    if (!historial || !Array.isArray(historial) || historial.length === 0) {
      return res.status(400).json({ error: "Historial vacío o inválido" });
    }

    console.log("📝 Historial recibido:", historial);

    // 👉 Último mensaje del usuario
    const ultimoMsg = historial[historial.length - 1]?.contenido?.toLowerCase() || "";

    // 🚀 Respuestas rápidas (sin llamar a Gemini)
    if (ultimoMsg.includes("centros de salud")) {
      return res.json({
        reply: "📍 Tenemos centros de salud en San Salvador, Santa Ana y San Miguel. ¿Quieres la dirección exacta?"
      });
    }

    if (ultimoMsg.includes("agendar cita")) {
      return res.json({
        reply: "📅 Claro, dime el día y la hora en la que deseas agendar tu cita médica."
      });
    }

    // 🔄 Si no aplica respuesta rápida → mandar a Gemini
    const contents = historial.map(msg => ({
      role: msg.rol === 'usuario' ? 'user' : 'assistant',
      parts: [{ text: msg.contenido }]
    }));

    // Instrucción inicial al modelo
    contents.unshift({ role: 'system', parts: [{ text: 'Eres un asistente de salud amable y claro.' }] });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents })
      }
    );

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.map(p => p.text).join('') || 'Hola! ¿Cómo puedo ayudarte hoy?';

    res.json({ reply });

  } catch (error) {
    console.error('❌ Error en /api/llm:', error.message);
    res.status(500).json({ error: 'Error al comunicarse con Gemini' });
  }
});

// ✅ Endpoint para centros
app.post('/api/centros', centrosHandler);

// ✅ Endpoint para citas
app.post('/api/citas', citasHandler);

app.listen(PORT, () => {
  console.log(`✅ VoiceBOT corriendo en http://localhost:${PORT}`);
});

