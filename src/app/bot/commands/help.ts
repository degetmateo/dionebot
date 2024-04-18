import { EmbedBuilder } from "@discordjs/builders";
import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import Bot from "../Bot";

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription("Envía un mensaje con los comandos."),
    execute: async (interaction: ChatInputCommandInteraction<CacheType>): Promise<void> => {
        const bot: Bot = interaction.client as Bot;

        const embed = new EmbedBuilder()
            .setTitle("Comandos")
            .setDescription(DESCRIPTION_HELP)
            .setColor(0xff8c00);

        bot.user?.avatarURL() ? embed.setThumbnail(bot.user.avatarURL()) : null;

        interaction.reply({
            embeds: [embed]
        })
    }
}

const DESCRIPTION_HELP = `
▸ **\`/informacion\`** - Informacion acerca de mi.
▸ **\`/setup\`** - Guardar tu usuario de ANILIST.
▸ **\`/unsetup\`** - Elimina tu usuario de ANILIST.
▸ **\`/usuario\`** - Ver la información del perfil de ANILIST de un usuario.
▸ **\`/afinidad\`** - Muestra tu afinidad o la otro usuario con el resto del servidor.
▸ **\`/anime\`** - Muestra la información del anime que busques.
▸ **\`/manga\`** - Muestra la información del manga que busques.
▸ **\`/vn\`** - Muestra información de la novela visual que busques.
▸ **\`/season\`** - Devuelve todos los animes que salieron en la temporada que elijas.
▸ **\`/random\`** - Devuelve un anime al azar de tus PTW.
`;