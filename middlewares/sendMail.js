// import {createTransport} from 'nodemailer'

// const sendMail = async(email , subject , data ) =>{

//     const transport = createTransport({
//         host: "smtp.gmail.com",
//         port : 465,
//         auth :{
//             user : process.env.Gmail,
//             pass : process.env.Password
//         },
//     });

   
    
//     const html = `<!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>OTP Verification</title>
//     <style>
//         body {
//             font-family: Arial, sans-serif;
//             margin: 0;
//             padding: 0;
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             height: 100vh;
//         }
//         .container {
//             background-color: #fff;
//             padding: 20px;
//             border-radius: 8px;
//             box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//             text-align: center;
//         }
//         h1 {
//             color: red;
//         }
//         p {
//             margin-bottom: 20px;
//             color: #666;
//         }
//         .otp {
//             font-size: 36px;
//             color: #7b68ee; /* Purple text */
//             margin-bottom: 30px;
//         }
//     </style>
// </head>
// <body>
//     <div class="container">
//         <h1>OTP Verification</h1>
//         <p>Hello ${data.name} your (One-Time Password) for your account verification is.</p>
//         <p class="otp">${data.otp}</p> 
//     </div>
// </body>
// </html>
// `;
    
    


//     await transport.sendMail( {
//         from : process.env.Gmail,
//         to : email,
//         subject,
//         html
//     })
// };

// export default sendMail;


import { createTransport } from "nodemailer";

const sendMail = async (email, subject, data) => {
    try {
        // Configure nodemailer transporter
        const transport = createTransport({
            service: "gmail", // Using Gmail service
            auth: {
                user: process.env.SMTP_USER, // Your Gmail address
                pass: process.env.SMTP_PASS, // Your App Password (not your Gmail password)
            },
        });

        // HTML Template for the email
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f7f7f7;
        }
        .container {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        h1 {
            color: #ff4500;
        }
        p {
            margin-bottom: 20px;
            color: #555;
        }
        .otp {
            font-size: 36px;
            font-weight: bold;
            color: #7b68ee;
            margin-bottom: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>OTP Verification</h1>
        <p>Hello <strong>${data.name}</strong>,</p>
        <p>Your One-Time Password (OTP) for account verification is:</p>
        <p class="otp">${data.otp}</p>
        <p>If you did not request this, please ignore this email.</p>
    </div>
</body>
</html>
`;

        // Send the email
        await transport.sendMail({
            from: `"TM-LMS" <${process.env.SMTP_USER}>`, // Display name and email
            to: email, // Recipient email
            subject, // Email subject
            html, // HTML content
        });

        console.log("Email sent successfully!");
    } catch (error) {
        console.error("Error while sending email:", error.message);
        throw new Error("Failed to send email. Please try again later.");
    }
};

export default sendMail;
