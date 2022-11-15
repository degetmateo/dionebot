import { EmbedBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Envía un mensaje con los comandos."),
    
    execute: async (interaction: ChatInputCommandInteraction) => {
        const descripcion = "▹ `/setup` - Guardar tu usuario de ANILISR.\n▹ `/unsetup` - Elimina tu usuario de ANILIST.\n▹ `!usuario` - Ver la información del perfil de ANILIST de un usuario.\n▹ `/afinidad` - Muestra tu afinidad o la otro usuario con el resto del servidor.\n▹ `/obra` - Muestra la información de un anime o manga.\n▹ `!color` - Te da un rol con el color del código hexadecimal que pongas.";
                
        return new EmbedBuilder()
            .setTitle("▾ Comandos")
            .setDescription(descripcion.trim());
    }
}