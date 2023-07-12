import { ChatInputCommandInteraction, CacheType } from "discord.js";
import InteraccionComando from "./InteraccionComando";
import AnilistAPI from "../../apis/AnilistAPI";
import Usuario from "../../apis/anilist/UsuarioAnilist";
import BOT from "../../bot";
import ErrorGenerico from "../../errores/ErrorGenerico";
import ErrorArgumentoInvalido from "../../errores/ErrorArgumentoInvalido";
import Plataforma from "../types/Plataforma";
import Embed from "../../embeds/Embed";
import { uRegistrado } from "../../types";
import Aniuser from "../../modelos/Aniuser";

export default class InteraccionComandoSetup extends InteraccionComando {
    protected interaction: ChatInputCommandInteraction<CacheType>;
    
    private constructor (interaction: ChatInputCommandInteraction<CacheType>) {
        super();
        this.interaction = interaction;
    }

    public static async execute (interaction: ChatInputCommandInteraction<CacheType>) {
        const modulo = new InteraccionComandoSetup(interaction);
        await modulo.execute(interaction);    
    }
    
    protected async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        await interaction.deferReply({ ephemeral: true });

        const plataforma: Plataforma = interaction.options.getString('plataforma') as Plataforma;
        const criterio: string = interaction.options.getString('nombre-o-id') as string;

        if (plataforma === 'MyAnimeList' || plataforma === 'VisualNovelDatabase') throw new ErrorArgumentoInvalido('La plataforma que has elegido no se encuentra disponible.');
        
        const bot = interaction.client as BOT;
    
        const serverID = interaction.guild?.id as string;
        const userID = interaction.user.id;

        const uRegistrados = bot.getUsuariosRegistrados(serverID);
        const uRegistrado = uRegistrados.find(u => u.discordId === userID);
    
        if (uRegistrado) throw new ErrorGenerico('Ya te encuentras registrado.');

        const usuario: Usuario = new Usuario(await AnilistAPI.obtenerUsuario(criterio));

        await InteraccionComandoSetup.SetupUsuario(usuario, serverID, userID);

        const newUsuarioRegistrado: uRegistrado = {
            discordId: userID,
            serverId: serverID,
            anilistUsername: usuario.obtenerNombre(),
            anilistId: usuario.obtenerID().toString()
        }

        bot.insertarUsuario(newUsuarioRegistrado);

        interaction.editReply({
            embeds: [Embed.CrearVerde("Listo! Te has registrado con éxito.")]
        })
    }

    private static async SetupUsuario (usuario: Usuario, serverID: string, discordID: string): Promise<void> {    
        const aniuser = new Aniuser({
            serverId: serverID,
            discordId: discordID,
            anilistId: usuario.obtenerID(),
            anilistUsername: usuario.obtenerNombre()
        });
    
        try {
            await aniuser.save();
        } catch (err) {
            throw err;
        }
    }
}