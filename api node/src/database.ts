import mongoose from "mongoose";

const URI = process.env.MONGODB_URI! || "mongodb://localhost/tasker";

mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true,
});

const database = mongoose.connection;

database.once("open", () => {
    console.log("database connected");
})

database.on("error", (err: unknown) => {
    console.error(err);
    process.exit(1);
})