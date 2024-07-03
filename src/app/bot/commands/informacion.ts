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

        bot.user?.avatarURL() ? embed.setThumbnail(bot.user.avatarURL()) : null;

        await interaction.reply({
            embeds: [embed]
        })
    }
}

const DESCRIPTION = `
Soy Dione, un bot que busca información de animes, mangas y novelas visuales para que todos puedan verla en tu servidor.\n
Puedes invitarme a tu servidor pulsando el enlace que se encuentra debajo.

▸ [Invitame a tu servidor!](${process.env.ENLACE_INVITACION})

`;