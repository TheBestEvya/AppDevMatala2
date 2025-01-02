import userModel,{IUser} from "../models/userModel"
import {Request, Response} from "express"
import BaseController from "./baseController"

class userController extends BaseController<IUser>{
    constructor(){
        super(userModel);
    }

    // Specific methods for this controller
    async update(req : Request , res :Response){
        try { 
            const { id } = req.body.id;
            const item = await this.model.findByIdAndUpdate(id, req.body);
            res.status(200).json({ message: "Item updated" });
        } catch (error) {
          res.status(400).json({ message: "Error fetching  ", error: error.message });
        }
      };
};



export default new userController();
