import  express from 'express';
const router = express.Router();
import userController from "../controllers/userController"

router.get("/", userController.getAll.bind(userController))

router.get("/id",userController.getById.bind(userController))

router.delete("/delete", userController.delete.bind(userController))

router.post("/create" , userController.create.bind(userController))


export default router;