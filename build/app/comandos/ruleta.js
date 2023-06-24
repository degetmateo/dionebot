"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("ruleta")
        .setDescription("Tira una ruleta para saber si continuarás vivo..."),
    execute: async (interaction) => {
        await interaction.deferReply();
        const number = Math.floor(Math.random() * 6);
        const ImagenCargando = "https://media.discordapp.net/attachments/712773186336456766/1040413408199180328/ruletaCargando.gif";
        const ImagenDisparo = "https://media.discordapp.net/attachments/712773186336456766/1040418304797462568/ruletaDisparo.gif";
        const ImagenFallo = "https://media.discordapp.net/attachments/712773186336456766/1040418327052423288/ruletaFallogif.gif";
        const EmbedImagenCargando = new discord_js_1.EmbedBuilder()
            .setImage(ImagenCargando)
            .setFooter({ text: "..." });
        const EmbedImagenDisparo = new discord_js_1.EmbedBuilder()
            .setImage(ImagenDisparo);
        const EmbedImagenFallo = new discord_js_1.EmbedBuilder()
            .setImage(ImagenFallo)
            .setFooter({ text: "Uf..." });
        await interaction.editReply({ embeds: [EmbedImagenCargando] });
        setTimeout(async () => {
            var _a, _b, _c;
            if (number === 1) {
                const channel = await ((_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.fetch());
                if (!channel) {
                    return interaction.editReply({
                        content: "Ha ocurrido un error.",
                    });
                }
                const invite = channel.type === discord_js_1.ChannelType.GuildText ? await channel.createInvite() : null;
                await interaction.editReply({ embeds: [EmbedImagenDisparo] });
                invite ? await interaction.user.send(invite.url) : null;
                (_c = (_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.members.cache.find(m => m.user.id === interaction.user.id)) === null || _c === void 0 ? void 0 : _c.kick();
            }
            else {
                interaction.editReply({ embeds: [EmbedImagenFallo] });
            }
        }, 1800);
    }
};
