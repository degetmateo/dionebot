"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Embed_1 = __importDefault(require("../embeds/Embed"));
const CommandUnderMaintenanceException_1 = __importDefault(require("../../errors/CommandUnderMaintenanceException"));
const IllegalArgumentException_1 = __importDefault(require("../../errors/IllegalArgumentException"));
const GenericException_1 = __importDefault(require("../../errors/GenericException"));
const NoResultsException_1 = __importDefault(require("../../errors/NoResultsException"));
const TooManyRequestsException_1 = __importDefault(require("../../errors/TooManyRequestsException"));
const postgres_1 = __importDefault(require("../../database/postgres"));
module.exports = (bot) => {
    bot.on(discord_js_1.Events.InteractionCreate, async (interaction) => {
        var _a;
        if (!interaction.isChatInputCommand())
            return;
        const command = bot.commands.get(interaction.commandName);
        if (!command)
            throw new Error(`No se ha encontrado ningun comando con el nombre: ${interaction.commandName}`);
        if (!bot.cooldowns.has(command.data.name))
            bot.cooldowns.set(command.data.name, new discord_js_1.Collection());
        const now = Date.now();
        const timestamps = bot.cooldowns.get(command.data.name);
        const defaultCooldownDuration = 3;
        const cooldownAmount = ((_a = command.cooldown) !== null && _a !== void 0 ? _a : defaultCooldownDuration) * 1000;
        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
            if (now < expirationTime) {
                const expirationSeconds = ((expirationTime - now) / 1000).toFixed(0);
                const desc = parseInt(expirationSeconds) === 1 ?
                    `Podrás volver a utilizar este comando \`en ${expirationSeconds} segundo.\`` :
                    `Podrás volver a utilizar este comando \`en ${expirationSeconds} segundos.\``;
                const embedError = Embed_1.default.Crear()
                    .establecerColor(Embed_1.default.COLOR_ROJO)
                    .establecerDescripcion(desc);
                interaction.reply({
                    embeds: [embedError.obtenerDatos()],
                    ephemeral: true
                });
                return;
            }
        }
        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
        try {
            console.log(`⚪ | ${interaction.user.username}: ${interaction.commandName}`);
            await command.execute(interaction);
            await postgres_1.default.query().begin(async (sql) => {
                const queryServer = await sql `
                    SELECT * FROM
                        discord_server
                    WHERE
                        id_server = ${interaction.guild.id};
                `;
                if (!queryServer[0]) {
                    console.log('🟨 | Servidor no encontrado. Se creara su fila correspondiente.');
                    await postgres_1.default.query() `
                        INSERT INTO
                            discord_server
                        VALUES (
                            ${interaction.guild.id},
                            0
                        );
                    `;
                }
            });
        }
        catch (e1) {
            const isCriticalError = !(e1 instanceof GenericException_1.default) &&
                !(e1 instanceof IllegalArgumentException_1.default) &&
                !(e1 instanceof NoResultsException_1.default) &&
                !(e1 instanceof CommandUnderMaintenanceException_1.default) &&
                !(e1 instanceof TooManyRequestsException_1.default);
            const embed = Embed_1.default.Crear()
                .establecerColor(Embed_1.default.COLOR_ROJO);
            if (!isCriticalError) {
                embed.establecerDescripcion(e1.message);
            }
            else {
                console.error('🟥 | ' + e1.stack);
                embed.establecerDescripcion('Ha ocurrido un error. Inténtalo de nuevo más tarde.');
                postgres_1.default.query().begin(async (sql) => {
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
                    }
                    else {
                        await interaction.editReply({ embeds: [embed.embed] });
                    }
                }
            }
            catch (e2) {
                console.error(e2);
                await postgres_1.default.query().begin(async (sql) => {
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
};
