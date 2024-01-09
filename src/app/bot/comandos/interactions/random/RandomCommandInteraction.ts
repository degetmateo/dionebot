import { ChatInputCommandInteraction, CacheType } from "discord.js";
import CommandInteraction from "../CommandInteraction";
import Bot from "../../../Bot";
import NoResultsException from "../../../../errores/NoResultsException";
import CommandUnderMaintenanceException from "../../../../errores/CommandUnderMaintenanceException";
import AnilistAPI from "../../../apis/anilist/AnilistAPI";
import Helpers from "../../../Helpers";
import EmbedAnime from "../../../embeds/EmbedAnime";

export default class RandomCommandInteraction extends CommandInteraction {
    protected interaction: ChatInputCommandInteraction<CacheType>;
    
    constructor (interaction: ChatInputCommandInteraction<CacheType>) {
        super();
        this.interaction = interaction;
    }

    public async execute (): Promise<void> {
        await this.interaction.deferReply();

        const bot = this.interaction.client as Bot;
        const registeredUsers = bot.servers.getUsers(this.interaction.guildId);
        const user = registeredUsers.find(u => u.discordId === this.interaction.user.id);

        if (!user) throw new NoResultsException('No estas registrado.');

        const plannedAnimes = await AnilistAPI.fetchUserPlannedAnimes(user.anilistId);
        const randomAnime = Helpers.getRandomElement(plannedAnimes.lists[0].entries);

        if (!randomAnime) throw new NoResultsException('No se han encontrado animes planeados.');

        const anime = await AnilistAPI.fetchAnimeById(randomAnime.mediaId);
        const embed = EmbedAnime.Create(anime);

        try {
            await this.interaction.editReply( {embeds: [embed] });
        } catch (error) {
            throw error;
        }
    }
}