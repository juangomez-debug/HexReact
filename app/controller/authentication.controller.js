import bcrypt from "bcryptjs";
import JsonWebToken from "jsonwebtoken";
import dotenv from "dotenv";
import db from "../db.js"; // Importamos la conexión
dotenv.config();

// funcion admin
async function admin(req, res) {
  res
    .status(200)
    .json({ status: "ok", message: "bienvenido al area de administracion" });
}

//funcion login
async function login(req, res) {
  const nombre = req.body.nombre;
  const password = req.body.password;

  if (!nombre || !password) {
    return res
      .status(400)
      .json({ status: "error", message: "los datos estan incompletos" });
  }

  try {
    // Buscamos al usuario por su nombre en la base de datos
    const [rows] = await db.execute("SELECT * FROM usuarios WHERE nombre = ?", [
      nombre,
    ]);
    const usuarioARevisar = rows[0];

    if (!usuarioARevisar) {
      return res
        .status(400)
        .json({ status: "error", message: "usuario no encontrado" });
    }

    const passwordValido = await bcrypt.compare(
      password,
      usuarioARevisar.contraseña,
    );
    if (!passwordValido) {
      return res
        .status(400)
        .json({ status: "error", message: "Contraseña incorrecta" });
    }

    const token = JsonWebToken.sign(
      { nombre: usuarioARevisar.nombre },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("jwt", token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
    res
      .status(200)
      .json({ status: "ok", message: "usuario loggeado", redirect: "/admin" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Error en el servidor" });
  }
}

//funcion de registro de usuario
async function register(req, res) {
  const { nombre, correo, password } = req.body;

  if (!nombre || !correo || !password) {
    return res
      .status(401)
      .json({ status: "error", message: "datos incompletos" });
  }

  try {
    // Verificación de correo existente en MySQL
    const [existente] = await db.execute(
      "SELECT * FROM usuarios WHERE correo = ?",
      [correo],
    );
    if (existente.length > 0) {
      return res
        .status(400)
        .json({ status: "error", message: "el correo ya esta registrado" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Insertar nuevo usuario
    console.log("Intentando insertar usuario:", { nombre, correo });
    await db.execute(
      "INSERT INTO usuarios (nombre, correo, contraseña) VALUES (?, ?, ?)",
      [nombre, correo, hashPassword],
    );

    // VERIFICACIÓN INMEDIATA
    const [verificacion] = await db.execute(
      "SELECT * FROM usuarios WHERE correo = ?",
      [correo],
    );
    console.log(
      "¿Usuario encontrado en la DB después de insertar?:",
      verificacion.length > 0 ? "SÍ" : "NO",
    );
    console.log("Datos en DB:", verificacion[0]);

    return res.status(201).json({
      status: "success",
      message: "usuario registrado exitosamente",
      redirect: "/",
    });
  } catch (error) {
    console.error("ERROR DETALLADO EN REGISTRO:", error.message);
    res
      .status(500)
      .json({ status: "error", message: "Error de autenticación" });
  }
}

export const methods = {
  login,
  register,
  admin,
};
