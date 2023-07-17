import Servidor from "./servidor/Servidor";
require("dotenv").config();
Servidor.Iniciar(parseInt(process.env.PUERTO || '4000'));