import jwt from "jsonwebtoken";

const JWT_PASSWORD="jaimatadi";
export const generateToken=(id)=>{
    return  jwt.sign({id},JWT_PASSWORD,{
        expiresIn:'30d',
    })
}