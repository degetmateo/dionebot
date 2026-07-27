import { ChatInputCommandInteraction, Collection } from "discord.js";
import Bot from "../extensions/bot.extension";
import GenericError from "../errors/genericError";
import cooldownMessages from "../static/cooldownMessages";

const execute = (interaction: ChatInputCommandInteraction) => {
    const bot = interaction.client as Bot;
    const command = bot.commands.get(interaction.commandName);
    if (!command) return;
    const cooldowns = bot.cooldowns;

    if (!cooldowns.has(command.data.name)) {
        cooldowns.set(command.data.name, new Collection());
    };

    const now = Date.now();
    const timestamps = cooldowns.get(command.data.name);
    const defaultCooldown = 3;
    const cooldownAmount = (command.cooldown ?? defaultCooldown) * 1000;

    if (timestamps?.has(interaction.user.id)) {
        const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

        if (now < expirationTime) {
            const expirationSeconds = ((expirationTime - now) / 1000).toFixed(0);
            throw new GenericError(cooldownMessages(interaction.locale, expirationSeconds))
        };
    };

    timestamps?.set(interaction.user.id, now);
    setTimeout(() => timestamps?.delete(interaction.user.id), cooldownAmount);
};

// const cooldowns: Set<string> = new Set<string>();
// const cooldowns: Collection<string, number> = new Collection<string, number>();

// const set = (user_id: string, time?: number) => {
//     if (!cooldowns.has(user_id)) {
//         cooldowns.set(user_id, );
//     } else {
//         throw new GenericError("¡Es demasiado pronto para que vuelvas a reclamar!")
//     };

//     const now = Date.now();
//     const defaultCooldown = 3;
//     const cooldownAmount = (time ?? defaultCooldown) * 1000;

//     if (timestamps?.has(interaction.user.id)) {
//         const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

//         if (now < expirationTime) {
//             const expirationSeconds = ((expirationTime - now) / 1000).toFixed(0);
//             throw new GenericError(cooldownMessages(interaction.locale, expirationSeconds))
//         };
//     };

//     timestamps?.set(interaction.user.id, now);
//     setTimeout(() => timestamps?.delete(interaction.user.id), cooldownAmount);
// };

const cooldownsHelper = {
    execute,
    // set
};

export default cooldownsHelper;