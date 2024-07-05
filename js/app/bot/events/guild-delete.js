"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const postgres_1 = __importDefault(require("../../database/postgres"));
module.exports = (bot) => {
    bot.on(discord_js_1.Events.GuildDelete, async (server) => {
        try {
            await postgres_1.default.query().begin(async (sql) => {
                await sql `
                    DELETE FROM
                        membership
                    WHERE
                        id_server = ${server.id};
                `;
                await sql `
                    DELETE FROM
                        discord_server
                    WHERE
                        id_server = ${server.id};
                `;
            });
        }
        catch (error) {
            console.error(error);
        }
    });
};
