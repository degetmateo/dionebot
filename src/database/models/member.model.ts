import { UUID } from 'mongodb';
import * as uuid from 'uuid';

export const memberModel = {
    create: (user_id: string, guild_id: string) => {
        return {
            _id: new UUID(uuid.v7()) as any,
            discord_id: user_id,
            created_at: new Date(),
            renas: 0,
            exchanges: {
                completed_count: 0,
                active: null,
                history: []
            },
            preferred_platform: null,
            anilist: null,
            mal: null,
            guilds: [{
                id: guild_id,
                show_scores: true,
                claimed_characters: []
            }],
            profile: {
                color: null,
                preferred_platform: null,
                avatar_url: null,
                banner_url: null
            }
        };
    }
};