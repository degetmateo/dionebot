import { ChatInputCommandInteraction, CacheType } from "discord.js";
import CommandInteraction from "../CommandInteraction";
import Embed from "../../embeds/Embed";
import DB from "../../../database/DB";
import NoResultsException from "../../../errors/NoResultsException";
import Bot from "../../Bot";

export default class AdminUnsetupCommandInteraction extends CommandInteraction {
    protected interaction: ChatInputCommandInteraction<CacheType>;
    
    constructor (interaction: ChatInputCommandInteraction<CacheType>) {
        super();
        this.interaction = interaction;
    }

    public async execute(): Promise<void> {
        // await this.interaction.deferReply({ ephemeral: true });

        const bot = this.interaction.client as Bot;
        const user = this.interaction.options.getUser('usuario');
        const server = bot.servers.get(this.interaction.guildId);

        const registeredUser = server.users.find(u => u.discordId === user.id);

        if (!registeredUser) throw new NoResultsException('El usuario proporcionado no se encuentra registrado.');

        await DB.removeUser(server.id, user.id);
        await bot.loadServers();

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