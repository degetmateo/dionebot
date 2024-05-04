import { ChatInputCommandInteraction, CacheType } from "discord.js";
import CommandInteraction from "../CommandInteraction";
import NoResultsException from "../../../errors/NoResultsException";
import Bot from "../../Bot";
import AnilistAPI from "../../apis/anilist/AnilistAPI";
import AnilistUser from "../../apis/anilist/modelos/AnilistUser";
import EmbedUser from "../../embeds/EmbedUser";
import GenericException from "../../../errors/GenericException";

export default class UsuarioCommandInteraction extends CommandInteraction {
    protected interaction: ChatInputCommandInteraction<CacheType>;
    
    constructor (interaction: ChatInputCommandInteraction<CacheType>) {
        super();
        this.interaction = interaction;
    }
    
    public async execute (): Promise<void> {
        await this.interaction.deferReply({ fetchReply: true });

        const bot = this.interaction.client as Bot;

        const user = this.interaction.options.getUser("usuario");

        const userId = user ? user.id : this.interaction.user.id;
        const serverId = this.interaction.guild?.id as string;

        const registeredUsers = bot.servers.getUsers(serverId);
        const registeredUser = registeredUsers.find(u => u.discordId === userId);

        if (!registeredUser) throw new NoResultsException('El usuario especificado no esta registrado.');

        let anilistUser: AnilistUser;
        try {
            anilistUser = await AnilistAPI.fetchUserById(parseInt(registeredUser.anilistId));
        } catch (error) {
            if (error instanceof NoResultsException) {
                throw new NoResultsException('El usuario registrado ya no se encuentra en anilist.');
            } else {
                throw error;
            }
        }
        
        const embed = EmbedUser.Create(anilistUser);

        try {
            await this.interaction.editReply({
                embeds: [embed]
            })
        } catch (error) {
            throw error;
        }
    }
}