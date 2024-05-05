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
Soy Dione, un bot que busca información de animes, mangas y novelas visuales para que todos puedan verla en tu servidor.\n
Puedes invitarme a tu servidor pulsando el enlace que se encuentra debajo.

▸ [Invitame a tu servidor!](${process.env.ENLACE_INVITACION})

`;
