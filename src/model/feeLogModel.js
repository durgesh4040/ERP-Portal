import mongoose from "mongoose";
const feeLogSchema=new mongoose.Schema({
    studentId:{
        type:String,
        required:true
    },
    updatedBy:{
        type:String,
        required:true
    },
    previousAmount:{
        type:Number
    },
    newAmount:{
        type:Number
    },
    action:{
        type:String,
        required:true
    },
    timestamp:{
        type:Date,
        default:Date.now()
    },
    details:{
        type:String
    }
})
const feeLogModel=mongoose.model("feelog",feeLogSchema);
export default feeLogModel;