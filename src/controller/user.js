
import { generateToken } from "../util.js/util.js";
import userModel from "../model/userModel.js";
import bcrypt from "bcrypt";

export const signup=async(req,res)=>{
    try{
const {email,password,role}=req.body;
console.log(`${email} ${password} ${role}`);
const existingUser=await userModel.findOne({email});
  if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
const hashedpassword=await bcrypt.hash(password,10)
const user=await userModel.create({
    email:email,
    password:hashedpassword,
    role:role || 'princpal'

})
const token=generateToken(user._id);

 return res.status(201).json({
   success:true,

   message:"succesful user created",
   token,
   user:{
      id: user._id,
      email:user.email
   }

  })
}catch(error){
    res.status(500).json({error:error.message});
}

}

export const signin=async (req,res)=>{
    try{
    const {email,password}=req.body;
   const user=await userModel.findOne({email});

   if(!user){
     return  res.status(401).status({
         message:"user not exist",
      })
   }
   
   const ispassword=await bcrypt.compare(password,user.password);
 const token =generateToken(user._id);
   if(ispassword && user.email ===email){
    return   res.status(200).json({
          success:true,
         message:"succesul login",
         token,
         user:{
            id:user._id,
            email:user.email
         }
      })
   }
  return  res.status(401).json({
    message:"fail to signin",
   })
}catch(error){
    res.status(500).json({ error: error.message });
}

}