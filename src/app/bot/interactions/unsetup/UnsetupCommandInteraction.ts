import { ChatInputCommandInteraction, CacheType } from "discord.js";
import CommandInteraction from "../CommandInteraction";
import Embed from "../../embeds/Embed";
import NoResultsException from "../../../errors/NoResultsException";
import Postgres from "../../../database/postgres";

export default class UnsetupCommandInteraction extends CommandInteraction {
    protected interaction: ChatInputCommandInteraction<CacheType>;
    
    constructor (interaction: ChatInputCommandInteraction<CacheType>) {
        super();
        this.interaction = interaction;
    }

    public async execute(): Promise<void> {
        const userId = this.interaction.user.id;
        const serverId = this.interaction.guild.id;

        const queryUser = await Postgres.query() `
            SELECT * FROM
                discord_user
            WHERE
                id_user = ${userId} and
                id_server = ${serverId};
        `;

        if (!queryUser[0]) throw new NoResultsException('No estás registrado.');

        await Postgres.query().begin(async sql => {
            await sql `
                DELETE FROM
                    discord_user
                WHERE
                    id_user = ${userId} and
                    id_server = ${serverId};
            `;
        });

        const embed = Embed.Crear()
            .establecerColor(Embed.COLOR_VERDE)
            .establecerDescripcion('Listo! Se ha eliminado tu cuenta.')
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