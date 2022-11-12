require("dotenv").config();

import express from "express";
import BOT from "./main/Bot";

const app = express();
const bot = new BOT();

app.set("port", process.env.PORT || 4000);

app.get("/", (req: express.Request, res: express.Response) => {
    res.send("que lees puta");
});

app.listen(app.get("port"), () => {
    console.log(`Servidor iniciado en el puerto: ${app.get("port")}`);
    bot.iniciar();
});