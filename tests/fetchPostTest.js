// Si Node <18, necesitas node-fetch
import fetch from "node-fetch"; // Solo si Node <18, si es 18+ ya no hace falta

async function postGeminiTest() {
  try {
    // El prompt que enviarías al LLM
    const prompt = "Tengo dolor de cabeza y fiebre, ¿qué debo hacer?";

    // Hacemos la petición POST
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=TU_API_KEY",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            { role: "system", parts: [{ text: "Eres un asistente de salud." }] },
            { role: "user", parts: [{ text: prompt }] }
          ]
        })
      }
    );

    // Parseamos la respuesta JSON
    const data = await response.json();
    console.log("✅ Respuesta del LLM:", data);

  } catch (err) {
    console.error("❌ Error en POST:", err);
  }
}

// Ejecutamos la función
postGeminiTest();
