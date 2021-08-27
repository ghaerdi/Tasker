import { model, Schema } from "mongoose";

const TaskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    }
}, { timestamps: true, versionKey: false})

export default model("Task", TaskSchema)
