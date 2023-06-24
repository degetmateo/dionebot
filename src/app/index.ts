require("dotenv").config();

import path from "path";

import express from "express";
import BOT from "./bot";
import { DB } from "./database";

const app = express();
const bot = new BOT();
const db = new DB();

app.use(express.json());
app.use(express.static(path.join(__dirname + '/../public')));
app.set("port", process.env.PORT || 4000);

app.get("/", (req: express.Request, res: express.Response) => {
    res.sendFile(path.join(__dirname + "/../public/views/index.html"));
});

app.listen(app.get("port"), async () => {
    console.log(`Servidor iniciado en el puerto: ${app.get("port")}`);
    await db.conectar(process.env.DB);
    bot.iniciar(process.env.TOKEN);
});