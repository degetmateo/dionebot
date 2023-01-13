"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("afinidad")
        .setDescription("Calcula la afinidad entre vos (u otro usuario) y los demás miembros registrados del servidor.")
        .addUserOption(option => option
        .setName("usuario")
        .setDescription("Usuario del que quieres calcular la afinidad.")),
    execute: async (interaction) => {
        const bot = interaction.client;
        return interaction.reply({
            content: "Este comando se encuentra en mantenimiento.",
            ephemeral: true
        });
        // const serverID = interaction.guild?.id != null ? interaction.guild.id : "";
        // if (bot.isGettingAfinitty(serverID)) {
        //     return interaction.reply({
        //         content: "Ya se está calculando la afinidad de alguien más en este momento.",
        //         ephemeral: true
        //     })
        // }
        // bot.setGettingAffinity(serverID, true);
        // const usuario = interaction.options.getUser("usuario");
        // const userID = usuario == null ? interaction.user.id : usuario.id;
        // const uRegistrados = bot.getUsuariosRegistrados(serverID);
        // const uRegistrado = uRegistrados.find(u => u.discordId === userID);
        // if (!uRegistrado) {
        //     bot.setGettingAffinity(serverID, false);
        //     return interaction.reply({
        //         content: "El usuario no está registrado.",
        //         ephemeral: true
        //     })
        // }
        // await interaction.deferReply();
        // const anilistUser = await Usuarios.BuscarUsuario(serverID, uRegistrado.anilistUsername);
        // if (!anilistUser) {
        //     bot.setGettingAffinity(serverID, false);
        //     return interaction.editReply({
        //         content: `No se ha encontrado al usuario **${uRegistrado.anilistUsername}** en la base de datos de ANILIST. Probablemente se haya cambiado el nombre.`
        //     })
        // }
        // const aniuser1 = new Usuario(anilistUser);
        // try {
        //     const afinidades = await Afinidad.GetAfinidadUsuario(aniuser1, uRegistrados);
        //     const EmbedInformacionAfinidad = Embeds.EmbedAfinidad(aniuser1, afinidades);
        //     bot.setGettingAffinity(serverID, false);
        //     return interaction.editReply({
        //         embeds: [EmbedInformacionAfinidad]
        //     })
        // } catch (err) {
        //     console.error(err);
        //     bot.setGettingAffinity(serverID, false);
        //     return interaction.editReply({
        //         content: "Ha ocurrido un error inesperado. Inténtalo de nuevo más tarde."
        //     })
        // }
    }
};
