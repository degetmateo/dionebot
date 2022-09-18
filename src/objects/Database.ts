import mongoose from "mongoose";
import { AniUser } from "../models/AniUser";

class DB {
    public async conectar(url: any) {
        mongoose.connect(url)
            .then(() => console.log("DB Iniciada."))
            .catch(err => console.error(err));
    }

    public static async buscar(serverID: any) {
        return await AniUser.find({ serverId: serverID });
    }
}

export { DB };