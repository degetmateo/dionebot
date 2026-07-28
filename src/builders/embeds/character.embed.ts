import { EmbedBuilder } from "discord.js";

export default class CharacterEmbed extends EmbedBuilder {
    constructor (character: {
        owner_id: string | null;
        claimed_count: number | null;
        id: number;
        name: {
            full: null | string;
            userPreferred: string;
        };
        siteUrl: string;
        age: null | string;
        bloodType: null | string;
        description: null | string;
        favourites: number;
        gender: null | string;
        image: {
            large: null | string;
            medium: null | string;
        };
        media: {
            nodes: any[];
        };
    }) {
        super();

        this.setTitle(character.name.full || character.name.userPreferred);
        this.setURL(character.siteUrl);
        this.setImage(character.image.large || character.image.medium);
        this.setColor("Random");

        let desc = '';

        const popularMedia = character.media.nodes.sort((a, b) => b.favourites - a.favourites);

        if (popularMedia) {
            desc +=
                `[${popularMedia[0].title.userPreferred}](${popularMedia[0].siteUrl})`;
        };

        if (character.owner_id) {
            desc += `\n▸ Pertenece a <@${character.owner_id}>`;
        };

        desc +=
            `\n▸ Favoritos: \`${character.favourites}\``;

        if (character.claimed_count) {
            desc += 
                `\n▸ Reclamado: \`${character.claimed_count} veces\``;
        };

        if (character.age) {
            desc +=
                `\n▸ Edad: \`${character.age || 'desconocida'}\``;
        };

        if (character.gender) {
            desc +=
                `\n▸ Género: \`${character.gender || 'desconocido'}\``;
        };

        if (character.bloodType) {
            desc +=
                `\n▸ Tipo de sangre: \`${character.bloodType || 'desconocido'}\``;
        };

        this.setDescription(desc);
    };
};