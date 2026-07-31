import UserRowComponent from "../../../../builders/components/user.row.component";
import UserProfileEmbed from "../../../../builders/embeds/user/user.profile.embed";
import mongo from "../../../../database/mongo";
import GenericError from "../../../../errors/genericError";
import GuildChatInputCommandInteraction from "../../../../extensions/guildChatInputCommandInteraction.extension";

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

    const embeds: any = {
        profile: null,
        anilist: null,
        mal: null,
        vndb: null
    };

    embeds['profile'] = new UserProfileEmbed({ member, user });

    const id = interaction.client.set({ member, user, embeds }, 120_000);

    const buttons = new UserRowComponent({
        id: id,
        anilist: member.anilist,
        mal: member.mal,
        vndb: member.vndb,
        profile: false
    });

    await interaction.editReply({
        embeds: [embeds['profile']],
        components: buttons.isValid() ? [buttons] : []
    });
};

export default userExecute;