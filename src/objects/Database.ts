import mongoose from "mongoose";
import { AniUser } from "../models/AniUser";

class DB {
    public conectar(url: any) {
        mongoose.connect(url)
            .then(() => console.log("DB Iniciada."))
            .catch(err => console.error(err));
    }
}

export { DB };