import asyncHandler from "express-async-handler";
import { User } from "../models/user.model";
import generateToken from "../utils/generateToken";

export const signup = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body
    if(!name || !email || !password){
        res.status(400)
        throw new Error("Please provide name, email and password")
    }

    const existingUser = await User.findOne({email})
    if(existingUser){
        res.status(400)
        throw new Error("An account with this email already exists")
    }

    const user = await User.create({name, email, password})
    if(user){
        res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                token: generateToken(user._id)
            }
        })
    }else{
        res.status(400)
        throw new Error("Invalid user data")
    }
})


export const login = asyncHandler(async (res, req) => {
    const {email, password} = req.body
    if(!email || !password){
        res.status(400)
        throw new Error("Please provide email and password")
    }

    const user = await User.findOne({email}).select(+password)
    if (!user) {
        res.status(401);
        throw new Error("Invalid email or password"); 
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        res.status(401);
        throw new Error("Invalid email or password");
    }

    res.status(200).json({
        success: true,
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            token: generateToken(user._id),
        },
    });
})

export const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate({
        path: "savedTrips",
        select: "destination duration budgetTier travelers createdAt title status",
        options: { sort: { createdAt: -1 }, limit: 20 },
    });

    res.status(200).json({
        data: user,
        success: true,
    });
})

export const updateMe = asyncHandler(async (req, res) => {
    const allowedUpdates = {};
    if (req.body.name) allowedUpdates.name = req.body.name;
    if (req.body.avatar) allowedUpdates.avatar = req.body.avatar;

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        allowedUpdates,
        { new: true, runValidators: true } // runValidators re-runs schema validation
    );
 
    res.status(200).json({
        success: true,
        data: updatedUser,
    });
})
