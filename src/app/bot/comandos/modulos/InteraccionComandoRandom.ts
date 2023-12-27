import { ChatInputCommandInteraction, CacheType } from "discord.js";
import InteraccionComando from "./InteraccionComando"
import Bot from "../../Bot";
import { uRegistrado } from "../../tipos";
import { MediaColeccion } from "../../apis/anilist/TiposAnilist";
import AnilistAPI from "../../apis/anilist/AnilistAPI";
import Helpers from "../../Helpers";
import EmbedAnime from "../../embeds/EmbedAnime";
import Anime from "../../apis/anilist/modelos/media/Anime";

export default class InteraccionComandoRandom extends InteraccionComando {
    protected interaction: ChatInputCommandInteraction<CacheType>;

    private bot: Bot;
    private server_id: string;

    private constructor (interaction: ChatInputCommandInteraction<CacheType>) {
        super();
        this.interaction = interaction;
        this.bot = this.interaction.client as Bot;
        this.server_id = this.interaction.guild.id;
    }

    public static async execute (interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        const modulo = new InteraccionComandoRandom(interaction);
        await modulo.execute(interaction);    
    }

    protected async execute (interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        await interaction.deferReply();

        const serverUsers = this.bot.usuarios.obtenerUsuariosRegistrados(this.server_id);
        const user = serverUsers.find(u => u.discordId === this.interaction.user.id);

        const res = await this.getUserPTW(user); 
        const entries = res.lists[0].entries;

        const random = Helpers.obtenerElementoAlAzar(entries);
        const anime = await AnilistAPI.buscarAnimePorID(random.mediaId);
        const embed = EmbedAnime.Crear(new Anime(anime));

        try {
            await this.interaction.editReply( {embeds: [embed] });
        } catch (error) {
            throw error;
        }
    }   

    private async getUserPTW (user: uRegistrado): Promise<MediaColeccion> {
        const request = `
            query {                
                MediaListCollection (userId: ${user.anilistId}, type: ANIME, status: PLANNING) {
                    ...mediaListCollection
                }
            }

            fragment mediaListCollection on MediaListCollection {
                lists {
                    entries {
                        mediaId
                    }
                }
            }
        `;

        const res = await AnilistAPI.peticion(request, {});
        return res.MediaListCollection as MediaColeccion;
    }
}