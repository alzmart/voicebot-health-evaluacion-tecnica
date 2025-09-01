const centros = [
  { id: 1, nombre: "HOSPITAL NACIONAL FRANCISCO MENENDEZ", direccion: "Calle al Zacamil, Contiguo a Residencial Suncúan, Cantón Ashapuco, Ahuachapan" },
  { id: 2, nombre: "HOSPITAL NACIONAL SAN JUAN DE DIOS, SANTA ANA", direccion: "13 Avenida Sur Nº 1,Santa Ana" },
  { id: 3, nombre: "HOSPITAL NACIONAL NUEVA CONCEPCION", direccion: "3a. Calle Oriente, Chalatenango" },
  { id: 4, nombre: "HOSPITAL SAN RAFAEL", direccion: "Final 4a. Calle Oriente No.9-2, Santa Tecla, La Libertad" },
  { id: 5, nombre: "HOSPITAL NACIONAL DE NIÑOS BENJAMIN BLOOM", direccion: "25 Avenida Norte y 29 Calle Poniente, Boulevar de Los Héroes, San Salvador" },
  { id: 6, nombre: "HOSPITAL NACIONAL ROSALES", direccion: "Final Calle Arce Y 25 Avenida Norte, San Salvador" },
  { id: 7, nombre: "HOSPITAL NACIONAL PSIQUIATRICO DR. JOSE MOLINA MARTINEZ", direccion: "Cantón Venecia, C. La Fuente, Soyapango, San Salvador" },
  { id: 8, nombre: "HOSPITAL SANTA GERTRUDIS", direccion: "2a. Avenida Sur #23, San Vicente" },
  { id: 9, nombre: "HOSPITAL NACIONAL DE NUEVA GUADALUPE", direccion: "Final Avenida Principal, Barrio San Luis, San Miguel" },
  { id: 10, nombre: "HOSPITAL NACIONAL DE LA UNIÓN", direccion: "9a. Avenida Norte #8, La Union" },
  { id: 11, nombre: "HOSPITAL NACIONAL SANTA TERESA DE ZACATECOLUCA", direccion: "Final Avenida Juan Manuel Rodriguez" },
  { id: 12, nombre: "HOSPITAL NACIONAL DE LA MUJER DRA. MARIA ISABEL RODRIGUEZ", direccion: "Entre 25 Avenida Sur y Calle Francisco Menendez, Antigua Quinta Maria Luisa, Barrio Santa Anita, San Salvador" },
  { id: 13, nombre: "INSTITUTO SALVADOREÑO DE REHABILITACION INTEGRAL", direccion: "Colonia Costa Rica, Avenida Irazú, Contiguo a Centro Sara Zaldívar, San Salvador" },
  { id: 14, nombre: "HOSPITAL NACIONAL SAN PEDRO USULUTÁN", direccion: "Final Calle Doctor Federico Penado, Salida a San Salvador, Usulután" },
  { id: 15, nombre: "HOSPITAL NACIONAL NUESTRA SEÑORA DE FÁTIMA", direccion: "Antigua Carretera Panamericana Km 33, Barrio el Calvario, Cojutepeque. Cuscatlán" }
];

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { historial } = req.body; // recibimos historial desde frontend

  try {
    // Generar prompt para Gemini usando historial + listado de hospitales
    const body = {
      contents: [
        { 
          role: "system", 
          parts: [{ text: "Eres un asistente de salud. Recomienda centros médicos según el historial del usuario usando la lista disponible." }] 
        },
        ...historial.map(msg => ({ role: msg.rol, parts: [{ text: msg.contenido }] })),
        { 
          role: "assistant", 
          parts: [{ text: `Lista de hospitales disponibles: ${centros.map(c => c.nombre).join(', ')}` }] 
        }
      ]
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
    );

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.map(p => p.text).join('') || "Aquí tienes los centros de salud disponibles.";

    // Agregar reply al historial
    historial.push({ rol: "asistente", contenido: reply });

    res.status(200).json({ reply, centros });

  } catch (e) {
    console.error("❌ Error en /api/centros:", e);
    res.status(500).json({ error: "Error al comunicarse con Gemini" });
  }
}

