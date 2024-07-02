import { ChatInputCommandInteraction, CacheType } from "discord.js";
import CommandInteraction from "../CommandInteraction";
import Embed from "../../embeds/Embed";
import NoResultsException from "../../../errors/NoResultsException";
import Postgres from "../../../database/postgres";

export default class AdminUnsetupCommandInteraction extends CommandInteraction {
    protected interaction: ChatInputCommandInteraction<CacheType>;
    
    constructor (interaction: ChatInputCommandInteraction<CacheType>) {
        super();
        this.interaction = interaction;
    }

    public async execute(): Promise<void> {
        const user = this.interaction.options.getUser('usuario');

        const userId = user.id;
        const serverId = this.interaction.guild.id;

        const queryUser = await Postgres.query() `
            SELECT * FROM
                discord_user
            WHERE
                id_user = ${userId} and
                id_server = ${serverId};
        `;

        if (!queryUser[0]) throw new NoResultsException('El usuario proporcionado no se encuentra registrado.');

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
            .establecerDescripcion('Se ha eliminado la cuenta del usuario.')
            .obtenerDatos();

        await this.interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
    }
}