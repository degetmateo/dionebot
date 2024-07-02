import { ChatInputCommandInteraction, CacheType } from "discord.js";
import CommandInteraction from "../CommandInteraction";
import GenericException from "../../../errors/GenericException";
import NoResultsException from "../../../errors/NoResultsException";
import Helpers from "../../Helpers";
import AnilistAPI from "../../apis/anilist/AnilistAPI";
import AnilistUser from "../../apis/anilist/modelos/AnilistUser";
import Embed from "../../embeds/Embed";
import Postgres from "../../../database/postgres";

export default class AdminSetupCommandInteraction extends CommandInteraction {
    protected interaction: ChatInputCommandInteraction<CacheType>;
    
    constructor (interaction: ChatInputCommandInteraction<CacheType>) {
        super();
        this.interaction = interaction;
    }

    public async execute (): Promise<void> {
        const user = this.interaction.options.getUser('usuario');
        const query = this.interaction.options.getString('nombre-o-id');

        const userId = user.id;
        const serverId = this.interaction.guildId;

        const queryUser = await Postgres.query() `
            SELECT * FROM
                discord_user
            WHERE
                id_user = ${userId} and
                id_server = ${serverId};
        `;
        
        if (queryUser[0]) {
            throw new GenericException('El usuario ingresado ya se encuentra registrado.');
        }

        let anilistUser: AnilistUser;

        try {
            anilistUser = Helpers.isNumber(query) ?
                await AnilistAPI.fetchUserById(parseInt(query)) : await AnilistAPI.fetchUserByName(query);            
        } catch (error) {
            if (error instanceof NoResultsException) {
                throw new NoResultsException('No se ha encontrado al usuario ingresado en anilist.')
            }
        }

        await Postgres.query().begin(async sql => {
            await sql `
                INSERT INTO 
                    discord_user 
                VALUES (
                    ${userId},
                    ${serverId},
                    ${anilistUser.getId()}
                );
            `;

            await sql `
                UPDATE 
                    discord_server
                SET
                    user_count = user_count + 1
                WHERE
                    id_server = ${serverId};
            `;
        });    

        const embed = Embed.Crear()
            .establecerColor(Embed.COLOR_VERDE)
            .establecerDescripcion('Se ha registrado al usuario con éxito.')
            .obtenerDatos();

        await this.interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
    }
}