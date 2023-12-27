import { ChatInputCommandInteraction, CacheType } from "discord.js";
import InteraccionComando from "./InteraccionComando";
import AnilistAPI from "../../apis/anilist/AnilistAPI";
import Usuario from "../../apis/anilist/modelos/UsuarioAnilist";
import Plataforma from "../tipos/Plataforma";
import { uRegistrado } from "../../tipos";
import Bot from "../../Bot";
import Aniuser from "../../../database/modelos/Aniuser";
import ErrorArgumentoInvalido from "../../../errores/ErrorArgumentoInvalido";
import ErrorGenerico from "../../../errores/ErrorGenerico";
import Embed from "../../embeds/Embed";

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

        const plataforma: Plataforma = this.interaction.options.getString('plataforma') as Plataforma;
        const criterio: string = this.interaction.options.getString('nombre-o-id') as string;

        if (plataforma === 'MyAnimeList' || plataforma === 'VisualNovelDatabase') throw new ErrorArgumentoInvalido('La plataforma que has elegido no se encuentra disponible.');
        
        const bot = this.interaction.client as Bot;
    
        const serverID = this.interaction.guild?.id as string;
        const userID = this.interaction.user.id;

        const uRegistrados = bot.usuarios.obtenerUsuariosRegistrados(serverID);
        const uRegistrado = uRegistrados.find(u => u.discordId === userID);
    
        if (uRegistrado) throw new ErrorGenerico('Ya te encuentras registrado.');

        const usuario: Usuario = new Usuario(await AnilistAPI.buscarUsuario(criterio));

        await InteraccionComandoSetup.SetupUsuario(usuario, serverID, userID);

        const newUsuarioRegistrado: uRegistrado = {
            discordId: userID,
            serverId: serverID,
            anilistUsername: usuario.obtenerNombre(),
            anilistId: usuario.obtenerID().toString()
        }

        bot.usuarios.insertar(newUsuarioRegistrado);

        const embed = Embed.Crear()
            .establecerColor(Embed.COLOR_VERDE)
            .establecerDescripcion('Listo! Te has registrado con éxito.')
            .obtenerDatos();

        await this.interaction.editReply({
            embeds: [embed]
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