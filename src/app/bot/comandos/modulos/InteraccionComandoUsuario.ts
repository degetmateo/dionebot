import { ChatInputCommandInteraction, CacheType } from "discord.js";
import InteraccionComando from "./InteraccionComando";
import AnilistAPI from "../../apis/anilist/AnilistAPI";
import Usuario from "../../apis/anilist/modelos/UsuarioAnilist";
import ErrorSinResultados from "../../../errores/ErrorSinResultados";
import EmbedUsuario from "../../embeds/EmbedUsuario";
import ServerModel from "../../../database/modelos/ServerModel";

export default class InteraccionComandoUsuario extends InteraccionComando {
    protected interaction: ChatInputCommandInteraction<CacheType>;
    private embeds: Array<EmbedUsuario>

    private constructor (interaction: ChatInputCommandInteraction<CacheType>) {
        super();
        this.interaction = interaction;
        this.embeds = new Array<EmbedUsuario>();
    }

    public static async execute (interaction: ChatInputCommandInteraction<CacheType>) {
        const module = new InteraccionComandoUsuario(interaction);
        await module.execute();    
    }

    protected async execute (): Promise<void> {
        await this.interaction.deferReply();

        const userId = this.interaction.options.getUser("usuario")?.id || this.interaction.user.id;
        const serverId = this.interaction.guild?.id as string;

        const server = await ServerModel.findOne({ id: serverId });
        const registeredUser = server.users.find(u => u.discordId === userId);

        if (!registeredUser) throw new ErrorSinResultados('El usuario especificado no esta registrado.');

        const anilistUser = new Usuario(await AnilistAPI.buscarUsuario(parseInt(registeredUser.anilistId)));  
        
        this.embeds.push(await EmbedUsuario.CrearPrincipal(anilistUser));

        await this.interaction.editReply({
            embeds: this.embeds
        })
    }
}