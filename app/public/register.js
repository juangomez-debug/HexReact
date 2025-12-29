
const mensajeError = document.getElementsByClassName("error")[0];

document.getElementById('register-form').addEventListener('submit', async (e) =>{
    e.preventDefault();
      console.log(e);
    const res = await fetch("http://localhost:3000/api/register",{
    method : "POST",
    headers: {
      
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nombre: e.target.children.nombre.value,
      correo: e.target.children.correo.value,
      password: e.target.children.password.value
    })
  });





  if (!res.ok) return mensajeError.classList.toggle("escondido",false);

  const resJson = await res.json();
  if (resJson.redirect ) {
    window.location.href = resJson.redirect;
  }
})
