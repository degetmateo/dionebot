import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import CommandInterface from "../interfaces/CommandInterface";
import CommandUnderMaintenanceException from "../../errores/CommandUnderMaintenanceException";

export default class ComandoAfinidad implements CommandInterface {
    public readonly cooldown: number = 10;

    public readonly data = new SlashCommandBuilder()
        .setName("afinidad")
        .setDescription("Calcula la afinidad entre vos (u otro usuario) y los demás miembros registrados del servidor.")
        .addUserOption(option => 
            option
                .setName("usuario")
                .setDescription("Usuario del que quieres calcular la afinidad."));

    public async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        throw new CommandUnderMaintenanceException('Comando en mantenimiento.');
    }
}