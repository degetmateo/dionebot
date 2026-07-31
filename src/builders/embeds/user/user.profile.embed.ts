import { ColorResolvable, EmbedBuilder, User } from "discord.js";

export default class UserProfileEmbed extends EmbedBuilder {
    constructor (data: {
        member: any;
        user: User;
    }) {
        super();

        this.setTitle(data.user.globalName);

        const avatar = (data.member.profile ? 
            data.member.profile.avatar_url || data.user.avatarURL(): 
            data.user.avatarURL()
        );
        
        const banner = (data.member.profile ? 
            data.member.profile.banner_url || data.user.bannerURL({ size: 1024 }): 
            data.user.bannerURL({ size: 1024 })
        );

        const color = ((data.member.profile ? 
            data.member.profile.color || data.user.hexAccentColor: 
            data.user.hexAccentColor
        ) || "Random") as ColorResolvable;
    
        this.setThumbnail(avatar);
        this.setImage(banner);
        this.setColor(color);

        const description = (
            `▸ Se unió el \`${new Date(data.member.created_at).toDateString()}\`\n` +
            `▸ Renas \`$${data.member.renas || 0}\`\n` +
            `▸ Personajes reclamados: \`${data.member.claimed_characters_count || 0}\`\n`+
            `▸ Pulls restantes: \`${data.member.gacha.pulls || 0}\`\n` +
            `▸ Claims restantes: \`${data.member.gacha.claims || 0}\`\n\n`
        );

        this.setDescription(description);
    };
};