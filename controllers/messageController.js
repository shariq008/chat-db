import Message from "../models/Message.js";

class MsgController {
    async getAll(req, res){
        try{
            res.json(await Message.find({}))
        } catch(e){
            res.status(400).json({message: 'Erorr'});
        }
    }
}

export default new MsgController();