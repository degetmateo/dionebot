import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import BOT from "../bot";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("informacion")
        .setDescription("Obtén información acerca de mi!"),
    
    execute: async (interaction: ChatInputCommandInteraction) => {
        const bot: BOT = interaction.client as BOT;

        const descripcion = `Mi nombre es Dione y soy un bot de Discord que está siendo desarrollado en TypeScript.

        Mis funciones principales incluyen buscar y mostrar información acerca de animes y mangas en tu servidor utilizando la API de Anilist.
        
        Aunque aún no poseo demasiadas opciones, en el futuro se irán implementando muchas más.
        
        Si lo deseas, puedes invitarme a tu servidor presionando el enlace que se encuentra debajo.
        
        Invítame!: https://dionebot.onrender.com/`;
                
        const embed = new EmbedBuilder()
            .setTitle("▾ Información")
            .setDescription(descripcion.trim())
            .setColor(0xff8c00)
            .setFooter({ text: `Dione v${bot.getVersion()}` });

        const avatarURL = bot.user?.avatarURL();

        if (avatarURL) {
            embed.setThumbnail(avatarURL);
        }

        interaction.reply({
            embeds: [embed]
        })
    }
}