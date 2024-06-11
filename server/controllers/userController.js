import asyncHandler from "express-async-handler";
import {User} from "../models/User.js";
import generateToken from "../config/generateToken.js";

const registerUser = asyncHandler(async (req,res) => {

    const {name , email , password , pic} = req.body;

    if(!name || !email)
    {
        res.status(400);
        throw new Error("Please Enter all the Fields..");
    }

    const user = await User.findOne({email});

    if(user)
    {
        res.status(400);
        throw new Error("User already Exists");
    }

    const newUser = await User.create({
        name , email , password , pic
    });

    if(newUser)
    {
        res.status(201).json({
            _id : newUser._id,
            name : newUser.name,
            email : newUser.email,
            pic : newUser.pic,
            token : generateToken(newUser._id)
        })
    }
    else
    {
        res.status(400);
        throw new Error("Failed to create the User");
    }
}
);

const authUser = asyncHandler(async (req,res) => {

    const {email , password} = req.body;

    const user = await User.findOne({email});

    let flag = false;

    if(user)
    {
        flag = await user.isPasswordCorrect(password);
    }

    if(user && flag)
    {
        res.json({
            _id : user._id,
            name : user.name,
            email : user.email,
            pic : user.pic,
            token : generateToken(user._id)
        })
    }
    else
    {
        res.status(401);
        throw new Error("Invalid Email or Password");
    }
});

const allUsers = asyncHandler(async (req,res) => {

    const keyword = req.query.search ? 
    {
        $or : [
            { name : {$regex : req.query.search , $options : "i"} },
            { email : {$regex : req.query.search , $options : "i"} }
        ],
    } 
    : {};

    const users = await User.find(keyword).find( { _id : { $ne : req.user._id} } );

    return res.send(users);
}); 

export {
    registerUser,
    authUser,
    allUsers
}