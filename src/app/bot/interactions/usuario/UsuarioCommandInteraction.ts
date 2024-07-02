import { ChatInputCommandInteraction, CacheType, User } from "discord.js";
import CommandInteraction from "../CommandInteraction";
import NoResultsException from "../../../errors/NoResultsException";
import AnilistAPI from "../../apis/anilist/AnilistAPI";
import AnilistUser from "../../apis/anilist/modelos/AnilistUser";
import EmbedUser from "../../embeds/EmbedUser";
import Postgres from "../../../database/postgres";
import { UserSchema } from "../../../database/types";

export default class UsuarioCommandInteraction extends CommandInteraction {
    protected interaction: ChatInputCommandInteraction<CacheType>;
    
    constructor (interaction: ChatInputCommandInteraction<CacheType>) {
        super();
        this.interaction = interaction;
    }
    
    public async execute (): Promise<void> {
        const user = this.interaction.options.getUser("usuario");

        const userId = user ? user.id : this.interaction.user.id;
        const serverId = this.interaction.guild.id;

        const queryUser = await Postgres.query() `
            SELECT * FROM
                discord_user
            WHERE
                id_user = ${userId} and
                id_server = ${serverId};
        `;

        if (!queryUser[0]) throw new NoResultsException('El usuario especificado no esta registrado.');


        let anilistUser: AnilistUser;
        try {
            anilistUser = await AnilistAPI.fetchUserById(parseInt(queryUser[0].id_anilist));
        } catch (error) {
            if (error instanceof NoResultsException) {
                throw new NoResultsException('El usuario registrado ya no se encuentra en anilist.');
            } else {
                throw error;
            }
        }
        
        const embed = EmbedUser.Create(anilistUser);

        try {
            this.interaction.reply({
                embeds: [embed]
            })
        } catch (error) {
            throw error;
        }
    }
}