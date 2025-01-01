
import {Request, Response} from "express"
import { Model } from "mongoose";

class BaseController<T>{
    model :Model<T>;
    constructor(model:Model<T>){
        this.model = model;
    }

async getAll(req : Request , res :Response){
  try {
    const items = await this.model.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(400).json({ message: "Error fetching  ", error: error.message });
  }
};

 async getById(req : Request , res :Response){
  try {
    const { id } = req.params;
    const item = await this.model.findById(id);
    if (!item) {
      res.status(400).json({message : "Comment not found!"});
      return;
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(400).json({ message: "Error fetching comment", error: error.message });
  }
};

 async create(req : Request , res :Response){
  try {
    const newItem = new this.model(req.body)
        const savedItem = await newItem.save()
        res.status(201).json({ message: "created successfully", user: savedItem });
      } catch (error) {
        res.status(500).json({ message: "Error creating user", error: error.message });
      }
};

 async delete(req : Request , res :Response) {
    try {
        const { id } = req.body; 
        await this.model.findByIdAndDelete(id);
        res.status(200).json({ message: "deleted successfully" });
      } catch (error) {
        res.status(500).json({ message: "Error deleting ", error: error.message });
      }
};
}

export default BaseController;