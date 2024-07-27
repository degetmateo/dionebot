import { EmbedBuilder } from "@discordjs/builders";
import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import Bot from "../Bot";

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Show all my commands!')
        .setDescriptionLocalization('es-ES', "Mostrar todos mis comandos!")
        .setDMPermission(false)
        .setNSFW(false),
    execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
        const bot: Bot = interaction.client as Bot;

        const embed = new EmbedBuilder()
            .setDescription(DESCRIPTION_HELP)
            .setColor(0xff8c00)
            .setFooter({ text: `Dione v${bot.getVersion()}` });

        bot.user?.avatarURL() ? embed.setThumbnail(bot.user.avatarURL()) : null;

        await interaction.reply({
            embeds: [embed]
        })
    }
}

const DESCRIPTION_HELP = `
**Información**
▸ **\`/help\`** - Todos los comandos disponibles.

**Registrarse**
▸ **\`/setup\`** - Vincula tu perfil de anilist.
▸ **\`/unsetup\`** - Desvincula tu perfil de anilist.

**Estadísticas**
▸ **\`/usuario\`** - Información del perfil de anilist de un usuario.
▸ **\`/affinity\`** - Calcula la afinidad de un usuario con el resto del servidor.

**Búsqueda**
▸ **\`/anime\`** - Muestra información del anime que busques.
▸ **\`/manga\`** - Muestra información del manga que busques.
▸ **\`/character\`** - Muestra información del personaje que busques.
▸ **\`/vn\`** - Muestra información de la novela visual que busques.
▸ **\`/season\`** - Devuelve los animes de la temporada que ingreses.
▸ **\`/random\`** - Devuelve un anime al azar de tus Plan to Watch.

**Reacciones**
▸ **\`/cry\`** - Expresas llanto.

**Administración**
▸ **\`/admin-unsetup\`** - Desvincula forzosamente el anilist de un usuario.

**Otros**
▸ **\`/suggestion\`** - ¡Envíanos una sugerencia para ayudar con el desarrollo!

▸ [Invitame a tu servidor!](${process.env.ENLACE_INVITACION})
`;