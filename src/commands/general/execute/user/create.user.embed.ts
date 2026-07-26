import { EmbedBuilder, User } from "discord.js";
import UserEmbed from "../../../../builders/embeds/user.embed";
import { Document, WithId } from "mongodb";
import anilist from "../../../../apis/anilist/anilist";
import Aniuser from "../../../../apis/anilist/models/aniuser";
import mal from "../../../../apis/mal/mal";
import vndb from "../../../../apis/vndb/vndb";

const createUserEmbed = async (
    platform: null | 'ANILIST' | 'MAL' | 'VNDB', 
    member: WithId<Document>, 
    user: User
): Promise<UserEmbed> => {
    let embed: EmbedBuilder = new EmbedBuilder();

    if (platform) {
        if (platform === 'ANILIST') {
            if (member.anilist) {
                const data = await anilist.search.user(member.anilist.id);
                const aniuser = new Aniuser(data);
                
                embed = new UserEmbed({
                    discord_user: user,
                    member: member,
                    platform: 'ANILIST',
                    info: aniuser
                });
            } else {
                embed = new UserEmbed({
                    discord_user: user,
                    member: member,
                    platform: 'ANILIST',
                    info: null
                });
            };
        };

        if (platform === 'MAL') {
            if (member.mal) {
                const maluser: any = await mal.user.get({ id: member.mal.id, token: member.mal.auth.access_token });
                
                embed = new UserEmbed({
                    discord_user: user,
                    member: member,
                    platform: 'MAL',
                    info: maluser
                });
            } else {
                embed = new UserEmbed({
                    discord_user: user,
                    member: member,
                    platform: 'MAL',
                    info: null
                });
            };
        };

        if (platform === 'VNDB') {
            if (member.vndb) {
                const vnuserRequest: {
                    more: boolean;
                    results: Array<{
                        id: string;
                        vn: any;
                        vote: number | null;
                    }>;
                } = await vndb.user({
                    id: member.vndb.id,
                    token: member.vndb.auth.token
                }) as any;

                embed = new UserEmbed({
                    discord_user: user,
                    member: member,
                    platform: 'VNDB',
                    info: vnuserRequest
                });
            } else {
                embed = new UserEmbed({
                    discord_user: user,
                    member: member,
                    platform: 'VNDB',
                    info: null
                });
            };
        };
    } else {
        embed = new UserEmbed({
            discord_user: user,
            member: member,
            platform: null,
            info: null
        });
    };

    return embed as UserEmbed;
};

export default createUserEmbed;