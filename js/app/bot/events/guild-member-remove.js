"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const postgres_1 = __importDefault(require("../../database/postgres"));
module.exports = (bot) => {
    bot.on(discord_js_1.Events.GuildMemberRemove, async (member) => {
        try {
            await postgres_1.default.query().begin(async (sql) => {
                await sql `
                    DELETE FROM
                        discord_user
                    WHERE
                        id_user = ${member.id} and
                        id_server = ${member.guild.id};
                `;
            });
        }
        catch (error) {
            console.error(error);
        }
    });
};
