"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const db_1 = require("./db");
const db = new db_1.DB();
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.set("port", process.env.PORT || 3000);
app.get("/", (req, res) => {
    res.send("que lees puta");
});
app.listen(app.get("port"), () => {
    console.log(`Servidor iniciado en el puerto: ${app.get("port")}`);
});
const discord_js_1 = require("discord.js");
const Bot_1 = require("./objects/Bot");
const client = new discord_js_1.Client({ intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildMessages, discord_js_1.GatewayIntentBits.MessageContent] });
const bot = new Bot_1.BOT(client, db);
bot.iniciar();
