import  express from 'express';
const router = express.Router();
import authenticationMiddleware from "../controllers/authController"

router.post("/login", authenticationMiddleware.login)

router.post("/register", authenticationMiddleware.register)

router.post("/refresh", authenticationMiddleware.refresh)

router.post("/logout", authenticationMiddleware.logout)

export default router;
