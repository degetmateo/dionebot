import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import Helpers from "../../helpers";
import AnimeValidator from "../../validators/animeValidator";
import SuccessEmbed from "../../embeds/successEmbed";
import GenericError from "../../errors/genericError";
import postgres from "../../database/postgres";
import ErrorEmbed from "../../embeds/errorEmbed";
import ScoresEmbed from "../../embeds/scoresEmbed";
import BChatInputCommandInteraction from "../../extensions/interaction";
import searchMangaById from "./searchMangaById";
import MangaEmbed from "../../embeds/mangaEmbed";
import searchMangaByName from "./searchMangaByName";
import searchScores from "../../apis/anilist/searchScores";
import LoadingEmbed from "../../embeds/loadingEmbed";

export default class MangaCommandInteraction {
    private interaction: BChatInputCommandInteraction;
    
    constructor (interaction: BChatInputCommandInteraction) {
        this.interaction = interaction;
    };

    async execute () {
        // await this.interaction.reply({
        //     embeds: [new LoadingEmbed()]
        // });

        await this.interaction.deferReply();

        const args = this.interaction.options.getString('name-or-id') as string;

        const members: Array<{ discord_id: string; anilist_id: string }> = (await postgres.sql()`
            SELECT
                m.discord_id,
                m.anilist_id
            FROM
                membership ms
            LEFT JOIN
                member m ON m.discord_id = ms.member_discord_id
            WHERE
                guild_discord_id = ${this.interaction.guild.id} AND
                scores = 'ENABLED';
        `);

        if (Helpers.isNumber(args)) {
            AnimeValidator.validateId(args);

            const data = await searchMangaById(args);
            
            if (members.length <= 0) {
                return await this.interaction.editReply({
                    embeds: [new MangaEmbed(data)]
                });
            };

            await this.interaction.editReply({
                embeds: [new MangaEmbed(data), new SuccessEmbed('Buscando puntuaciones...')]
            });

            const scores = await searchScores(args, members.map(m => m.anilist_id));

            const embed = scores.length > 0 ?
                new ScoresEmbed(scores) :
                new ErrorEmbed('¡Parece que nadie conoce esto!');

            await this.interaction.editReply({
                embeds: [new MangaEmbed(data), embed]
            });
        } else {
            AnimeValidator.validateName(args);

            const data: { media: any[] } = await searchMangaByName(args);
            if (data.media.length <= 0) throw new GenericError('¡No encontramos resultados!');
            
            const media = data.media;
            const embeds = media.map(m => new MangaEmbed(m));
            const scores = [];

            let index = 0;

            const row = new ActionRowBuilder<ButtonBuilder>();
            const backButton = new ButtonBuilder()
                .setCustomId('back')
                .setLabel('←')
                .setStyle(ButtonStyle.Primary);
            const nextButton = new ButtonBuilder()
                .setCustomId('next')
                .setLabel('→')
                .setStyle(ButtonStyle.Primary);
            row.addComponents(backButton, nextButton);

            if (members.length <= 0) {
                scores[index] = new ErrorEmbed('¡Parece que nadie conoce esto!');
            } else {
                const s = await searchScores(media[index].id, members.map(m => m.anilist_id));

                scores[index] = s.length > 0 ?
                    new ScoresEmbed(s) :
                    new ErrorEmbed('¡Parece que nadie conoce esto!');
            };
            
            const response = await this.interaction.editReply({
                embeds: [embeds[index], scores[index]],
                components: [row]
            });

            const collector = response.createMessageComponentCollector({
                time: 300000
            });

            collector.on('collect', async (button) => {
                try {
                    if (button.customId === 'next') {
                        index++;
                        if (index > embeds.length - 1) {
                            index = 0;
                        };
                    };
        
                    if (button.customId === 'back') {
                        index--;
                        if (index < 0) {
                            index = embeds.length - 1;
                        };
                    };

                    if (!scores[index]) {
                        if (members.length <= 0) {
                            scores[index] = new ErrorEmbed('¡Parece que nadie conoce esto!');
                        } else {
                            const s = await searchScores(media[index].id, members.map(m => m.anilist_id));
    
                            scores[index] = s.length > 0 ?
                                new ScoresEmbed(s) :
                                new ErrorEmbed('¡Parece que nadie conoce esto!');
                        };
                    };

                    if (button.replied || button.deferred) {
                        await button.editReply({
                            embeds: [embeds[index], scores[index]],
                            components: [row]
                        });
                    } else {
                        await button.update({
                            embeds: [embeds[index], scores[index]],
                            components: [row]
                        });
                    };
                } catch (error) {
                    console.error(error);
                    collector.stop();
                };
            });
        };
    };
};