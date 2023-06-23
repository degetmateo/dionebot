"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const bot_1 = __importDefault(require("./bot"));
const database_1 = require("./database");
const app = (0, express_1.default)();
const bot = new bot_1.default();
const db = new database_1.DB();
app.use(express_1.default.static('public'));
app.set("port", process.env.PORT || 4000);
app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(__dirname + "/public/views/index.html"));
});
app.listen(app.get("port"), async () => {
    console.log(`Servidor iniciado en el puerto: ${app.get("port")}`);
    await db.conectar(process.env.DB);
    bot.iniciar(process.env.TOKEN);
});
