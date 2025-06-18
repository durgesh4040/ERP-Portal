import express from "express";
import userModel from "./model/userModel.js";
import { generateToken } from "./util.js/util.js";
import connectdb from "./model/db.js";
import bcrypt from "bcrypt";
import { authorization } from "./middleware/auth.js";
import studentModel from "./model/studentModel.js";
import feeLogModel from "./model/feeLogModel.js";
import nodemailer from "nodemailer"
import path from "path";
import { sendEmail } from "./util.js/mail.js";
const app=express();

async function index(){
app.use(express.json());

await connectdb();
app.post('/',async (req,res)=>{
    console.log("I am from the post");
    return res.json({
        msg:"hello i am the wonder"
    }

    );
})

app.post('/api/signup',async (req,res)=>{
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

})

app.post(`/api/signin`,async (req,res)=>{
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

})

app.post('/api/students',authorization,async (req,res)=>{
    try{
    const student=await studentModel.create(req.body);
    res.status(201).json(student);

    } catch(error){
       res.status(500).json({error:error.message})
    }

})
app.get('/api/students',authorization,async (req,res)=>{
    try{
        const students=await studentModel.find().sort({createdAt:-1});
        res.json(students);
    }catch(error){
        res.status(500).json({error:error.message})
    }
})
    app.listen(3000,()=>{
        console.log("server start");
    })


app.get('/api/students/:id',authorization,async (req,res)=>{
    try{
        const student=await studentModel.findById(req.params.id);
        if(!student){
            return res.status(404).json({error:'student not found'});
        }
        res.json(student);
    }catch(error){
        res.status(500).json({error:error.message});
    }
})

app.put('/api/students/:id/fee',authorization,async(req,res)=>{
    try{
        const {totalFee,dueAmount,dueDate,feeStatus} =req.body;
        console.log(totalFee);
        const studentId=req.params.id;

        //const student=await studentModel.findById(studentId);
        const student = await studentModel.findOne({ studentId: studentId});
        console.log(student);
       await sendEmail(student);

        if(!student){
            return res.status(404).json({error:"Student not found"});
        }
        const previousAmount=student.dueAmount;
        const confirmationToken=crypto.randomUUID(32).toString('hex');

        student.totalFee=totalFee || student.totalFee;
        student.dueAmount=dueAmount || student.dueAmount;
        student.dueDate=dueDate || student.dueDate;
        student.feeStatus=feeStatus || student.feeStatus;
        student.confirmationToken=confirmationToken;
        student.lastUpdate=new Date();

        await student.save();

        const feelog=new feeLogModel({
            studentId:student.studentId,
            updateBy:req.user.username,
            previousAmount,
            newAmount:student.dueAmount,
            action:'fee_updated',
            details:`fee updated by by ${req.user.username}`
        });
        await feelog.save();

        await sendEmail(student);

        res.json({message:'fee updated and email send successfully',student});

    }catch(error){
       res.status(500).json({error:error.message})
    }
})

app.get('/api/confirm-fee/:studentId/:token', async (req, res) => {
  try {
    const { studentId, token } = req.params;
    const { response } = req.query;
    
    const student = await studentModel.findOne({ 
      studentId: studentId,
      confirmationToken: token 
    });
    
    if (!student) {
      return res.status(400).send(`
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h2 style="color: #e74c3c;">Invalid or Expired Link</h2>
            <p>The confirmation link is invalid or has expired.</p>
          </body>
        </html>
      `);
    }

    // Update fee status based on response
    if (response === 'yes') {
      student.feeStatus = 'paid';
      student.paidAmount = student.totalFee;
      student.dueAmount = 0;
    } else if (response === 'no') {
      student.feeStatus = 'pending';
    }
    
    // Clear confirmation token
    student.confirmationToken = null;
    student.lastUpdated = new Date();
    await student.save();

    // Create audit log
    const feeLog = new feeLogModel({
      studentId: student.studentId,
      updatedBy: 'student_confirmation',
      action: 'fee_confirmed',
      details: `Student confirmed fee payment: ${response}`
    });
    await feeLog.save();

    const statusMessage = response === 'yes' ? 
      'Thank you for confirming your fee payment!' : 
      'We have noted that your fee is still pending.';
    
    res.send(`
      <html>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h2 style="color: #27ae60;">Confirmation Successful</h2>
          <p>${statusMessage}</p>
          <p>Your fee status has been updated in the system.</p>
        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send(`
      <html>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h2 style="color: #e74c3c;">Error</h2>
          <p>An error occurred while processing your confirmation.</p>
        </body>
      </html>
    `);
  }
});

const publicDir = path.join('C:', 'ERP Project Assignment', 'Backend', 'public');

app.get('/', (req, res) => {
res.sendFile(path.join(publicDir, 'index.html'));
});

}
index();