import mongoose from "mongoose";

const Message = new mongoose.Schema({
    userId: {type: String},
    username: {type: String, required: true},
    message: {type: String, required: true}, 
})

export default mongoose.model('Message', Message)