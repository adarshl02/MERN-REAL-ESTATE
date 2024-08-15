import bcryptjs from 'bcryptjs';
import User from './../models/user.model.js';

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