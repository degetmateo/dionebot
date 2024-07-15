"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = {
    cooldown: 5,
    data: new discord_js_1.SlashCommandBuilder()
        .setName('informacion')
        .setDescription("Información acerca de mi.")
        .setDMPermission(false)
        .setNSFW(false),
    execute: async (interaction) => {
        const bot = interaction.client;
        const embed = new discord_js_1.EmbedBuilder()
            .setDescription(DESCRIPTION)
            .setColor(0xff8c00)
            .setFooter({ text: `Dione v${bot.getVersion()}` });
        await interaction.reply({
            embeds: [embed]
        });
    }
};
const DESCRIPTION = `
Soy Dione, un bot que muestra información de animes, mangas y novelas visuales en tu servidor.

▸ Puedes ver todos mis comandos utilizando </help:1259062709647839296>.

▸ Para vincular tu cuenta de anilist con este bot, debes usar </setup:1259062709647839301>. Si no haces esto, tus notas no se mostrarán y no podrás usar ciertos comandos.

Puedes invitarme a tu servidor con el enlace a continuación.

▸ [Invitame a tu servidor!](${process.env.ENLACE_INVITACION})

`;
