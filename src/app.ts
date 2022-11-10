require("dotenv").config();

import express from "express";
import path from "path";
import BOT from "./main/bot";


const app = express();
const bot = new BOT();

app.set("port", process.env.PORT || 4000);

app.get("/", (req: express.Request, res: express.Response) => {
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