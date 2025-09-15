import User  from "../models/user.model.js"

export const getUser = async (req,res) => 
{
    try
    {
        const user = await User.findById(req.userId).select("-password"); 
        if(!user) res.status(404).json({message:"User not found."})
        return res.status(200).json({user}); 
    }

    catch(error)
    {
        res.status(500).json({message:"Server Side Error."})
    }
}