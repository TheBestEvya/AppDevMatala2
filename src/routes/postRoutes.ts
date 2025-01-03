import express from "express";
import postsController from "../controllers/postController";
const router = express.Router();



router.get("/", postsController.getUserPosts.bind(postsController));

router.get("/search", postsController.search.bind(postsController));

router.post("/", postsController.create.bind(postsController));

router.delete("/:id", postsController.delete.bind(postsController));

export default router;