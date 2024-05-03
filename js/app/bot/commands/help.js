"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
module.exports = {
    cooldown: 5,
    data: new discord_js_1.SlashCommandBuilder()
        .setName('help')
        .setDescription("Envía un mensaje con los comandos."),
    execute: (interaction) => {
        var _a;
        const bot = interaction.client;
        const embed = new builders_1.EmbedBuilder()
            .setDescription(DESCRIPTION_HELP)
            .setColor(0xff8c00);
        ((_a = bot.user) === null || _a === void 0 ? void 0 : _a.avatarURL()) ? embed.setThumbnail(bot.user.avatarURL()) : null;
        interaction.reply({
            embeds: [embed]
        });
    }
};
const DESCRIPTION_HELP = `
**Información**
▸ **\`/help\`** - Este comando.
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
`;
