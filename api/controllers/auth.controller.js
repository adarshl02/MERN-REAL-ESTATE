import bcryptjs from 'bcryptjs';
import User from './../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signUp=async(req,res,next)=>{

    const {username,email,password} =req.body;
    const hashedPassword = bcryptjs.hashSync(password,10);
    const user = new User({username,email,password:hashedPassword});
    try{
         await user.save();
        res.status(201).json('User created successfully');
        }catch(err){
           next(err);
            }

}


export const signin=async(req,res,next)=>{
    const {email,password}=req.body;
    try{
        const user =await User.findOne({email});
        if(!user) return next(errorHandler(404,'User not found'));
        const isValidPassword = bcryptjs.compareSync(password,user.password);
        if(!isValidPassword) return next(errorHandler(401,'Invalid password'));
        //To authenticate user (add cookie inside browser)
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET);

        //destructure
        const {password:pass,...rest}=user._doc;

        res.cookie('access_token',token,{httpOnly:true})   //httpOnly true : no other third party have access to our cookie
            .status(200)
            .json(rest);
    }catch(err){
        next(err);
        }
    }       