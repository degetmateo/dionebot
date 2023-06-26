"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("informacion")
        .setDescription("Obtén información acerca de mi!"),
    execute: async (interaction) => {
        var _a;
        const bot = interaction.client;
        const descripcion = `Mi nombre es Dione y soy un bot de Discord que está siendo desarrollado en TypeScript.

        Mis funciones principales incluyen buscar y mostrar información acerca de animes y mangas en tu servidor utilizando la API de Anilist.
        
        Aunque aún no poseo demasiadas opciones, en el futuro se irán implementando muchas más.
        
        Si lo deseas, puedes invitarme a tu servidor presionando el enlace que se encuentra debajo.
        
        Invítame!: https://dionebot.onrender.com/`;
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle("▾ Información")
            .setDescription(descripcion.trim())
            .setColor(0xff8c00)
            .setFooter({ text: `Dione v1.0.0` });
        const avatarURL = (_a = bot.user) === null || _a === void 0 ? void 0 : _a.avatarURL();
        if (avatarURL) {
            embed.setThumbnail(avatarURL);
        }
        interaction.reply({
            embeds: [embed]
        });
    }
};
