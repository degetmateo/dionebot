import { ChatInputCommandInteraction, CacheType, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from "discord.js";
import InteraccionComando from "./InteraccionComando";
import AnilistAPI from "../../apis/AnilistAPI";
import Usuario from "../../apis/anilist/UsuarioAnilist";
import EmbedUsuario from "../../embeds/EmbedUsuario";
import ErrorSinResultados from "../../errores/ErrorSinResultados";
import Aniuser from "../../modelos/Aniuser";
import Boton from "../componentes/Boton";

export default class InteraccionComandoUsuario extends InteraccionComando {
    protected interaction: ChatInputCommandInteraction<CacheType>;
    
    private constructor (interaction: ChatInputCommandInteraction<CacheType>) {
        super();
        this.interaction = interaction;
    }

    public static async execute (interaction: ChatInputCommandInteraction<CacheType>) {
        const modulo = new InteraccionComandoUsuario(interaction);
        await modulo.execute(interaction);    
    }

    protected async execute (interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        await interaction.deferReply();

        const idUsuario = interaction.options.getUser("usuario")?.id || interaction.user.id;
        const idServidor = interaction.guild?.id as string;

        const usuarioRegistrado = await Aniuser.findOne({ serverId: idServidor, discordId: idUsuario });
        if (!usuarioRegistrado) throw new ErrorSinResultados('El usuario especificado no esta registrado.');

        const usuarioAnilist: Usuario = new Usuario(await AnilistAPI.obtenerUsuario(parseInt(usuarioRegistrado.anilistId as string)));  

        const botonPrevio = Boton.CrearPrevio();
        const botonSiguiente = Boton.CrearSiguiente();

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(botonPrevio, botonSiguiente);

        const embeds: Array<EmbedUsuario> = [EmbedUsuario.CrearPrincipal(usuarioAnilist)];

        if (usuarioAnilist.obtenerAnimesFavoritos().length > 0) embeds.push(EmbedUsuario.CrearInformacionAnime(usuarioAnilist));
        if (usuarioAnilist.obtenerMangasFavoritos().length > 0) embeds.push(EmbedUsuario.CrearInformacionManga(usuarioAnilist));
        if (usuarioAnilist.obtenerPersonajesFavoritos().length > 0) embeds.push(EmbedUsuario.CrearInformacionFavoritosExtra(usuarioAnilist));

        let indiceEmbedActual = 0;
        let ultimoIndice = embeds.length - 1;

        const respuesta = await interaction.editReply({
            embeds: [embeds[indiceEmbedActual]],
            components: [row]
        })

        try {
            const collector = respuesta.createMessageComponentCollector({ time: 120_000 });

            collector.on('collect', async boton => {
                if (boton.customId === Boton.BotonPrevioID) {
                    indiceEmbedActual--;
                    if (indiceEmbedActual < 0) indiceEmbedActual = ultimoIndice;
                }
    
                if (boton.customId === Boton.BotonSiguienteID) {
                    indiceEmbedActual++;
                    if (indiceEmbedActual > ultimoIndice) indiceEmbedActual = 0;
                }

                await boton.update({ embeds: [embeds[indiceEmbedActual]], components: [row] });
            })
        } catch (error) {
            await interaction.editReply({ components: [] });
        }
    }
}