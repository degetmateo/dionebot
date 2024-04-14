import mongoose from "mongoose";
import ServerModel from "./modelos/ServerModel";
import IllegalArgumentException from "../errors/IllegalArgumentException";

export default class DB {
    public async connect (url: string) {
        await mongoose.connect(url)
            .then(() => console.log("✅ | Base de datos iniciada."))
            .catch(err => console.error(err));
    }

    public static async createServer (id: string) {
        const server = await ServerModel.findOne({ id });
        if (server) throw new IllegalArgumentException('Server already exists.');

        await new ServerModel({
            id,
            users: [],
            premium: false
        }).save();
    }

    public static async removeServer (id: string) {
        await ServerModel.findOneAndDelete({ id });
    }

    public static async createUser (serverId: string, discordId: string, anilistId: string) {
        let server = await ServerModel.findOne({ id: serverId });
        
        if (!server) {
            server = new ServerModel({
                id: serverId,
                users: [],
                premium: false
            })
        }

        server.users.push({ discordId, anilistId });
        await server.save();
    }

    public static async removeUser (serverId: string, discordId: string) {
        const server = await ServerModel.findOne({ id: serverId });
        if (!server) throw new IllegalArgumentException('Server does not exist.');

        await ServerModel.updateOne(
            { id: serverId },
            { $pull: { users: { discordId } } });
    }
}