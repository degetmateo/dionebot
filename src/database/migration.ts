import { ObjectId } from "mongodb";
import * as uuid from 'uuid';
import mongo from "./mongo";

export default {
    execute: async () => {
        try {
            // const cursor = mongo.users.find(
            //     { 
            //         "guilds.id": { 
            //             $exists: true 
            //         }
            //     }
            // );

            // await mongo.users.updateMany(
            //     {
            //         "gacha.pulls": {
            //             $lt: 20
            //         }
            //     },
            //     {
            //         $set: {
            //             "gacha.pulls": 20
            //         }
            //     }
            // )

            // await mongo.users.updateMany(
            //     {
            //         "gacha.claims": {
            //             $lt: 3
            //         }
            //     },
            //     {
            //         $set: {
            //             "gacha.claims": 3
            //         }
            //     }
            // )

            // for await (const doc of cursor) {
            //     const updatedArray = doc.guilds.map((guild: any) => {
            //         guild._id = guild.id;
            //         delete guild.id;
            //         if (guild.claimed_characters) delete guild.claimed_characters;
            //         return guild;
            //     });

            //     await mongo.users.updateOne(
            //         {
            //             _id: doc._id
            //         },
            //         {
            //             $set: {
            //                 guilds: updatedArray
            //             }
            //         }
            //     );
            // };

            // console.log('Executing migration...');
            // const members = mongo.collection('members');

            // await members.updateMany(
            //     {
            //         gacha: { $exists: false }
            //     },
            //     {
            //         $set: {
            //             gacha: {
            //                 pulls: 20,
            //                 claims: 2
            //             }
            //         }
            //     }
            // );


            // const oldMembersCollection = mongo.collection('members');
            // const oldMembers = await oldMembersCollection.find().toArray();

            // await mongo.users.insertMany(oldMembers.map(m => {
            //     const data: any = m;
            //     delete data._id;
            //     data._id = m.discord_id;
            //     delete data.discord_id;
                
            //     return data;
            // }));

            // const oldGuildsCollection = mongo.collection('g');
            // const oldGuilds = await oldGuildsCollection.find().toArray();

            // await mongo.guilds.insertMany(oldGuilds.map(g => {
            //     const data:any = g;
            //     delete data._id;
            //     data._id = g.discord_id;
            //     delete data.discord_id;
            //     return data;
            // }));

        } catch (error) {
            console.error(error);  
        };
        console.log('Migration finished.');
    }
};