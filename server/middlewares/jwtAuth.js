import jwt from 'jsonwebtoken'
export const jwtAuth = async (req,res,next)=>
{
    const token = req.cookies.token;
    if(!token)
    {
        return res.status(404).json({message:'Token not found.'})
    }
    try
    {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        console.log(decoded); 
        const userId = decoded.id;
        req.userId = userId;
        next();
    }
    catch(err)
    {
        return res.status(401).json({message : "Token is not valid."})
    }
}
