"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const bot_1 = __importDefault(require("./main/bot"));
const app = (0, express_1.default)();
const bot = new bot_1.default();
app.set("port", process.env.PORT || 4000);
app.get("/", (req, res) => {
    // res.sendFile(path.join(__dirname + "/views/index.html"));
    res.send("que lees puta");
});
// app.get("/info", (req: express.Request, res: express.Response) => {
//     res.json({
//         serverCount: bot.getServers()
//     });
// })
app.listen(app.get("port"), () => {
    console.log(`Servidor iniciado en el puerto: ${app.get("port")}`);
    bot.iniciar();
});
