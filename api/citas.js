export default function handler(req, res) {
  if (req.method === 'GET') {
    // Ejemplo de respuesta con citas
    const citas = [
      { id: 1, paciente: "Ana Martinez", fecha: "2025-09-05", hora: "10:00", doctor: "Dr. López" },
      { id: 2, paciente: "Karla Morales", fecha: "2025-09-06", hora: "14:00", doctor: "Dra. Martínez" },
      { id: 3, paciente: "Luis Gómez", fecha: "2025-09-07", hora: "09:00", doctor: "Dr. Pérez" }
    ];
    res.status(200).json(citas);
  } else if (req.method === 'POST') {
    // Crear una nueva cita
    const nuevaCita = req.body;
    res.status(201).json({ message: "Cita creada con éxito", cita: nuevaCita });
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
}

