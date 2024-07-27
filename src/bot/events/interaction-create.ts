import { Collection, Events, InteractionCollector } from "discord.js";
import Bot from "../Bot";
import Embed from "../embeds/Embed";
import CommandUnderMaintenanceException from "../../errors/CommandUnderMaintenanceException";
import IllegalArgumentException from "../../errors/IllegalArgumentException";
import GenericException from "../../errors/GenericException";
import NoResultsException from "../../errors/NoResultsException";
import TooManyRequestsException from "../../errors/TooManyRequestsException";
import Postgres from "../../database/postgres";

module.exports = (bot: Bot) => {
    bot.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return;

        const command = bot.commands.get(interaction.commandName);
        if (!command) throw new Error(`No se ha encontrado ningun comando con el nombre: ${interaction.commandName}`);

        if (!bot.cooldowns.has(command.data.name)) bot.cooldowns.set(command.data.name, new Collection<string, number>());

        const now = Date.now();
        const timestamps = bot.cooldowns.get(command.data.name);
        const defaultCooldownDuration = 3;
        const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;

        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

            if (now < expirationTime) {
                const expirationSeconds = ((expirationTime - now) / 1000).toFixed(0);

                const desc = parseInt(expirationSeconds) === 1 ? 
                    `Podrás volver a utilizar este comando \`en ${expirationSeconds} segundo.\`` :
                    `Podrás volver a utilizar este comando \`en ${expirationSeconds} segundos.\``;

                const embedError = Embed.Crear()
                    .establecerColor(Embed.COLOR_ROJO)
                    .establecerDescripcion(desc);

                interaction.reply({
                    embeds: [embedError.obtenerDatos()],
                    ephemeral: true
                })

                return;
            }
        }

        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

        try {
            console.log(`⚪ | ${interaction.user.username}: ${interaction.commandName}`)
            await command.execute(interaction);

            await Postgres.query().begin(async sql => {
                const queryServer = await sql `
                    SELECT * FROM
                        discord_server
                    WHERE
                        id_server = ${interaction.guild.id};
                `;

                if (!queryServer[0]) {
                    console.log('🟨 | Servidor no encontrado. Se creara su fila correspondiente.');

                    await Postgres.query() `
                        INSERT INTO
                            discord_server
                        VALUES (
                            ${interaction.guild.id},
                            0
                        );
                    `;
                }
            })
        } catch (e1) {
            const isCriticalError =
                !(e1 instanceof GenericException) &&
                !(e1 instanceof IllegalArgumentException) &&
                !(e1 instanceof NoResultsException) &&
                !(e1 instanceof CommandUnderMaintenanceException) &&
                !(e1 instanceof TooManyRequestsException);

            const embed = Embed.Crear()
                .establecerColor(Embed.COLOR_ROJO);

            if (!isCriticalError) {
                embed.establecerDescripcion(e1.message);
            } else {
                console.error('🟥 | ' + e1.stack);
                
                embed.establecerDescripcion('Ha ocurrido un error. Inténtalo de nuevo más tarde.');
                
                Postgres.query().begin(async sql => {
                    await sql `
                        SELECT insert_error (
                            'interaction',
                            ${e1.message},
                            ${e1.stack}
                        );
                    `;
                });
            }

            try {
                const stack = e1.stack.toLowerCase();

                if (stack.includes('unknown interaction') || stack.includes('unknown message') || stack.includes('invalid webhook token')) {
                    return;
                }

                if (interaction.isRepliable()) {
                    if (!interaction.deferred && !interaction.replied) {
                        await interaction.reply({ embeds: [embed.embed], ephemeral: true });
                    } else {
                        await interaction.editReply({ embeds: [embed.embed] });
                    }
                }
            } catch (e2) {
                console.error(e2);

                await Postgres.query().begin(async sql => {
                    await sql `
                        SELECT insert_error (
                            'interaction',
                            ${e2.message},
                            ${e2.stack}
                        );
                    `;
                });
            }
        }
    });
}