import { InteractionContextType, SlashCommandBuilder } from "discord.js";
import { gachaBuyPullsSubcommand } from "./gacha/gacha.buy-pulls.subcommand";
import { gachaBuyClaimsSubcommand } from "./gacha/gacha.buy-claims.subcommand";
import { gachaInventorySubcommand } from "./gacha/gacha.inventory.subcommand";
import { gachaTradeSubcommand } from "./gacha/gacha.trade.subcommand";
import { gachaAuctionSubcommand } from "./gacha/gacha.auction.subcommand";
import GuildChatInputCommandInteraction from "../../../extensions/guildChatInputCommandInteraction.extension";
import { gachaSellSubcommand } from "./gacha/gacha.sell.subcommand";

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
                .setDescription('1 claim = 100 renas.')
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
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName('trade')
                .setDescription('Intercambia un personaje con otro usuario.')
                .addUserOption(option =>
                    option
                        .setName('user')
                        .setDescription('¿Con quién vas a intercambiar?')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName('ca_name-or-id')
                        .setDescription('¿Qué personaje darás?')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName('cb_name-or-id')
                        .setDescription('¿Qué personaje quieres?')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('sell')
                .setDescription('Vender un personaje.')
                .addStringOption(option =>
                    option
                        .setName('name-or-id')
                        .setDescription('¿Qué personaje quieres vender?')
                        .setRequired(true)
                )
                .addUserOption(option =>
                    option
                        .setName('user')
                        .setDescription('¿A quién le vas a vender el personaje?')
                        .setRequired(true)
                )
                .addNumberOption(option =>
                    option
                        .setName('price')
                        .setDescription('¿Qué precio le pondrás al personaje?')
                        .setRequired(true)
                        .setMinValue(0)
                )
        ),
        // .addSubcommand(subcommand =>
        //     subcommand
        //         .setName('auction')
        //         .setDescription('Subastar un personaje al mejor postor.')
        //         .addStringOption(option =>
        //             option
        //                 .setName('name-or-id')
        //                 .setDescription('¿Qué personaje quieres subastar?')
        //                 .setRequired(true)
        //         )
        //         .addNumberOption(option =>
        //             option
        //                 .setName('base-price')
        //                 .setDescription('Precio base que propones para comenzar a pujar.')
        //                 .setMinValue(0)
        //                 .setRequired(true)
        //         )
        // ),
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

        if (subcommand === 'trade') {
            return await gachaTradeSubcommand(interaction);
        };

        if (subcommand === 'auction') {
            return await gachaAuctionSubcommand(interaction);
        };

        if (subcommand === 'sell') {
            return await gachaSellSubcommand(interaction);
        };
    }
};