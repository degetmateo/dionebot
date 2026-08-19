import { ButtonInteraction, MessageFlags, User } from "discord.js";
import { Document, WithId } from "mongodb";
import GenericError from "../../../errors/genericError";
import Bot from "../../../bot/bot";
import GachaTradeAcceptCardComponent from "../../../components/gacha-trade-accept-card.component";

module.exports = {
    id: 'gacha-trade-confirm-button',
    execute: async (interaction: ButtonInteraction, data: {
        key: string;
        optionsUser: User;
        characterA: WithId<Document>;
        characterB: WithId<Document>;
    }) => {
        if (!data) {
            throw new GenericError('Esta interacción ha expirado.');
        };

        (interaction.client as Bot).delete(data.key);

        const id = (interaction.client as Bot).set({
            interactionUser: interaction.user,
            optionsUser: data.optionsUser,
            characterA: data.characterA,
            characterB: data.characterB
        }, 60_000);

        const comp = new GachaTradeAcceptCardComponent({
            id: id,
            interactionUserID: interaction.user.id,
            optionsUserID: data.optionsUser.id,
            aCharacterName: data.characterA.name,
            bCharacterName: data.characterB.name,
            aCharacterImageURL: data.characterA.images[0].url,
            bCharacterImageURL: data.characterB.images[0].url
        });

        await interaction.reply({
            flags: [MessageFlags.IsComponentsV2],
            components: [comp]
        });
    }
};