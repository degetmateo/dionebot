require("dotenv").config();

import { DB } from "./objects/Database";

const db = new DB();

import express from "express";
const app = express();

app.set("port", process.env.PORT || 3000);

app.get("/", (req: any, res: any) => {
    res.send("que lees puta");
});

app.listen(app.get("port"), () => {
    console.log(`Servidor iniciado en el puerto: ${app.get("port")}`);
});

import { Client, GatewayIntentBits } from "discord.js";
import { BOT } from "./objects/Bot";

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const bot = new BOT(client, db);

bot.iniciar();