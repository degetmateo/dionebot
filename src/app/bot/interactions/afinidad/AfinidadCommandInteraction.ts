import { ChatInputCommandInteraction, CacheType, EmbedBuilder } from "discord.js";
import CommandInteraction from "../CommandInteraction";
import AfinidadInteractionController from "./AfinidadInteractionController";
import ServerModel from "../../../database/modelos/ServerModel";
import NoResultsException from "../../../errors/NoResultsException";
import Bot from "../../Bot";
import Helpers from "../../Helpers";
import AnilistAPI from "../../apis/anilist/AnilistAPI";
import AnilistUser from "../../apis/anilist/modelos/AnilistUser";
import { MediaScore, SharedMedia, Affinity } from "./types/affinity";
import { User } from "../../../database/types";

export default class AfinidadCommandInteraction extends CommandInteraction {
    protected interaction: ChatInputCommandInteraction<CacheType>;

    constructor (interaction: ChatInputCommandInteraction<CacheType>) {
        super();
        this.interaction = interaction;
    }

    public async execute (): Promise<void> {
        const response = await this.interaction.deferReply();
        const bot = this.interaction.client as Bot;
        
        const inputUser = this.interaction.options.getUser('usuario');
        const userId = inputUser ? inputUser.id : this.interaction.user.id;

        const registeredUsers = bot.servers.getUsers(this.interaction.guild.id);
        const user = registeredUsers.find(u => u.discordId === userId);
        if (!user) throw new NoResultsException('Tu o el usuario especificado no están registrados.');

        const anilistUser = await AnilistAPI.fetchUserById(parseInt(user.anilistId));
        if (!anilistUser) throw new NoResultsException('Tu o el usuario especificado no se encuentran en Anilist.');

        const affinities = await this.getUserAffinities(anilistUser, registeredUsers);
        if (!affinities || affinities.length <= 0) throw new NoResultsException('No hay afinidades disponibles.');

        const embeds = this.createEmbeds(anilistUser, affinities);

        const interactionController = new AfinidadInteractionController(response, embeds);
        await interactionController.execute();
    }

    private async getUserAffinities (user: AnilistUser, registeredUsers: User[]) {
        const usersCompletedLists = await AnilistAPI.fetchUsersCompletedLists(user, registeredUsers.map(u => u.anilistId));
        const mainUserCollection = usersCompletedLists.user.lists[0];
        const mainUserCompletedMedia = mainUserCollection.entries;
        
        if (!mainUserCollection || mainUserCompletedMedia.length <= 0) throw new NoResultsException('El usuario especificado no tiene animes completados.');

        const usersCollection = usersCompletedLists.users;

        const affinities: Array<{ name: string, affinity: number }> = [];

        for (const iterativeUser of registeredUsers) {
            if (iterativeUser.anilistId === user.getId() + '') continue;
            const iterativeUserDiscord = await this.interaction.client.users.fetch(iterativeUser.discordId);
            if (!iterativeUserDiscord) continue;

            const iterativeUserUsername = iterativeUserDiscord.username;
            if (iterativeUserUsername.toLowerCase().includes('deleted user')) {
                await ServerModel.updateOne(
                    { id: this.interaction.guildId },
                    { $pull: { users: { discordId: iterativeUser.discordId } } });
                
                const bot = this.interaction.client as Bot;
                await bot.loadServers();

                continue;
            }

            const iterativeUserCompletedCollection = usersCollection.find(u => u.user.id === parseInt(iterativeUser.anilistId)).lists[0];
            if (!iterativeUserCompletedCollection) continue;
            const iterativeUserCompletedMedia = iterativeUserCompletedCollection.entries;
            if (!iterativeUserCompletedMedia || iterativeUserCompletedMedia.length <= 0) continue;

            const affinity = await this.handleAffinity(mainUserCompletedMedia, iterativeUserCompletedMedia);
            affinities.push({ name: iterativeUserUsername, affinity: parseFloat(affinity.toFixed(2)) });
        }

        return this.sortAffinities(affinities);
    }

    private async handleAffinity (mainUserCompletedMedia: Array<MediaScore>, secondUserCompletedMedia: Array<MediaScore>) {
        const sharedMedia = this.getSharedMedia(mainUserCompletedMedia, secondUserCompletedMedia);
        return this.calculateAffinity(sharedMedia);
    }

    private getSharedMedia (mainUserCompletedMedia: MediaScore[], secondUserCompletedMedia: MediaScore[]) {
        const sharedMedia = new Array<SharedMedia>();

        for (const mainUserMedia of mainUserCompletedMedia) {
            const secondUserMedia = secondUserCompletedMedia.find(media => media.mediaId === mainUserMedia.mediaId);
            if (!secondUserMedia) continue;
            sharedMedia.push({ id: mainUserMedia.mediaId, scoreA: mainUserMedia.score, scoreB: secondUserMedia.score });
        }

        return sharedMedia;
    }

    /**
     * Método que calcula el coeficiente de correlación personal entre dos usuarios.
     * Basado en:
     * https://en.wikipedia.org/wiki/Pearson_correlation_coefficient
     * 
     * https://github.com/AlexanderColen/Annie-May-Discord-Bot/blob/default/Annie/Utility/AffinityUtility.cs
     * @param sharedMedia Arreglo con la media compartida por los dos usuarios.
     * @returns Porcentaje de la afinidad.
     */

    private calculateAffinity (sharedMedia: Array<SharedMedia>): number {
        const scoresA: Array<number> = sharedMedia.map(media => media.scoreA);
        const scoresB: Array<number> = sharedMedia.map(media => media.scoreB);

        const ma = Helpers.calculateAverage(scoresA);
        const mb = Helpers.calculateAverage(scoresB);

        const am = scoresA.map(score => score - ma);
        const bm = scoresB.map(score => score - mb);

        const sa = am.map(x => Math.pow(x, 2));
        const sb = bm.map(x => Math.pow(x, 2));

        const numerator = Helpers.addElements(this.zip(am, bm).map(tupla => tupla[0] * tupla[1]));
        const denominator = Math.sqrt(Helpers.addElements(sa) * Helpers.addElements(sb));

        return (numerator <= 0 || denominator <= 0 ? 0 : numerator / denominator) * 100;
    }

    private zip = (a: Array<number>, b: Array<number>) => a.map((k, i) => [k, b[i]]);

    private sortAffinities (affinities: Array<Affinity>): Array<Affinity> {
        return affinities.sort((a, b) => {
            if (a.affinity < b.affinity) return 1;
            if (a.affinity > b.affinity) return -1;
            return 0;
        });
    }

    private createEmbeds (user: AnilistUser, affinities: Array<Affinity>): Array<EmbedBuilder> {
        const embeds = Array<EmbedBuilder>();
        const numEmbeds = (affinities.length / 10) + 1;

        for (let i = 0; i < numEmbeds; i++) {
            let actualPart = affinities.slice(i * 10, (i * 10) + 10);
            let actualCheckedPart = new Array<Affinity>();

            for (const p of actualPart) {
                if (p) actualCheckedPart.push(p);
            }

            if (actualCheckedPart.length <= 0) continue;

            const embed = new EmbedBuilder();
            const information: string = actualCheckedPart.map((a, e) => `**\`(${e + 1 + (i * 10)})\`** **[${a.affinity}%]** ▸ ${a.name}`).join('\n');
            embed.setDescription(information);

            const avatar = user.getAvatarURL();
            avatar ? embed.setThumbnail(avatar) : null;

            embed.setColor(user.getColor());
            embed.setTitle('Afinidad de ' + user.getName());
            embed.setFooter({ text: `Pagina ${i + 1} de ${(numEmbeds - 1).toFixed(0)}` });
            embeds.push(embed);
        }

        return embeds;
    }
}