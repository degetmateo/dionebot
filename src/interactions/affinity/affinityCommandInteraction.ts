import postgres from "../../database/postgres";
import AffinityEmbed from "../../embeds/affinityEmbed";
import SuccessEmbed from "../../embeds/successEmbed";
import GenericError from "../../errors/genericError";
import BChatInputCommandInteraction from "../../extensions/interaction";
import Helpers from "../../helpers";
import Anilist from "../../services/anilist";
import { MediaEntry } from "../../types/anilist";
import searchEntries from "./searchEntries";

export default class AffinityCommandInteraction {
    private interaction: BChatInputCommandInteraction;

    constructor (interaction: BChatInputCommandInteraction) {
        this.interaction = interaction;
    };

    async execute () {
        // await this.interaction.reply({
        //     embeds: [new SuccessEmbed('Espere...')]
        // });

        await this.interaction.deferReply();

        const member = this.interaction.options.getUser('member', true);

        let qInteractionMember = null;
        let qOptionsMember = null;
        
        await postgres.sql().begin(async transaction => {
            qInteractionMember = (await transaction`
                SELECT * FROM 
                    member
                WHERE
                    discord_id = ${this.interaction.user.id};
            `)[0];

            if (!qInteractionMember) throw new GenericError('No estás registrado. 💔');

            qOptionsMember = (await transaction`
                SELECT * FROM 
                    member
                WHERE
                    discord_id = ${member.id};
            `)[0];

            if (!qOptionsMember) throw new GenericError(`<@${member.id}> no está registrado. 💔`);
        });

        const data = await searchEntries(qInteractionMember.anilist_id, qOptionsMember.anilist_id);

        const interactionUserAnime: Array<MediaEntry> = data.u1_anime.lists[0].entries;
        const interactionUserManga: Array<MediaEntry> = data.u1_manga.lists[0].entries;

        const optionsUserAnime: Array<MediaEntry> = data.u2_anime.lists[0].entries;
        const optionsUserManga: Array<MediaEntry> = data.u2_manga.lists[0].entries;

        const interactionUserMedia = [...interactionUserAnime, ...interactionUserManga];
        const optionsUserMedia = [...optionsUserAnime, ...optionsUserManga];

        const pearson = Helpers.pearson(interactionUserMedia, optionsUserMedia);

        await this.interaction.editReply({
            embeds: [new AffinityEmbed({ 
                affinity: pearson, 
                userAId: this.interaction.user.id, 
                userBId: member.id 
            })]
        });
    };
};