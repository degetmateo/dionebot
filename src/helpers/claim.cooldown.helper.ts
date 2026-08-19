import { ButtonInteraction, Collection } from "discord.js";
import GenericError from "../errors/genericError";
import Bot from "../bot/bot";

const cooldowns: Collection<string, Collection<string, any>> = new Collection<string, Collection<string, any>>();

const execute = (interaction: ButtonInteraction) => {
    const bot = interaction.client as Bot;
    const DEFAULT_COOLDOWN = bot.settings.character_claim_cooldown;
    const FINAL_COOLDOWN = (DEFAULT_COOLDOWN) * 1000;

    if (!cooldowns.has('ch-claim-button')) {
        cooldowns.set('ch-claim-button', new Collection());
    };

    const now = Date.now();
    const timestamps = cooldowns.get('ch-claim-button');

    if (timestamps?.has(interaction.user.id)) {
        const expirationTime = timestamps.get(interaction.user.id) + FINAL_COOLDOWN;

        if (now < expirationTime) {
            const expirationSeconds = ((expirationTime - now) / 1000).toFixed(0);
            throw new GenericError(`Podrás volver a reclamar en \`${expirationSeconds} segundos\`.`);
        };
    };

    timestamps?.set(interaction.user.id, now);
    setTimeout(() => {
        timestamps?.delete(interaction.user.id);

        if (interaction.channel?.isSendable()) {
            interaction.channel.send({
                content: `<@${interaction.user.id}>: ¡Puedes volver a reclamar!`
            });
        };
    }, FINAL_COOLDOWN);
};

const claimCooldownHelper = {
    execute
};

export default claimCooldownHelper;