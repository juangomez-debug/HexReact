document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = e.target.children.nombre.value;
  const password = e.target.children.password.value;

  const res = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nombre,
      password,
    }),
  });

  if (!res.ok) {
    console.error("Error al iniciar sesión");
    return;
  }

  const resJson = await res.json();
  if (resJson.redirect) {
    window.location.href = resJson.redirect;
  }
});
