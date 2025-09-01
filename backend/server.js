import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

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
    const { historial } = req.body; // ahora recibimos el historial completo
    if (!historial || !Array.isArray(historial) || historial.length === 0) {
      return res.status(400).json({ error: "Historial vacío o inválido" });
    }

    console.log("📝 Historial recibido:", historial);

    // Transformar historial a la estructura que Gemini espera
    const contents = historial.map(msg => ({
      role: msg.rol === 'usuario' ? 'user' : 'assistant',
      parts: [{ text: msg.contenido }]
    }));

    // Agregar rol system al inicio
    contents.unshift({ role: 'system', parts: [{ text: 'Eres un asistente de salud.' }] });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents })
      }
    );

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Hola! ¿Cómo puedo ayudarte hoy?';

    res.json({ reply });
  } catch (error) {
    console.error('Error en /api/llm:', error.message);
    res.status(500).json({ error: 'Error al comunicarse con Gemini' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ VoiceBOT corriendo en http://localhost:${PORT}`);
});
