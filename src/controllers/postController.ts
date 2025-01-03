import { Request, Response } from "express";
import BaseController from "./baseController";
import PostModel, { IPost } from "../models/postModel";
import { FilterQuery } from "mongoose";

class PostsController extends BaseController<IPost> {
    constructor() {
        super(PostModel);
    }

    async create(req: Request, res: Response) {
        try {
            const userId = req.params.userId;
            const post: IPost = {
                ...req.body,
                owner: userId,
                createdAt: new Date()
            };

            const savedPost = await PostModel.create(post);
            res.status(201).json(savedPost);
        } catch (error) {
            res.status(500).json({ error: "Failed to create post" });
        }
    }

    async getUserPosts(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const { page = 1, limit = 10 } = req.query;
            
            const posts = await PostModel.find({ owner: userId })
                

            res.status(200).json(posts);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch user posts" });
        }
    }

    async search(req: Request, res: Response) {
        try {
            const { query } = req.query;
            const filter: FilterQuery<IPost> = {};
            
            if (query) {
                filter.title = new RegExp(query as string, 'i');
            }

            const posts = await PostModel.find(filter)
                .populate('owner', 'username')
                .sort({ createdAt: -1 });

            res.json(posts);
        } catch (error) {
            res.status(500).json({ error: "Search failed" });
        }
    }
}

export default new PostsController();