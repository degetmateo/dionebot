import { EmbedBuilder } from "@discordjs/builders";
import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import Bot from "../Bot";

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription("Envía un mensaje con los comandos."),
    execute: (interaction: ChatInputCommandInteraction<CacheType>) => {
        const bot: Bot = interaction.client as Bot;

        const embed = new EmbedBuilder()
            .setDescription(DESCRIPTION_HELP)
            .setColor(0xff8c00)
            .setFooter({ text: `Dione v${bot.getVersion()}` });

        bot.user?.avatarURL() ? embed.setThumbnail(bot.user.avatarURL()) : null;

        interaction.reply({
            embeds: [embed]
        })
    }
}

const DESCRIPTION_HELP = `
**Información**
▸ **\`/help\`** - Todos los comandos disponibles.
▸ **\`/informacion\`** - Información acerca de mi.

**Registrarse**
▸ **\`/setup\`** - Guarda tu perfil de anilist.
▸ **\`/unsetup\`** - Elimina tu perfil de anilist.

**Estadísticas**
▸ **\`/usuario\`** - Información del perfil de anilist de un usuario.
▸ **\`/afinidad\`** - Calcula la afinidad de un usuario con el resto del servidor.

**Búsqueda**
▸ **\`/anime\`** - Muestra información del anime que busques.
▸ **\`/manga\`** - Muestra información del manga que busques.
▸ **\`/vn\`** - Muestra información de la novela visual que busques.
▸ **\`/season\`** - Devuelve los animes de la temporada que ingreses.
▸ **\`/random\`** - Devuelve un anime al azar de tus Plan to Watch.

**Administración**
▸ **\`/admin-setup\`** - Guarda el perfil de anilist de un usuario.
▸ **\`/admin-unsetup\`** - Elimina el perfil de anilist un usuario.

▸ [Invitame a tu servidor!](${process.env.ENLACE_INVITACION})
`;