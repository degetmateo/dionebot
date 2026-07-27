import { EmbedBuilder } from "discord.js";

export default class CharacterEmbed extends EmbedBuilder {
    constructor (character: {
        name: string;
        site_url: string;
        image_url: string;
        claimed_count: number;
    }) {
        super();

        this.setTitle(character.name);
        this.setURL(character.site_url);
        this.setImage(character.image_url);
        this.setColor("Random");
        this.setFooter({
            text: `▸ Se ha reclamado ${character.claimed_count} veces.`
        });
    };
};