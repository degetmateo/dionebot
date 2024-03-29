import { ChatInputCommandInteraction, CacheType } from "discord.js";
import CommandInteraction from "../CommandInteraction";
import ServerModel from "../../../../database/modelos/ServerModel";
import AnilistAPI from "../../../apis/anilist/AnilistAPI";
import EmbedUser from "../../../embeds/EmbedUser";
import NoResultsException from "../../../../errores/NoResultsException";

export default class UsuarioCommandInteraction extends CommandInteraction {
    protected interaction: ChatInputCommandInteraction<CacheType>;
    
    constructor (interaction: ChatInputCommandInteraction<CacheType>) {
        super();
        this.interaction = interaction;
    }
    
    public async execute (): Promise<void> {
        await this.interaction.deferReply();

        const user = this.interaction.options.getUser("usuario");

        const userId = user ? user.id : this.interaction.user.id;
        const serverId = this.interaction.guild?.id as string;

        const server = await ServerModel.findOne({ id: serverId });
        const registeredUser = server.users.find(u => u.discordId === userId);

        if (!registeredUser) throw new NoResultsException('El usuario especificado no esta registrado.');

        const anilistUser = await AnilistAPI.fetchUserById(parseInt(registeredUser.anilistId));
        const embed = EmbedUser.Create(anilistUser);

        await this.interaction.editReply({
            embeds: [embed]
        })
    }
}