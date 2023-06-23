"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("help")
        .setDescription("Envía un mensaje con los comandos."),
    execute: async (interaction) => {
        const descripcion = "▹ `/setup` - Guardar tu usuario de ANILIST.\n▹ `/unsetup` - Elimina tu usuario de ANILIST.\n▹ `/usuario` - Ver la información del perfil de ANILIST de un usuario.\n▹ `/afinidad` - Muestra tu afinidad o la otro usuario con el resto del servidor.\n▹ `/obra` - Muestra la información de un anime o manga.\n▹ `/color` - Te da un rol con el color del código hexadecimal que pongas.\n▹ `/season` - Devuelve todos los animes que salieron en la temporada que elijas.";
        const embed = new builders_1.EmbedBuilder()
            .setTitle("▾ Comandos")
            .setDescription(descripcion.trim());
        interaction.reply({
            embeds: [embed]
        });
    }
};
