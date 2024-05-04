import { ChatInputCommandInteraction, CacheType } from "discord.js";
import CommandInteraction from "../CommandInteraction";
import Embed from "../../embeds/Embed";
import DB from "../../../database/DB";
import NoResultsException from "../../../errors/NoResultsException";
import Bot from "../../Bot";

export default class UnsetupCommandInteraction extends CommandInteraction {
    protected interaction: ChatInputCommandInteraction<CacheType>;
    
    constructor (interaction: ChatInputCommandInteraction<CacheType>) {
        super();
        this.interaction = interaction;
    }

    public async execute(): Promise<void> {
        await this.interaction.deferReply({ ephemeral: true });

        const bot = this.interaction.client as Bot;

        const server = bot.servers.get(this.interaction.guildId);
        const user = server.users.find(u => u.discordId === this.interaction.user.id);

        if (!user) throw new NoResultsException('No estás registrado.');

        if (await DB.userExists(server.id, user.discordId)) {
            await DB.removeUser(server.id, user.discordId);        
        } else {
            throw new NoResultsException('No estás registrado.');
        }

        await bot.loadServers();

        const embed = Embed.Crear()
            .establecerColor(Embed.COLOR_VERDE)
            .establecerDescripcion('Listo! Se ha eliminado tu cuenta.')
            .obtenerDatos();

        try {
            await this.interaction.editReply({
                embeds: [embed]
            })
        } catch (error) {
            throw error;
        }
    }
}