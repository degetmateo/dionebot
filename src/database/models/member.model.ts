import { Document, ObjectId, WithId } from "mongodb";

export const memberModel = {
    create: (user_id: string, guild_id: string): WithId<Document> => {
        return {
            _id: user_id as any,
            created_at: new Date(),
            renas: 0,
            exchanges: {
                completed_count: 0,
                active: null,
                history: []
            },
            anilist: null,
            mal: null,
            guilds: [{
                _id: guild_id,
                show_scores: true
            }],
            profile: {
                color: null,
                preferred_platform: null,
                avatar_url: null,
                banner_url: null
            },
            gacha: {
                pulls: 15,
                claims: 2,
                last_channel_id: null
            }
        };
    }
};