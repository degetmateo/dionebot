"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = {
    cooldown: 5,
    data: new discord_js_1.SlashCommandBuilder()
        .setName('informacion')
        .setDescription("Información acerca de mi."),
    execute: (interaction) => {
        var _a;
        const bot = interaction.client;
        const embed = new discord_js_1.EmbedBuilder()
            .setDescription(DESCRIPTION)
            .setColor(0xff8c00)
            .setFooter({ text: `Dione v${bot.getVersion()}` });
        ((_a = bot.user) === null || _a === void 0 ? void 0 : _a.avatarURL()) ? embed.setThumbnail(bot.user.avatarURL()) : null;
        interaction.reply({
            embeds: [embed]
        });
    }
};
const DESCRIPTION = `
Mi nombre es Dione y soy un bot de Discord cuyas funciones principales incluyen buscar y mostrar información de animes, mangas y novelas visuales en tu servidor.\n
Estoy siendo desarrollado por una sola persona, por lo que aún no poseo demasiados comandos y estos se van agregando lentamente.\n
Si lo deseas, puedes invitarme a tu servidor ingresando al enlace que se encuentra debajo.

https://dionebot.onrender.com/

Muchas gracias por leer!
Si quieres agregarme en discord para enviarme comentarios soy \`\`malardo_bro\`\`.
`;
