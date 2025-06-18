import mongoose from "mongoose";
const studentSchema=new mongoose.Schema({
    studentId:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String
    },
    class:{
        type:String,
        required:true
    },
    totalFee:{
        type:Number,
        required:true
    }
    

});
const studentModel=mongoose.model("student",studentSchema);
export default studentModel;