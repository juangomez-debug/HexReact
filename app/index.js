/* se importan las librerias necesarias para
ejecutar el proyecto*/
import express from "express";
// arreglo del dirname por usar modulos
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname( fileURLToPath(import.meta.url));
import { methods as authentication } from "./controller/authentication.controller.js";

//ahora se crea el servidor y la configuracion de estaticos


//configuracion del puerto
const app = express();//este siempre va primero 
app.set("port", 3000);
app.listen(app.get("port"));
console.log("Servidor corriendo en puerto", app.get("port"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));

//rutas principales
app.get("/", (req , res) => res.sendFile(__dirname + "/pages/login.html"));
app.get("/login", (req , res) => res.sendFile(__dirname + "/pages/login.html"));
app.get("/register", (req , res) => res.sendFile(__dirname + "/pages/register.html"));
app.get("/admin", (req , res) => res.sendFile(__dirname + "/pages/Admin/admin.html"));

app.post("/api/register", authentication.register);
app.post("/api/login", authentication.login);