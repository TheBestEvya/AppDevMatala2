import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import userModel,{IUser} from "../models/userModel"
import { Document } from 'mongoose';


type tUser = Document<unknown, {}, IUser> & IUser 
type tTokens = {
    accessToken: string,
    refreshToken: string
}
const generateToken = (userId: string): tTokens | null => {
    if (!process.env.ACCESS_TOKEN_SECRET) {
        return null;
    }
    const random = Math.random().toString();
    const accessToken = jwt.sign({
        id: userId,
        random: random
    },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });

    const refreshToken = jwt.sign({
        id: userId,
        random: random
    },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });
    return {
        accessToken: accessToken,
        refreshToken: refreshToken
    };
};
const verifyRefreshToken = (refreshToken: string | undefined) => {
    return new Promise<tUser>((resolve, reject) => {
        //get refresh token from body
        if (!refreshToken) {
            reject("fail");
            return;
        }
        //verify token
        if (!process.env.TOKEN_SECRET) {
            reject("fail");
            return;
        }
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err: any, payload: any) => {
            if (err) {
                reject("fail");
                return
            }
            //get the user id fromn token
            const userId = payload.id;
            try {
                //get the user form the db
                const user = await userModel.findById(userId);
                if (!user) {
                    reject("fail");
                    return;
                }
                if (!user.refreshToken || !user.refreshToken.includes(refreshToken)) {
                    user.refreshToken = [];
                    await user.save();
                    reject("fail");
                    return;
                }
                const tokens = user.refreshToken!.filter((token) => token !== refreshToken);
                user.refreshToken = tokens;

                resolve(user);
            } catch (err) {
                reject("fail");
                return;
            }
        });
    });
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.header('authorization');
    const token = authorization && authorization.split(' ')[1];

    if (!token) {
        res.status(401).send('Access Denied');
        return;
    }
    if (!process.env.ACCESS_TOKEN_SECRET) {
        res.status(500).send('Server Error');
        return;
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
            res.status(401).send('Access Denied');
            return;
        }
        req.params.userId = payload.id;
        next();
    });
};
const refresh = async (req: Request, res: Response) => {
    try {
        const user = await verifyRefreshToken(req.body.refreshToken);
        if (!user) {
            res.status(400).send("fail");
            return;
        }
        const tokens = generateToken(user.id);

        if (!tokens) {
            res.status(500).send('Server Error');
            return;
        }
        if (!user.refreshToken) {
            user.refreshToken = [];
        }
        user.refreshToken.push(tokens.refreshToken);
        await user.save();
        res.status(200).send(
            {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                id: user.id
            });
    } catch (err) {
        res.status(400).send("fail");
    }
};

const register = async (req: Request, res: Response, next : NextFunction) => {
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);        
        const user = new userModel({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });

        await user.save();
        if(user){
            res.status(201).json({message: "User created"})
        }else{
            res.status(400).json({message: "Error creating user"})
        }
    }catch(err){
        res.status(401).json({message: "Error creating user", error: err.message})
    }
}

const login = async (req: Request, res: Response, next : NextFunction) => {
    try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
        res.status(400).send('wrong username or password');
        return;
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            res.status(400).send('wrong username or password');
            return;
        }
        if (!process.env.ACCESS_TOKEN_SECRET) {
            res.status(500).send('Server Error');
            return;
        }
        const tokens = generateToken(user.id);
        if (!tokens) {
            res.status(500).send('Server Error');
            return;
        }
        if (!user.refreshToken) {
            user.refreshToken = [];
        }
        user.refreshToken.push(tokens.refreshToken);
        await user.save();
        res.status(200).send(
            {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                id: user.id
            });

    } catch (err) {
        res.status(400).send(err);
    }
};
const logout = async (req: Request, res: Response) => {
    try {
        const user = await verifyRefreshToken(req.body.refreshToken);
        await user.save();
        res.status(200).send("success");
    } catch (err) {
        res.status(400).send("fail");
    }
};

export default {register, login, refresh, logout}