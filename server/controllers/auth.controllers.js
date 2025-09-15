//sign up 
//sign in 
//sign out 
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import { genToken } from "../config/token.js";

//Sign Up  Controller 
export const signUp = async (req, res) => {
    const {name, userName, email, password} = req.body;
    try
    {
        //Validate User Date 
        if(!name||!userName||!email||!password)
        {
            return res.status(400).json({
                message: "All fields are required."
            })
        }

        //Validate email
        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(400).json({message: "Email already in use."})
        
        //Validate userName
        const existingUserName = await User.findOne({userName});
        if(existingUserName) return res.status(400).json({message: "Username already in use."})
        
        //Password Strength
        if(password.length<6)
        {
            return res.status(400).json({message:"Password must be at least 6 characters."}); 
        }
        //Hahing the password 
        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password,salt);

        //Create User
        const newUser = await User.create({name, userName, email, password:hashedPassword});
        const token = await genToken(newUser._id); 
        res.cookie('token', token, {
            httpOnly:true,
            sameSite:true,
            maxAge: 2592000000
        });
        // console.log(token);
        res.status(201).json({message:"User created successfully!"}); 
    } 
    catch (error) 
    {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

//Sign In Controller 
export const signIn = async (req, res) => {
    const {userName, password} = req.body;
    try
    {
        //Validate inputs 
        if(!userName||!password)
        {
            return res.status(400).json({
                message: "All fields are required."
            })
        }
    
        //Find User 
        const user = await User.findOne({userName});
        if(!user) return res.status(404).json({message: "Username not found."})
        
        //Writing Cookies 
        const token = await genToken(user._id); 
        res.cookie('token', token, {
            httpOnly:true,
            sameSite:true,
            maxAge: 2592000000
        });

        //Compare Password
        const passwordMatch = await bcrypt.compare(password, user.password); 
        if(!passwordMatch) res.status(400).json({message:'Either userName or password is incorrect.'})
        else res.status(200).json({message:'Login Successfull.', userDetail : user})
    } 
    catch (error) 
    {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}