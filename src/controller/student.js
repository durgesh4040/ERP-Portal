
import studentModel from "../model/studentModel.js";

export const students=async (req,res)=>{
    try{
    const student=await studentModel.create(req.body);
    console.log(student);
    res.status(201).json(student);

    } catch(error){
       res.status(500).json({error:error.message})
    }

}


export const getallstudents=async(req,res)=>{
    try{
        const students=await studentModel.find().sort({createdAt:-1});
        res.json(students);
    }catch(error){
        res.status(500).json({error:error.message})
    }
}