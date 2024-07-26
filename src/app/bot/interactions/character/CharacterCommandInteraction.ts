import { ChatInputCommandInteraction, CacheType, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Message } from "discord.js";
import CommandInteraction from "../CommandInteraction";
import Helpers from "../../Helpers";
import AnilistAPI from "../../apis/anilist/AnilistAPI";
import NoResultsException from "../../../errors/NoResultsException";
import Postgres from "../../../database/postgres";
import Bot from "../../Bot";
import CharacterCommandQueries from "./CharacterCommandQueries";
import { Character } from "../../apis/anilist/tipos/Character";

export default class CharacterCommandInteraction extends CommandInteraction {
    protected interaction: ChatInputCommandInteraction<CacheType>;

    constructor (interaction: ChatInputCommandInteraction<CacheType>) {
        super();
        this.interaction = interaction;
    }

    public async execute (): Promise<void> {
        await this.interaction.deferReply();

        const characterQuery = this.interaction.options.getString('name-or-id');
        const character = await this.findCharacter(characterQuery);
        const characterEmbed = await this.createEmbed(character);

        await this.interaction.editReply({
            embeds: [characterEmbed]
        });
    }

    private async findCharacter (query: string): Promise<Character> {
        const characterQuery = CharacterCommandQueries.CreateCharacterQuery(query);
        const results = await AnilistAPI.fetch(characterQuery);
        if (results.errors) {
            if (results.errors[0].message.toLowerCase().includes('not found')) throw new NoResultsException('No se ha encontrado ese personaje.');
            throw new Error(results.errors[0].message);
        }
        return new Character(results.data.Character);
    }

    private async createEmbed (character: Character) {
        const embed = new EmbedBuilder();

        const name = character.getName();
        embed.setTitle(name === 'Rena Ryuuguu' ? 'Dione' : name);
        embed.setImage(character.getImageURL());
        embed.setURL(character.getURL());
        embed.setColor(Helpers.getRandomElement(['Blue', 'Red', 'Yellow']));
        embed.setFooter({
            text: `▸ Le gusta a ${character.getFavourites()} usuarios!`
        })

        return embed;
    }

    private createCollector (res: Message<boolean>, character: Character) {
        const collector = res.createMessageComponentCollector({
            time: CommandInteraction.TIEMPO_ESPERA_INTERACCION
        })

        collector.on('collect', async (button) => {
            await button.deferReply({ ephemeral: true });

            if (button.customId === 'buttonFavs') {
                const favs = await this.findCharacterFavs(character);
                const usernames = await this.getUsernames(favs);
                const embed = this.createEmbedFavs(usernames);

                await button.editReply({
                    embeds: [embed]
                })
            }
        })
    }

    private async findCharacterFavs (character: Character) {
        const users: any = await Postgres.query() `
            SELECT du.id_user, du.id_anilist FROM
                discord_user du
            JOIN
                membership mem
            ON
                mem.id_server = ${this.interaction.guild.id} and
                mem.id_user = du.id_user;  
        `;
    
        const query = CharacterCommandQueries.CreateCharacterFavouritesQuery(users);
        const characterFavs = new Array<string>()
        const results = await AnilistAPI.fetch(query);

        for (const q in results.data) {
            const qUser = results.data[q].users[0];
            if (!qUser) continue;
            const userFavs: Array<{ id: number }> = qUser.favourites.characters.nodes;
            if (!userFavs || userFavs.length <= 0) continue;
            if (userFavs.find(fav => fav.id === character.getId())) {
                characterFavs.push(users.find(u => u.id_anilist == qUser.id).id_user)
            };
        }

        return characterFavs;
    }

    private async getUsernames (usersIds: Array<string>) {
        const bot = this.interaction.client as Bot;
        const usernames = await Helpers.asyncMap(usersIds, async (id) => (await bot.fetchUser(id)).username);
        return usernames;
    }

    private createEmbedFavs (usernames: Array<string>) {
        const embed = new EmbedBuilder();
        embed.setColor(Helpers.getRandomElement(['Blue', 'Red', 'Yellow']));
        const description = usernames.map(name => `♥ ${name}`).join('\n');
        embed.setDescription(usernames.length > 0 ? description : 'Nadie lo ha marcado en este servidor... 💔');
        return embed;
    }
}