import { ButtonInteraction, MessageFlags, User } from "discord.js";
import { Document, WithId } from "mongodb";
import GenericError from "../../../errors/genericError";
import Bot from "../../../extensions/bot.extension";
import mongo from "../../../database/mongo";
import GachaTradeFinishCardComponent from "../../../components/gacha-trade-finish-card.component";

module.exports = {
    id: 'gacha-trade-accept-button',
    execute: async (interaction: ButtonInteraction, data: {
        key: string;
        interactionUser: User;
        optionsUser: User;
        characterA: WithId<Document>;
        characterB: WithId<Document>;
    }) => {
        if (!data) throw new GenericError('Esta interacción ha expirado.');
        if (interaction.user.id !== data.optionsUser.id) throw new GenericError('¡Este intercambio no es para ti!');

        (interaction.client as Bot).delete(data.key);

        const claimA = await mongo.claims.findOne({
            guild_id: interaction.guild?.id,
            user_id: data.interactionUser.id,
            character_id: data.characterA._id
        });

        const claimB = await mongo.claims.findOne({
            guild_id: interaction.guild?.id,
            user_id: data.optionsUser.id,
            character_id: data.characterB._id
        });

        if ((!claimA) || (!claimB)) throw new GenericError('Ha ocurrido un error.');

        await mongo.claims.updateOne(
            {
                _id: claimA._id
            },
            {
                $set: {
                    user_id: data.optionsUser.id
                }
            }
        );

        await mongo.claims.updateOne(
            {
                _id: claimB._id
            },
            {
                $set: {
                    user_id: data.interactionUser.id
                }
            }
        );

        const comp = new GachaTradeFinishCardComponent({
            interactionUserID: data.interactionUser.id,
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