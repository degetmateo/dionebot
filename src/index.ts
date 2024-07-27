import Servidor from "./servidor/Servidor";
require("dotenv").config();
try {
    Servidor.Iniciar(parseInt(process.env.PUERTO || '4000'));
} catch (error) {
    console.error('Error cached on index.ts: ' + error);
}