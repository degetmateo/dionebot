import { InteractionContextType, SlashCommandBuilder } from "discord.js";
import GuildChatInputCommandInteraction from "../../extensions/guildChatInputCommandInteraction.extension";
import membersRepository from "../../repositories/members/members.repository";
import GenericError from "../../errors/genericError";
import SuccessEmbed from "../../embeds/successEmbed";

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
        // .addSubcommand(subcommand => 
        //     subcommand
        //         .setName('trade')
        //         .setDescription('¡Intercambiar personajes con otro usuario!')
        //         .addUserOption(option => 
        //             option
        //                 .setName('user')
        //                 .setDescription('Usuario con el que quieres intercambiar un personaje.')
        //                 .setRequired(true)
        //         )
        // )
        ,
    execute: async (interaction: GuildChatInputCommandInteraction) => { 
        const member: any = await membersRepository.findsert(interaction.user.id, interaction.guild.id);
        
        if (interaction.options.getSubcommand() === 'buy-pulls') {
            const pulls = interaction.options.getNumber('pulls', true);
            const price = pulls * 10;
            if (member.renas < price) throw new GenericError(`No tienes suficientes \`renas\` para comprar \`${pulls} pulls\` (necesitas \`$${price}\`).`);
            await membersRepository.buyPulls(member._id, pulls, price);
            interaction.reply({
                flags: "Ephemeral",
                embeds: [new SuccessEmbed(`Has comprado \`${pulls} pulls\`.`)]
            });
        } else if (interaction.options.getSubcommand() === 'buy-claims') {
            const claims = interaction.options.getNumber('claims', true);
            const price = claims * 100;
            if (member.renas < price) throw new GenericError(`No tienes suficientes \`renas\` para comprar \`${claims} claims\` (necesitas \`$${price})\`.`);
            await membersRepository.buyClaims(member._id, claims, price);
            interaction.reply({
                flags: "Ephemeral",
                embeds: [new SuccessEmbed(`Has comprado \`${claims} claims\`.`)]
            });
        };
    }
};