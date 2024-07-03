"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Servidor_1 = __importDefault(require("./servidor/Servidor"));
require("dotenv").config();
try {
    Servidor_1.default.Iniciar(parseInt(process.env.PUERTO || '4000'));
}
catch (error) {
    console.error('Error cached on index.ts: ' + error);
}
