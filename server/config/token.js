import jwt from "jsonwebtoken"
export const genToken = async (id)=>{
    try
    {
        const token = jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'30d'}); 
        return token; 
    }
    catch(err)
    {
        throw new Error("Error in generating token.")
    }
}