import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, CacheType } from "discord.js";
import Bot from "../Bot";

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('informacion')
        .setDescription("Información acerca de mi."),
    execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
        await interaction.deferReply();
        const bot = interaction.client as Bot;

        const embed = new EmbedBuilder()
            .setDescription(DESCRIPTION)
            .setColor(0xff8c00)
            .setFooter({ text: `Dione v${bot.getVersion()}` });

        bot.user?.avatarURL() ? embed.setThumbnail(bot.user.avatarURL()) : null;

        await interaction.editReply({
            embeds: [embed]
        })
    }
}

const DESCRIPTION = `
Mi nombre es Dione y soy un bot de Discord cuyas funciones principales incluyen buscar y mostrar información de animes, mangas y novelas visuales en tu servidor.\n
Estoy siendo desarrollado por una sola persona, por lo que aún no poseo demasiados comandos y estos se van agregando lentamente.\n
Si lo deseas, puedes invitarme a tu servidor ingresando al enlace que se encuentra debajo.

https://dionebot.onrender.com/

Muchas gracias por leer!
Si quieres agregarme en discord para enviarme comentarios soy \`\`malardo_bro\`\`.
`;