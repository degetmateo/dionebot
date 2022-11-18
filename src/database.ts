import mongoose from "mongoose";

class DB {
    public async conectar(url: any) {
        await mongoose.connect(url)
            .then(() => console.log("DB Iniciada."))
            .catch(err => console.error(err));
    }
}

export { DB };