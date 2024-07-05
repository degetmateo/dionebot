import { ChatInputCommandInteraction, CacheType } from "discord.js";
import CommandInteraction from "../CommandInteraction";
import GenericException from "../../../errors/GenericException";
import NoResultsException from "../../../errors/NoResultsException";
import Helpers from "../../Helpers";
import AnilistAPI from "../../apis/anilist/AnilistAPI";
import AnilistUser from "../../apis/anilist/modelos/AnilistUser";
import Embed from "../../embeds/Embed";
import Postgres from "../../../database/postgres";

export default class SetupCommandInteraction extends CommandInteraction {
    private static readonly MAX_USERS = 15;
    protected interaction: ChatInputCommandInteraction<CacheType>;
    
    constructor (interaction: ChatInputCommandInteraction<CacheType>) {
        super();
        this.interaction = interaction;
    }

    public async execute(): Promise<void> {
        const query = this.interaction.options.getString('nombre-o-id');

        const serverId = this.interaction.guild.id;
        const userId = this.interaction.user.id;

        let queryUserCount: Array<{ user_count: number }> = await Postgres.query() `
            SELECT user_count FROM 
                discord_server
            WHERE
                id_server = ${serverId};
        `;

        const userCount = queryUserCount[0].user_count;
        
        if (userCount >= SetupCommandInteraction.MAX_USERS) {
            throw new GenericException('Se ha alcanzado la cantidad máxima de usuarios registrados en este servidor.');
        }

        let querMembership: any = await Postgres.query() `
            SELECT * FROM
                membership
            WHERE
                id_user = ${userId} and
                id_server = ${serverId};
        `;

        if (querMembership[0]) {
            throw new GenericException('Ya te encuentras registrado.');
        }

        let anilistUser: AnilistUser;
        try {
            anilistUser = Helpers.isNumber(query) ?
                await AnilistAPI.fetchUserById(parseInt(query)) : await AnilistAPI.fetchUserByName(query);
        } catch (error) {
            if (error instanceof NoResultsException) {
                throw new NoResultsException('No se ha encontrado el usuario proporcionado en anilist.');
            }
        }

        await Postgres.query().begin(async sql => {
            await sql `
                INSERT INTO 
                    discord_user 
                VALUES (
                    ${userId},
                    ${anilistUser.getId()}
                );
            `;

            await sql `
                INSERT INTO
                    membership
                VALUES (
                    ${userId},
                    ${serverId}
                );
            `;
        });

        const embed = Embed.Crear()
            .establecerColor(Embed.COLOR_VERDE)
            .establecerDescripcion('Te has registrado con éxito.')
            .obtenerDatos();

        try {
            await this.interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
        } catch (error) {
            throw error;
        }
    }
}