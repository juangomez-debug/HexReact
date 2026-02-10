import bcrypt from 'bcryptjs';
import JsonWebToken from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


//base de datos local de ejemplo;; aqui se conectaria a una base de datos real
const usuarios = [{
    nombre: "juan p",
    correo: "juangomez0110@gmail.com",
    password: "12"},
    {  nombre: 'jp',
  correo: 'juangomez311034@algo.com',
  password: '$2b$10$Xg4aSHJb7hW9AhS2YOQOcebpMqLnhknP70N1CvmNhGMknUGmkujve'}];
// funcion admin 
async function admin (req, res) {
    res.status(200).json({ status: 'ok', message: 'bienvenido al area de administracion'});
}



//funcion login 
async function login(req, res) {

    const nombre = req.body.nombre;
    const password = req.body.password;
      if (!nombre || !password) {
        return res.status(400).json({ status: 'error', message: 'los datos estan incompletos: por favor ingresar nuevamente' });
    }
    
    const usuarioARevisar = usuarios.find(u => u.nombre === nombre);

    if (!usuarioARevisar) {
        return res.status(400).json({ status: 'error',    message: 'usuario no encontrado'});
        }
// con las siguientes constantes se busca en la constante donde se encuentra la BD 
// y se comparan los datos ingresados con los almacenados
   
        const passwordValido = await bcrypt.compare(password, usuarioARevisar.password);
         
        if (!passwordValido) {
    return res.status(400).json({
      status: 'error',
      message: 'Contraseña incorrecta'
    });
  }


  // se crea el token con toda la info del usuario 

const token =JsonWebToken.sign({nombre: usuarioARevisar.nombre}, procces.env.JWT_SECRET, {expiresIn: '7d'});

// a continuacion se crea una cookie 

const cookieOption={

    expires: process.env.JWT_COOKIE_EXPIRES * 24 * 60 *60 *1000,
    path: "/"
}

res.cookie(jwt,token,{ cookieOption: true , maxAge: 24*60*60*1000, httpOnly: true });
res.send(statusbar="ok s", message= "usuario loggeado ", redirect = "admin")

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
  admin, 
};