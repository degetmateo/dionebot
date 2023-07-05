import { EmbedBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Envía un mensaje con los comandos."),
    
    execute: async (interaction: ChatInputCommandInteraction) => {
        const descripcion = "▹ `/informacion` - Informacion acerca de mi.\n▹ `/setup` - Guardar tu usuario de ANILIST.\n▹ `/unsetup` - Elimina tu usuario de ANILIST.\n▹ `/usuario` - Ver la información del perfil de ANILIST de un usuario.\n▹ `/afinidad` - Muestra tu afinidad o la otro usuario con el resto del servidor.\n▹ `/anime` - Muestra la información del anime que busques.\n▹ `/manga` - Muestra la información del manga que busques.\n▹ `/vn` - Muestra información de la novela visual que busques.\n▹ `/season` - Devuelve todos los animes que salieron en la temporada que elijas.";
                
        const embed = new EmbedBuilder()
            .setTitle("▾ Comandos")
            .setDescription(descripcion.trim())
            .setColor(0xff8c00);

        interaction.reply({
            embeds: [embed]
        })
    }
}