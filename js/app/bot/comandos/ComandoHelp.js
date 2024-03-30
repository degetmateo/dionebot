"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
class ComandoHelp {
    constructor() {
        this.cooldown = 5;
        this.data = new discord_js_1.SlashCommandBuilder()
            .setName("help")
            .setDescription("Envía un mensaje con los comandos.");
        this.DESCRIPCION = `
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
    }
    async execute(interaction) {
        var _a;
        const bot = interaction.client;
        const embed = new builders_1.EmbedBuilder()
            .setTitle("Comandos")
            .setDescription(this.DESCRIPCION)
            .setColor(0xff8c00);
        ((_a = bot.user) === null || _a === void 0 ? void 0 : _a.avatarURL()) ? embed.setThumbnail(bot.user.avatarURL()) : null;
        interaction.reply({
            embeds: [embed]
        });
    }
}
exports.default = ComandoHelp;
