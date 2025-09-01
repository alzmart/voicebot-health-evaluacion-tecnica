import fetch from "node-fetch";

let citas = [
  {id:1,paciente:"Ana Martinez",fecha:"2025-09-05",hora:"10:00",doctor:"Dr. López"},
  {id:2,paciente:"Karla Morales",fecha:"2025-09-06",hora:"14:00",doctor:"Dra. Martínez"},
  {id:3,paciente:"Luis Gómez",fecha:"2025-09-07",hora:"09:00",doctor:"Dr. Pérez"}
];

export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"Método no permitido"});

  const { historial } = req.body;
  if(!historial || !Array.isArray(historial)) return res.status(400).json({error:"Historial inválido"});

  try{
    const body = {
      contents:[
        {role:"system",parts:[{text:"Eres un asistente de salud. Ayuda a programar citas médicas usando la lista de citas disponibles."}]},
        ...historial.map(msg=>({role: msg.rol, parts:[{text: msg.contenido}]})),
        {role:"assistant",parts:[{text:`Citas disponibles: ${citas.map(c=>`${c.paciente} con ${c.doctor} el ${c.fecha} a las ${c.hora}`).join('; ')}`}]} 
      ]
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body)}
    );

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.map(p=>p.text).join("") || "Puedo ayudarte a agendar una cita.";
    historial.push({rol:"asistente",contenido:reply});

    res.status(200).json({reply, citas});
  }catch(e){
    console.error("❌ Error /api/citas:",e);
    res.status(500).json({error:"Error al comunicarse con Gemini"});
  }
}

