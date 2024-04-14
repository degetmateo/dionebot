import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, PermissionFlagsBits } from "discord.js";
import CommandInterface from "../interfaces/CommandInterface";
import AdminUnsetupCommandInteraction from "./interactions/admin-unsetup/AdminUnsetupCommandInteraction";

export default class CommandAdminUnsetup implements CommandInterface {
    public readonly name: string = 'admin-unsetup';
    public readonly cooldown: number = 5;

    public readonly data = new SlashCommandBuilder()
        .setName('admin-unsetup')
        .setDescription("Elimina la cuenta de anilist de un usuario.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addUserOption(option =>
            option
                .setName('usuario')
                .setDescription('Usuario de discord.')
                .setRequired(true))
    
    public async execute (interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        const commandInteraction = new AdminUnsetupCommandInteraction(interaction);
        await commandInteraction.execute();
    }
}