import { EmbedBuilder } from "discord.js";

export default class CharacterEmbed extends EmbedBuilder {
    constructor (character: {
        name: string;
        site_url: string;
        image_url: string;
        favourites_count: number;
        claimed_count: number;
    }) {
        super();

        this.setTitle(character.name);
        this.setURL(character.site_url);
        this.setImage(character.image_url);
        this.setColor("Random");
        this.setFooter({
            text: `▸ ${character.favourites_count} favs\n▸ Se ha reclamado ${character.claimed_count} veces`
        });
    };
};