import fetch from "node-fetch";

const centros = [
  { id:1, nombre:"HOSPITAL NACIONAL FRANCISCO MENENDEZ", direccion:"Calle al Zacamil, Contiguo a Residencial Suncúan, Cantón Ashapuco, Ahuachapan" },
  { id:2, nombre:"HOSPITAL NACIONAL SAN JUAN DE DIOS, SANTA ANA", direccion:"13 Avenida Sur Nº 1,Santa Ana" },
  { id:3, nombre:"HOSPITAL NACIONAL NUEVA CONCEPCION", direccion:"3a. Calle Oriente, Chalatenango" }
  // ... resto de hospitales
];

export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});

  const { historial } = req.body;
  if(!historial || !Array.isArray(historial)) return res.status(400).json({error:"Historial inválido"});

  try{
    const body = {
      contents:[
        {role:"system",parts:[{text:"Eres un asistente de salud. Recomienda centros médicos usando la lista disponible."}]},
        ...historial.map(msg=>({role: msg.rol, parts:[{text: msg.contenido}]})),
        {role:"assistant",parts:[{text:`Lista de hospitales: ${centros.map(c=>c.nombre).join(', ')}`}]} 
      ]
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body)}
    );

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.map(p=>p.text).join("") || "Aquí tienes los centros de salud disponibles.";
    historial.push({rol:"asistente",contenido:reply});

    res.status(200).json({reply, centros});
  }catch(e){
    console.error("❌ Error /api/centros:",e);
    res.status(500).json({error:"Error al comunicarse con Gemini"});
  }
}
