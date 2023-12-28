import mongoose from "mongoose";

export default class DB {
    public async connect (url: string) {
        await mongoose.connect(url)
            .then(() => console.log("✅ | Base de datos iniciada."))
            .catch(err => console.error(err));
    }
}