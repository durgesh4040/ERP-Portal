import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
email:{
    type:String,
    required:true,
    unique:true
},
password:{
     type:String,
    required:true,
    unique:true
},
role:{
    type:String,
    enum:['princpal','admin'],
    default:'principal'
},
createdAt:{
    type:Date,
    default:Date.now()
}
})
const userModel=mongoose.model("user",userSchema);
export default userModel;