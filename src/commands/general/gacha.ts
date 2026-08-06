import { InteractionContextType, SlashCommandBuilder } from "discord.js";
import GuildChatInputCommandInteraction from "../../extensions/guildChatInputCommandInteraction.extension";
import { gachaBuyPullsSubcommand } from "./gacha/gacha.buy-pulls.subcommand";
import { gachaBuyClaimsSubcommand } from "./gacha/gacha.buy-claims.subcommand";
import { gachaInventorySubcommand } from "./gacha/gacha.inventory.subcommand";

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('gacha')
        .setDescription('Comandos relacionados con el gacha.')
        .setContexts(InteractionContextType.Guild)
        .setNSFW(false)
        .addSubcommand(subcommand => 
            subcommand
                .setName('buy-pulls')
                .setDescription('1 pull = 10 renas.')
                .addNumberOption(option => 
                    option
                        .setName('pulls')
                        .setDescription('Número de PULLS que quieres comprar.')
                        .setRequired(true)
                        .setMinValue(1)
                )
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName('buy-claims')
                .setDescription('1 claim = 50 renas.')
                .addNumberOption(option => 
                    option
                        .setName('claims')
                        .setDescription('Número de CLAIMS que quieres comprar.')
                        .setRequired(true)
                        .setMinValue(1)
                )
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName('inventory')
                .setDescription('Lista de los personajes que posees tu u otro usuario.')
                .addUserOption(option => 
                    option
                        .setName('user')
                        .setDescription('Mostrar la lista de este usuario.')
                        .setRequired(false)
                )
        ),
    execute: async (interaction: GuildChatInputCommandInteraction) => { 
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'buy-pulls') {
            return await gachaBuyPullsSubcommand(interaction);
        };

        if (subcommand === 'buy-claims') {
            return await gachaBuyClaimsSubcommand(interaction);
        };

        if (subcommand === 'inventory') {
            return await gachaInventorySubcommand(interaction);
        };
    }
};