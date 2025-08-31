import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Endpoint seguro para el frontend
app.post('/api/llm', async (req, res) => {
  try {
    const { prompt } = req.body;

    // Llamada a Gemini usando API Key desde .env
    const response = await fetch('https://api.gemini.com/llm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`
      },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    res.json({ reply: data.reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al comunicarse con Gemini' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});
