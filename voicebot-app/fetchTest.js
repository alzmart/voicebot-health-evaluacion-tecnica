// Importar fetch desde node-fetch
import fetch from "node-fetch";

// Función principal para probar fetch
async function fetchTest() {
  try {
    // GET
    const res = await fetch("https://jsonplaceholder.typicode.com/posts/1");
    const data = await res.json();
    console.log("✅ Datos GET recibidos:", data);

    // POST
    const postRes = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "foo", body: "bar", userId: 1 })
    });
    const postData = await postRes.json();
    console.log("✅ Datos POST recibidos:", postData);

  } catch (err) {
    console.error("❌ Error en fetch:", err);
  }
}

// Ejecutar la función
fetchTest();
