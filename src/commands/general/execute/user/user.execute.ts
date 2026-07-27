import UserRowComponent from "../../../../builders/components/user.row.component";
import mongo from "../../../../database/mongo";
import GenericError from "../../../../errors/genericError";
import GuildChatInputCommandInteraction from "../../../../extensions/guildChatInputCommandInteraction.extension";
import createUserEmbed from "./create.user.embed";

const userExecute = async (interaction: GuildChatInputCommandInteraction) => {
    await interaction.deferReply();

    const user = await (interaction.options.getUser('member') || interaction.user).fetch(true);
    const memberId = user.id;

    const members = mongo.collection('members');
    const member = await members.findOne({ discord_id: memberId });
    
    if (!member) {
        if (memberId === interaction.user.id) {
            throw new GenericError(`No estás registrado. Usá \`/setup\` para registrarte.`);
        } else {
            throw new GenericError(`<@${memberId}> no está registrado. Debe usar \`/setup\` para registrarse.`);
        };
    };

    const platform: null | 'ANILIST' | 'MAL' | 'VNDB' = member.profile ? member.profile.preferred_platform || null : null;

    const embeds: any = {
        profile: null,
        anilist: null,
        mal: null,
        vndb: null
    };

    embeds['profile'] = await createUserEmbed(platform, member, user);

    const id = interaction.client.set({ platform, member, user, embeds }, 120_000);

    const buttons = new UserRowComponent({
        id: id,
        anilist: platform != 'ANILIST' && member.anilist,
        mal: platform != 'MAL' && member.mal,
        vndb: platform !='VNDB' && member.vndb,
        profile: false
    });

    await interaction.editReply({
        embeds: [embeds['profile']],
        components: buttons.isValid() ? [buttons] : []
    });
};

export default userExecute;