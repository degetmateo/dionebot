import mongoose from "mongoose";

class DB {
    public async conectar(url: any) {
        mongoose.set('strictQuery', true);

        await mongoose.connect(url)
            .then(() => console.log("✅ | Base de datos iniciada."))
            .catch(err => console.error(err));
    }
}

export { DB };