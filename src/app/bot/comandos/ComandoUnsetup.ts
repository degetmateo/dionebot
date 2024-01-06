import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import CommandInterface from "../interfaces/CommandInterface";
import CommandUnderMaintenanceException from "../../errores/CommandUnderMaintenanceException";

export default class ComandoUnsetup implements CommandInterface {
    public readonly cooldown: number = 0;

    public readonly data = new SlashCommandBuilder()
        .setName("unsetup")
        .setDescription("Te elimina de los usuarios registrados.");
    
    public async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        throw new CommandUnderMaintenanceException('Comando en mantenimiento.');
    }
}