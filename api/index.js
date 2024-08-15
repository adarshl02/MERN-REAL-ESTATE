import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'

mongoose.connect(process.env.MONGO_URL)
.then(() => {console.log("DB Connected");
})
.catch((err)=>{
    console.log(err);
});


const app=express();
app.use(express.json());  //going to allow json as input to server

app.listen(3000,()=>{
    console.log('server is running on port 3000!');
});

app.use('/api/user',userRouter);
app.use('/api/auth',authRouter);