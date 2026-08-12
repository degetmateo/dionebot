import UserRowComponent from "../../../../../builders/components/user.row.component";
import UserProfileEmbed from "../../../../../builders/embeds/user/user.profile.embed";
import mongo from "../../../../../database/mongo";
import GenericError from "../../../../../errors/genericError";
import GuildChatInputCommandInteraction from "../../../../../extensions/guildChatInputCommandInteraction.extension";


const userExecute = async (interaction: GuildChatInputCommandInteraction) => {
    await interaction.deferReply();

    const optionUser = await (interaction.options.getUser('member') || interaction.user).fetch(true);
    const userId = optionUser.id;
    const user = await mongo.users.findOne({ _id: userId as any  });
    
    if (!user) {
        if (userId === interaction.user.id) {
            throw new GenericError(`No estás registrado. Usá \`/setup\` para registrarte.`);
        } else {
            throw new GenericError(`<@${userId}> no está registrado. Debe usar \`/setup\` para registrarse.`);
        };
    };

    const embeds: any = {
        profile: null,
        anilist: null,
        mal: null,
        vndb: null
    };

    embeds['profile'] = new UserProfileEmbed({ member: user, user: optionUser });

    const id = interaction.client.set({ member: user, user: optionUser, embeds }, 120_000);

    const buttons = new UserRowComponent({
        id: id,
        anilist: user.anilist,
        mal: user.mal,
        vndb: user.vndb,
        profile: false
    });

    await interaction.editReply({
        embeds: [embeds['profile']],
        components: buttons.isValid() ? [buttons] : []
    });
};

export default userExecute;