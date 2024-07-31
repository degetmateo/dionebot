import { ChatInputCommandInteraction, CacheType } from "discord.js";
import CommandInteraction from "../CommandInteraction";
import Postgres from "../../../database/postgres";
import NoResultsException from "../../../errors/NoResultsException";
import AnilistAPI from "../../apis/anilist/AnilistAPI";
import UserCommandQueries from "./UserCommandQueries";
import AnilistUser from "../../apis/anilist/modelos/AnilistUser";
import EmbedUser from "../../embeds/EmbedUser";

export default class UserCommandInteraction extends CommandInteraction {
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
                discord_user u, membership m
            WHERE
                u.id_user = m.id_user and
                u.id_user = ${userId} and
                m.id_server = ${serverId};
        `;

        if (!queryUser[0]) throw new NoResultsException('El usuario especificado no esta registrado.');
        
        try {
            const queryAniuser = await AnilistAPI.fetch(UserCommandQueries.UserQuery(queryUser[0].id_anilist));
            const aniuser = new AnilistUser(queryAniuser.data.User);
            const embed = EmbedUser.Create(aniuser);

            this.interaction.reply({
                embeds: [embed]
            })
        } catch (error) {
            if (error.message.toLowerCase().includes('not found')) {
                throw new NoResultsException('No se han encontrado resultados del usuario.');
            }

            throw error;
        }
    }
}