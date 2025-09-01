import fetch from "node-fetch";

// Intenciones rápidas
const intenciones = [
  { name:"centros", keywords:["centros","salud","hospital","clinica"], reply:"📍 Tenemos centros de salud en San Salvador, Santa Ana y San Miguel. ¿Quieres la dirección exacta?" },
  { name:"cita", keywords:["cita","agendar cita","reservar cita"], reply:"📅 Claro, dime el día y la hora en la que deseas agendar tu cita médica." },
  { name:"saludo", keywords:["hola","buenos días","buenas tardes","buenas noches"], reply:"👋 ¡Hola! Soy tu asistente de salud. ¿En qué puedo ayudarte hoy?" },
  { name:"horarios", keywords:["horario","abren","cierre"], reply:"⏰ Nuestros centros atienden lunes a viernes 8:00-17:00 y sábados 8:00-12:00." },
  { name:"servicios", keywords:["servicios","consultas","especialidades"], reply:"🩺 Ofrecemos consultas generales, pediatría, ginecología, cardiología y laboratorio." },
  { name:"emergencia", keywords:["emergencia","urgencia"], reply:"🚨 Para emergencias, acude al centro más cercano o llama al 911 inmediatamente." },
  { name:"documentos", keywords:["documentos","requisitos"], reply:"📄 Necesitas identificación y, si es primera vez, tu historial médico." },
  { name:"contacto", keywords:["contacto","teléfono","correo"], reply:"📞 Llama al 0000-0000 o escribe a info@saludbot.com" },
  { name:"ubicacion", keywords:["dónde","ubicación","direccion"], reply:"🗺️ Estamos en San Salvador, Santa Ana y San Miguel. ¿Quieres la dirección exacta de alguno?" },
  { name:"despedida", keywords:["adiós","gracias","hasta luego"], reply:"🙂 ¡Gracias por contactarnos! Estoy aquí para ayudarte." }
];

// Normalizar texto
function normalizar(texto){
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^\w\s]/gi,"");
}

// Detectar intención rápida
function detectarIntencion(msg){
  const txt = normalizar(msg);
  for(const i of intenciones){
    if(i.keywords.some(k=>txt.includes(normalizar(k)))) return i.reply;
  }
  return null;
}

// Handler
export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});

  const { historial } = req.body;
  if(!historial || !Array.isArray(historial) || historial.length===0) return res.status(400).json({error:"Historial vacío o inválido"});

  const ultimoMsg = historial[historial.length-1]?.contenido || "";
  const rapida = detectarIntencion(ultimoMsg);
  if(rapida) return res.status(200).json({reply:rapida});

  // Gemini fallback
  try{
    const contents = [{role:"system",parts:[{text:"Eres un asistente de salud amable y claro."}]}]
      .concat(historial.map(msg=>({role: msg.rol==="usuario"?"user":"assistant", parts:[{text:msg.contenido}]})));

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({contents})}
    );

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.map(p=>p.text).join("") || "Buen día, ¿cómo puedo ayudarte?";
    return res.status(200).json({reply});
  }catch(e){
    console.error("❌ Error Gemini:",e);
    return res.status(500).json({error:"Error en el servidor"});
  }
}



