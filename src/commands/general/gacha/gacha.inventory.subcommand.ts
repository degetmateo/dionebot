import { MessageFlags, User } from "discord.js";
import GuildChatInputCommandInteraction from "../../../extensions/guildChatInputCommandInteraction.extension";
import mongo from "../../../database/mongo";
import GachaInventoryComponent from "../../../components/gacha-inventory.component";

export const gachaInventorySubcommand = async (interaction: GuildChatInputCommandInteraction) => {
    const optionsUser: User = interaction.options.getUser('user', false) || interaction.user;
    
    const claims = await mongo.claims.find({
        guild_id: interaction.guild.id,
        user_id: optionsUser.id
    }).toArray();

    const claimedCharacters: any = await mongo.characters.find({
        _id: {
            $in: claims.map(claim => claim.character_id)
        }
    }).sort({ favourites: 'desc' }).toArray();

    let splittedCharacters: Array<Array<{ name: string; url: string }>> = [];
    let temp: Array<{ name: string; url: string }> = [];
    let q = 0;

    for (const c of claimedCharacters) {
        temp.push(c);
        q++;
        
        if (q === 20) {
            splittedCharacters.push(temp);
            q = 0;
            temp = [];
        };
    };

    if (q > 0) {
        splittedCharacters.push(temp);
    };

    let cards: GachaInventoryComponent[] = [];

    const id = interaction.client.set({}, 120_000);

    let i = 1;
    const t = splittedCharacters.length;
    const showIndex = splittedCharacters.length > 1;
    for (const c of splittedCharacters) {
        cards.push(new GachaInventoryComponent({
            id: id,
            user:
            optionsUser,
            characters: c,
            pageNumber: i,
            pageTotal: t,
            showIndex
        }));

        i++;
    };

    interaction.client.update(id, {
        cards: cards,
        index: 0
    }, 120_000);

    await interaction.reply({
        flags: [MessageFlags.IsComponentsV2],
        components: [cards[0]]
    });
};