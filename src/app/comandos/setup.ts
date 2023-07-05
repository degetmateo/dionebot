import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import BOT from "../bot";
import { Setup } from "../modulos/Setup";
import { Usuarios } from "../modulos/Usuarios";
import { UsuarioAnilist } from "../objetos/UsuarioAnilist";
import EmbedError from "../embeds/Embed";
import Plataforma from "../tipos/Plataforma";
import Embed from "../embeds/Embed";
import { uRegistrado } from "../types";
import ArgumentoInvalidoError from "../errores/ErrorArgumentoInvalido";
import SinResultadosError from "../errores/ErrorSinResultados";
import ErrorGenerico from "../errores/ErrorGenerico";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Enlaza tu cuenta de una de estas plataformas.")
        .addStringOption(option => 
            option
                .setName('plataforma')
                .setDescription('Plataformas actualmente disponibles.')
                .addChoices(
                    { name: 'Anilist', value: 'Anilist' },
                    { name: 'MyAnimeList', value: 'MyAnimeList' },
                    { name: 'VisualNovelDatabase', value: 'VisualNovelDatabase' })
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('nombre-o-id')
                .setDescription('Tu nombre o ID de usuario.')
                .setRequired(true)),

    execute: async (interaction: ChatInputCommandInteraction): Promise<void> => {
        await interaction.deferReply({ ephemeral: true });

        const plataforma: Plataforma = interaction.options.getString('plataforma') as Plataforma;
        const criterio: string = interaction.options.getString('nombre-o-id') as string;

        if (plataforma === 'MyAnimeList' || plataforma === 'VisualNovelDatabase') throw new ArgumentoInvalidoError('La plataforma que has elegido no se encuentra disponible.');
        
        const bot = interaction.client as BOT;
    
        const serverID = interaction.guild?.id as string;
        const userID = interaction.user.id;

        const uRegistrados = bot.getUsuariosRegistrados(serverID);
        const uRegistrado = uRegistrados.find(u => u.discordId === userID);
    
        if (uRegistrado) throw new ErrorGenerico('Ya te encuentras registrado.');

        const anilistUser = await Usuarios.BuscarUsuario(serverID, criterio);
        if (!anilistUser) throw new SinResultadosError("No se ha encontrado a ese usuario en anilist.");

        const usuario = new UsuarioAnilist(anilistUser);

        await Setup.SetupUsuario(usuario, serverID, userID);

        const newUsuarioRegistrado: uRegistrado = {
            discordId: userID,
            serverId: serverID,
            anilistUsername: usuario.getNombre(),
            anilistId: usuario.getID()
        }

        bot.insertarUsuario(newUsuarioRegistrado);

        interaction.editReply({
            embeds: [Embed.CrearVerde("Listo! Te has registrado con éxito.")]
        })
    }
}