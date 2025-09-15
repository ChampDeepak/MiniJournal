import express from 'express'; 
import dotenv from 'dotenv'; 
import cookieParser from 'cookie-parser';
import { connectDB } from './config/connectDB.js';
import authRouter from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import entryRouter from './routes/entry.route.js';

//connect database , set env, set gitignore 
const app = express(); 
const port = 8000; 
dotenv.config(); 

//Database Connection 
connectDB(process.env.dburl); 

//Middlewares 
app.use(express.json()); 
app.use(cookieParser()); 

//Route Middleware Registeration
app.use('/',authRouter);
app.use('/',userRoutes); 
app.use('/',entryRouter); 

//Demo route 
app.get('/',(req,res)=>{
    res.send("Hello")
}); 

app.listen(port, ()=>{
    console.log(`Server listening at http://localhost:${port}`); 
}); 



