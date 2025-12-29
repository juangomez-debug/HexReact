const mensajeErrorlogin = document.getElementsByClassName("error")[0]

document.getElementById('login-form').addEventListener('submit', async (e) =>{
    e.preventDefault();

    const res = await fetch("http://localhost:3000/api/login",{
    method : "POST",
    headers: {
        "content-type": "application/json"
    },

    body: JSON.stringify({
          nombre: e.target.children.nombre.value,
          password: e.target.children.password.value

    
    })
  });
    if (!res.ok) return mensajeErrorlogin.classList.toggle("escondido",false);

    const resJson = await res.json();
    if(resJson.redirect){
        window.location.href = resJson.redirect;
    }
    })