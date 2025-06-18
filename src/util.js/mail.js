import { transporter } from "../config/mail.js";
export async function sendEmail(student) {
  const confirmYesLink = `${process.env.BASE_URL || 'http://localhost:3000'}/api/confirm-fee/${student.studentId}/${student.confirmationToken}?response=yes`;
  const confirmNoLink = `${process.env.BASE_URL || 'http://localhost:3000'}/api/confirm-fee/${student.studentId}/${student.confirmationToken}?response=no`;
  console.log(`student email ${student}`);
  const mailOptions = {
    from: "finaldig1234@gmail.com",
    to: student.email,
  subject: 'Fee Submission Confirmation Required',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Fee Submission Confirmation</h2>
        
        <p>Dear <strong>${student.name}</strong>,</p>
        
        <p>Your updated fee details are as follows:</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Student ID:</strong> ${student.studentId}</p>
          <p><strong>Total Fee:</strong> Rs. ${student.totalFee}</p>
          <p><strong>Due Amount:</strong> Rs. ${student.dueAmount}</p>
          <p><strong>Due Date:</strong> ${new Date(student.dueDate).toLocaleDateString()}</p>
        </div>
        
        <p>Please confirm whether you have submitted the fees by clicking one of the buttons below:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${confirmYesLink}" 
             style="background-color: #27ae60; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 0 10px; display: inline-block;">
            Yes, I have paid
          </a>
          
          <a href="${confirmNoLink}" 
             style="background-color: #e74c3c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 0 10px; display: inline-block;">
            No, not yet paid
          </a>
        </div>
        
        <p style="font-size: 12px; color: #7f8c8d;">
          This confirmation link will expire in 7 days. If you have any questions, please contact the school administration.
        </p>
        
        <hr style="border: 1px solid #ecf0f1; margin: 30px 0;">
        <p style="font-size: 12px; color: #7f8c8d;">
          This is an automated email. Please do not reply to this email.
        </p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${student.email}: ${info.response}`);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
