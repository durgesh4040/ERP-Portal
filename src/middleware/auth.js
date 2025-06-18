import jwt from "jsonwebtoken";
const JWT_PASSWORD="jaimatadi";
export const authorization=(req,res,next)=>{
    try{
const token=req.headers.token;
if(!token){
    return res.json({
        success:false,
        message:"Access Denied ,No token provided"
    })
}
const decode=jwt.verify(token,JWT_PASSWORD);
if(decode){
    req.userId=decode.id ;
console.log(decode);
 next();
}
}catch(error){
    return res.status(400).json({
        success:false,
        message:"invalid token"
    })
}
}