"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Embed_1 = __importDefault(require("../embeds/Embed"));
const ErrorGenerico_1 = __importDefault(require("../../errores/ErrorGenerico"));
const ErrorSinResultados_1 = __importDefault(require("../../errores/ErrorSinResultados"));
const CommandUnderMaintenanceException_1 = __importDefault(require("../../errores/CommandUnderMaintenanceException"));
const ErrorArgumentoInvalido_1 = __importDefault(require("../../errores/ErrorArgumentoInvalido"));
const ErrorDemasiadasPeticiones_1 = __importDefault(require("../../errores/ErrorDemasiadasPeticiones"));
const IllegalArgumentException_1 = __importDefault(require("../../errores/IllegalArgumentException"));
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
            await command.execute(interaction);
        }
        catch (error) {
            const esErrorCritico = !(error instanceof ErrorGenerico_1.default) &&
                !(error instanceof ErrorSinResultados_1.default) &&
                !(error instanceof ErrorArgumentoInvalido_1.default) &&
                !(error instanceof ErrorDemasiadasPeticiones_1.default) &&
                !(error instanceof IllegalArgumentException_1.default) &&
                !(error instanceof CommandUnderMaintenanceException_1.default);
            const embed = Embed_1.default.Crear()
                .establecerColor(Embed_1.default.COLOR_ROJO);
            (!esErrorCritico) ?
                embed.establecerDescripcion(error.message) :
                embed.establecerDescripcion('Ha ocurrido un error. Inténtalo de nuevo más tarde.') && console.error('🟥 | ' + error.stack);
            try {
                (!interaction.deferred && !interaction.replied) ?
                    interaction.reply({ embeds: [embed.obtenerDatos()] }) :
                    interaction.editReply({ embeds: [embed.obtenerDatos()] });
            }
            catch (error) {
                console.error(error);
            }
        }
    });
};
