document
  .getElementById("register-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: e.target.children.nombre.value,
        correo: e.target.children.correo.value,
        password: e.target.children.password.value,
      }),
    });

    if (!res.ok) {
      // Si quieres manejar el error de otra forma (ej: alert), puedes hacerlo aquí
      console.error("Error en el registro");
      return;
    }

    const resJson = await res.json();
    if (resJson.redirect) {
      window.location.href = resJson.redirect;
    }
  });
