import { ChatInputCommandInteraction, SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } from "discord.js";
import EmbedUsuario from "../embeds/EmbedUsuario";
import Aniuser from "../modelos/Aniuser";
import ErrorSinResultados from "../errores/ErrorSinResultados";
import Usuario from "../apis/anilist/Usuario";
import AnilistAPI from "../apis/AnilistAPI";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("usuario")
        .setDescription("Muestra la información del perfil de Anilist de un usuario.")
        .addUserOption(option => 
            option
                .setName("usuario")
                .setDescription("El usuario del que se solicita la información.")),

    execute: async (interaction: ChatInputCommandInteraction): Promise<void> => {
        await interaction.deferReply();

        const idUsuario = interaction.options.getUser("usuario")?.id || interaction.user.id;
        const idServidor = interaction.guild?.id as string;

        const usuarioRegistrado = await Aniuser.findOne({ serverId: idServidor, discordId: idUsuario });
        if (!usuarioRegistrado) throw new ErrorSinResultados('El usuario especificado no esta registrado.');

        const usuarioAnilist: Usuario = await AnilistAPI.obtenerUsuario(parseInt(usuarioRegistrado.anilistId as string));  

        const botonPaginaPrevia = new ButtonBuilder({ 
            type: ComponentType.Button,
            style: ButtonStyle.Primary,
            customId: 'botonPaginaPrevia',
            label: '←',
        })

        const botonPaginaSiguiente = new ButtonBuilder({ 
            type: ComponentType.Button,
            style: ButtonStyle.Primary,
            customId: 'botonPaginaSiguiente',
            label: '→',
        })

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(botonPaginaPrevia, botonPaginaSiguiente);

        const embeds: Array<EmbedUsuario> = [
            EmbedUsuario.CrearPrincipal(usuarioAnilist),
            EmbedUsuario.CrearInformacionAnime(usuarioAnilist),
            EmbedUsuario.CrearInformacionManga(usuarioAnilist),
            EmbedUsuario.CrearInformacionFavoritosExtra(usuarioAnilist),
        ];

        let indiceEmbedActual = 0;
        let ultimoIndice = embeds.length - 1;

        const respuesta = await interaction.editReply({
            embeds: [embeds[indiceEmbedActual]],
            components: [row]
        })

        try {
            const collector = respuesta.createMessageComponentCollector({ time: 120_000 });

            collector.on('collect', async boton => {
                if (boton.customId === 'botonPaginaPrevia') {
                    indiceEmbedActual--;
                    if (indiceEmbedActual < 0) indiceEmbedActual = ultimoIndice;
                    await boton.update({ embeds: [embeds[indiceEmbedActual]], components: [row] });
                }
    
                if (boton.customId === 'botonPaginaSiguiente') {
                    indiceEmbedActual++;
                    if (indiceEmbedActual > ultimoIndice) indiceEmbedActual = 0;
                    await boton.update({ embeds: [embeds[indiceEmbedActual]], components: [row] });
                }
            })
        } catch (error) {
            await interaction.editReply({ components: [] });
        }
    }
}