import { EmbedBuilder } from "discord.js";

export default class AffinityEmbed extends EmbedBuilder {
    constructor (data: {
        affinity: number;
        userAId: string;
        userBId: string;
    }) {
        super();
        this.setColor("Green");
        this.setDescription(`<@${data.userAId}> y <@${data.userBId}> tienen una afinidad del **${data.affinity.toFixed(2)}%**`);
    };
};