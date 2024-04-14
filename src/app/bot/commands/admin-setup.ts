import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, PermissionFlagsBits } from "discord.js";
import CommandInterface from "../interfaces/CommandInterface";
import AdminSetupCommandInteraction from "./interactions/admin-setup/AdminSetupCommandInteraction";

export default class CommandAdminSetup implements CommandInterface {
    public readonly name: string = 'admin-setup';
    public readonly cooldown: number = 5;

    public readonly data = new SlashCommandBuilder()
        .setName('admin-setup')
        .setDescription("Registra la cuenta de anilist de un usuario.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addStringOption(option => 
            option
                .setName('plataforma')
                .setDescription('Plataformas.')
                .addChoices(
                    { name: 'Anilist', value: 'Anilist' },
                    { name: 'MyAnimeList', value: 'MyAnimeList' },
                    { name: 'VisualNovelDatabase', value: 'VisualNovelDatabase' })
                .setRequired(true))
        .addUserOption(option =>
            option
                .setName('usuario')
                .setDescription('Usuario de discord.')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('nombre-o-id')
                .setDescription('Nombre o ID del usuario en la plataforma.')
                .setRequired(true));
    
    public async execute (interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        const commandInteraction = new AdminSetupCommandInteraction(interaction);
        await commandInteraction.execute();
    }
}