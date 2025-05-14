import mongoose from 'mongoose'
const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    reciever: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    messageType: {
        type: String,
        enum: ["text", "file", "audio"],
        required: true
    },
    content: {
        type: String,
        required: function () {
            return this.messageType === "text"
        }
    },
    fileUrl: {
        type: String,
        required: function () {
            return this.messageType === "file" || this.messageType === "audio"
        }
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: "sent"
    }
})

const Message = mongoose.model("Message", messageSchema);

export default Message;