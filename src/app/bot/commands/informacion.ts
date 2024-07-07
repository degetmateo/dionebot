import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, CacheType } from "discord.js";
import Bot from "../Bot";

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('informacion')
        .setDescription("Información acerca de mi."),
    execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
        const bot = interaction.client as Bot;

        const embed = new EmbedBuilder()
            .setDescription(DESCRIPTION)
            .setColor(0xff8c00)
            .setFooter({ text: `Dione v${bot.getVersion()}` });

        // bot.user?.avatarURL() ? embed.setThumbnail(bot.user.avatarURL()) : null;

        await interaction.reply({
            embeds: [embed]
        })
    }
}

const DESCRIPTION = `
Soy Dione, un bot que muestra información de animes, mangas y novelas visuales en tu servidor.

▸ Puedes ver todos mis comandos utilizando </help:1259062709647839296>.

▸ Para vincular tu cuenta de anilist con este bot, debes usar </setup:1259062709647839301>. Si no haces esto, tus notas no se mostrarán y no podrás usar ciertos comandos.

Puedes invitarme a tu servidor con el enlace a continuación.

▸ [Invitame a tu servidor!](${process.env.ENLACE_INVITACION})

`;