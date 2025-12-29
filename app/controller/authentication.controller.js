import bcrypt from 'bcryptjs';


//base de datos local de ejemplo;; aqui se conectaria a una base de datos real
const usuarios = [{
    nombre: "juan pablo",
    correo: "juangomez311034@gmail.com",
    password: "12"},{  nombre: 'jp',
  correo: 'juangomez311034@algo.com',
  password: '$2b$10$Xg4aSHJb7hW9AhS2YOQOcebpMqLnhknP70N1CvmNhGMknUGmkujve'}];




//funcion login 
async function login(req, res) {
    console.log(req.body);
    const nombre = req.body.nombre;
    const password = req.body.password;
      if (!nombre || !password) {
        return res.status(400).json({ status: 'error', message: 'los datos estan incompletos: por favor ingresar nuevamente' });
    }
    
    const usuarioARevisar = usuarios.find(u => u.nombre === nombre);

    if (!usuarioARevisar) {
        return res.status(400).json({ status: 'error',    message: 'usuario no encontrado'});
        }
    const loginValido = await bcrypt.compare(password, usuarioARevisar.password);
    console.log(loginValido);

};

//funcion de registro de usuario 
async function register(req, res) 
{
    console.log(req.body);
const nombre = req.body.nombre;
const correo = req.body.correo;
const password = req.body.password; 
    if (!nombre || !correo || !password) {
        return res.status(401).json({ status: 'error', message: 'los datos estan incompletos: por favor ingresar nuevamente' });
    }
    



     //verificacion de correo existente
    const correoExistente = usuarios.find(email => email.correo === correo);
    if (correoExistente) {
        return res.status(400).json({ status: 'error', message: 'el correo ya esta registrado' });
    }
    //hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
//  se crea el nuevo usuario      
const nuevoUsuario = {nombre, correo, password: hashPassword};
console.log(nuevoUsuario);
usuarios.push(nuevoUsuario);
    return res.status(201).json({ status: 'success', message: 'usuario registrado exitosamente', redirect: '/'});
}
export const methods = {
  login,
  register,
};