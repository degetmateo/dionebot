import { ChatInputCommandInteraction, CacheType } from "discord.js";
import CommandInteraction from "../CommandInteraction";
import Bot from "../../../Bot";
import NoResultsException from "../../../../errores/NoResultsException";
import ServerModel from "../../../../database/modelos/ServerModel";
import Embed from "../../../embeds/Embed";

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

        if (!user) throw new NoResultsException('No estas registrado.');

        await ServerModel.updateOne(
            { id: this.interaction.guildId },
            { $pull: { users: { discordId: this.interaction.user.id } } });
        
        await bot.loadServers();

        const embed = Embed.Crear()
            .establecerColor(Embed.COLOR_VERDE)
            .establecerDescripcion('Listo! Se ha eliminado tu cuenta.')
            .obtenerDatos();

        this.interaction.editReply({
            embeds: [embed]
        })
    }
}