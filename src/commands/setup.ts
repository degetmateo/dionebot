import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import BOT from "../bot";
import { Setup } from "../modulos/Setup";
import { Usuarios } from "../modulos/Usuarios";
import { Usuario } from "../objetos/Usuario";
import { uRegistrado } from "../types";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Registra tu usuario de ANILIST en este servidor.")
        .addStringOption(option => 
            option
                .setName("username")
                .setDescription("Tu nombre de usuario de ANILIST.")
                .setRequired(true)),

    execute: async (interaction: ChatInputCommandInteraction) => {
        const bot = interaction.client as BOT;

        await interaction.deferReply({ ephemeral: true });
        
        const username = interaction.options.getString("username", true);
        const serverID = interaction.guild?.id  != null ? interaction.guild?.id : "";
        const userID = interaction.user.id;

        const uRegistrados = bot.getUsuariosRegistrados(serverID);
        const uRegistrado = uRegistrados.find(u => u.discordId === userID);
    
        if (uRegistrado) {
            return interaction.editReply({
                content: "Ya te encuentras registrado."
            })
        }

        const anilistUser = await Usuarios.BuscarUsuario(serverID, username);
        
        if (!anilistUser) {
            return interaction.editReply({
                content: "No se ha encontrado ese usuario en ANILIST."
            })
        }

        const usuario = new Usuario(anilistUser);
        const resultado = await Setup.SetupUsuario(usuario, serverID, userID);

        if (!resultado) {
            return interaction.editReply({
                content: "Ha ocurrido un error al intentar registrarte. Intentalo más tarde.",
            })
        }

        const newUsuarioRegistrado: uRegistrado = {
            discordId: userID,
            serverId: serverID,
            anilistUsername: usuario.getNombre(),
            anilistId: usuario.getID()
        }

        bot.insertarUsuario(newUsuarioRegistrado);

        return interaction.editReply({
            content: "Listo! Ya estás registrado.",
        })
    }
}