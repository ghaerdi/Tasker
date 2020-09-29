const { model, Schema } = require("mongoose")

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

module.exports = model("Task", TaskSchema)
