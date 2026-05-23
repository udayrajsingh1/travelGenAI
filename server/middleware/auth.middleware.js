import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"

export const protect = async (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try{
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await user.findById(decoded.id).select("-password");

            if(!req.user){
                res.status(401)
                throw new Error("User not found - token may be stale")
            }
            next()
        }catch(error){
            res.status(401)
            next(new Error("Not authorized, invalid or expired token"))
        }
        

    }else{
        res.status(401)
        next(new Error("Not authorize, no token provided"))
    }
}