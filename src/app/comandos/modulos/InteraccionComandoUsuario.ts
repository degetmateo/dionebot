import { ChatInputCommandInteraction, CacheType, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } from "discord.js";
import InteraccionComando from "./InteraccionComando";
import AnilistAPI from "../../apis/AnilistAPI";
import Usuario from "../../apis/anilist/modelos/UsuarioAnilist";
import EmbedUsuario from "../../embeds/EmbedUsuario";
import ErrorSinResultados from "../../errores/ErrorSinResultados";
import Aniuser from "../../modelos/Aniuser";

export default class InteraccionComandoUsuario extends InteraccionComando {
    protected interaction: ChatInputCommandInteraction<CacheType>;
    private embeds: Array<EmbedUsuario>

    private constructor (interaction: ChatInputCommandInteraction<CacheType>) {
        super();
        this.interaction = interaction;
        this.embeds = new Array<EmbedUsuario>();
    }

    public static async execute (interaction: ChatInputCommandInteraction<CacheType>) {
        const modulo = new InteraccionComandoUsuario(interaction);
        await modulo.execute();    
    }

    protected async execute (): Promise<void> {
        await this.interaction.deferReply();

        const idUsuario = this.interaction.options.getUser("usuario")?.id || this.interaction.user.id;
        const idServidor = this.interaction.guild?.id as string;

        const usuarioRegistrado = await Aniuser.findOne({ serverId: idServidor, discordId: idUsuario });
        if (!usuarioRegistrado) throw new ErrorSinResultados('El usuario especificado no esta registrado.');

        const usuario: Usuario = new Usuario(await AnilistAPI.buscarUsuario(parseInt(usuarioRegistrado.anilistId as string)));  
        
        this.embeds.push(EmbedUsuario.CrearPrincipal(usuario));

        const embedFavs = EmbedUsuario.CrearMediaFavorita(usuario);
        embedFavs ? this.embeds.push(embedFavs) : null;

        await this.interaction.editReply({
            embeds: this.embeds
        })
    }
}