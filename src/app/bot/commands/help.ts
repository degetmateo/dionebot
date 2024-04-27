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
▾ Para todos los usuarios ▾
▸ **\`/help\`** - Este comando.
▸ **\`/informacion\`** - Información acerca de mi.
▸ **\`/setup\`** - Guarda tu perfil de anilist.
▸ **\`/unsetup\`** - Elimina tu perfil de anilist.
▸ **\`/usuario\`** - Ver la información del perfil de anilist de un usuario.
▸ **\`/afinidad\`** - Muestra tu afinidad o la otro usuario con el resto del servidor.
▸ **\`/anime\`** - Muestra información del anime que busques.
▸ **\`/manga\`** - Muestra información del manga que busques.
▸ **\`/vn\`** - Muestra información de la novela visual que busques.
▸ **\`/season\`** - Devuelve los animes de la temporada que ingreses.
▸ **\`/random\`** - Devuelve un anime al azar de tus Plan to Watch.

▾ Para administradores ▾
▸ **\`/admin-setup\`** - Guarda el perfil de anilist de un usuario.
▸ **\`/admin-unsetup\`** - Elimina el perfil de anilist un usuario.
`;