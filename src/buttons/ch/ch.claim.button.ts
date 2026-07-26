import { ButtonInteraction } from "discord.js";

module.exports = {
    id: 'ch-claim-button',
    execute: async (interacion: ButtonInteraction) => {
        return await interacion.reply({
            content: 'jaja todavía no hace nada el botón\nhttps://tenor.com/view/anime-ops-oops-gif-26751980',
        });
    }
}