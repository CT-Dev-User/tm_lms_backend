
// import { User } from "../models/user.js";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import sendMail from "../middlewares/sendMail.js";

// export const register = async (req, res) => {
//     try {
//         const { email, name, password } = req.body;

//         // Check if user already exists
//         let user = await User.findOne({ email });
//         if (user) {
//             return res.status(400).json({
//                 message: "User already exists",
//             });
//         }

//         // Hash the password
//         const hashPassword = await bcrypt.hash(password, 10);

//         // Create a new user document
//         user = new User({
//             name,
//             email,
//             password: hashPassword,
//         });

//         // Save user to the database
//         await user.save();

//         // Generate OTP and activation token
//         const otp = Math.floor(Math.random() * 1000000);
//         const activationToken = jwt.sign(
//             { user, otp },
//             process.env.Activation_Secret,
//             { expiresIn: "5m" }
//         );

//         // Send email with OTP
//         const data = { name, otp };
//         await sendMail(email, "TM-LMS", data);

//         // Respond with success
//         res.status(200).json({
//             message: "OTP sent to your email",
//             activationToken,
//         });
//     } catch (error) {
//         console.error(error); // Log the error
//         res.status(500).json({
//             message: error.message,
//         });
//     }
// };


// import { compare, hashpassword } from "../middlware/helper.js";
// import User from "../User/User.js";

// export const register = async (req, res) => {
//   try {
//     const { email, phone, password, role } = req.body;
//     const userExist = await User.findOne({ email });

//     if (userExist) {
//       return res.status(400).send({message:"User already exists, please login"});
//     } else {
//       const hash = await hashpassword(password);
//       const newuser = new User({
//         email,
//         phone,
//         password: hash, // Store the hashed password
//         role,
//       });
//       const userSave = await newuser.save();
//       console.log(userSave);
//       res.status(200).send({ message: "User registered", user: userSave });
//     }
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
// };

// export const login = async (req, res) => {
//   console.log(req.body)
//   try {
//     const { email, password } = req.body;
//     console.log(email, password)
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).send("User does not exist, please sign up first");
//     } else {
//       const match = await compare(password, user.password);
//       console.log(match)
//       if (match) {
//         const token = await user.generatetoken();
//         res.status(200).send({ token, user });
//         console.log(token);
//       }
//     }
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
// };




import { User } from "../models/user.js";
import { TryCatch } from "../middlewares/TryCatch.js"
import { isAuth } from "../middlewares/isAuth.js";

// import { compare, hashpassword } from "../middlware/helper.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMail from "../middlewares/sendMail.js";

export const register = async (req, res) => {
    try {
        const { email, name, password, phone, role } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        // Hash the password
        const hashPassword = await bcrypt.hash(password, 10);

        // Create a new user document
        user = new User({
            name,
            email,
            phone,
            password: hashPassword,
            role,
        });

        // Save user to the database
        await user.save();

        // Generate OTP and activation token
        const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
        const activationToken = jwt.sign(
            { user: user.toObject(), otp },
            process.env.Activation_Secret,
            { expiresIn: "5m" }
        );

        // Prepare email data
        const data = { name, otp };

        // Send email with OTP
        await sendMail(email, "Account Activation - TM-LMS", data);

        // Respond with success and activation token
        res.status(200).json({
            message: "OTP sent to your email",
            activationToken,
        });
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({
            message: error.message,
        });
    }
};





// export const loginUser = TryCatch(async(req,res) =>{
//     const {email , password} = req.body;

//     const user = await User.findOne({email})
//     if(!user) return res.status(400).json({
//        message :"No User found with this email" ,
//     });

//     const matchPassword = await bcrypt.compare(password,user.password);
//     if(!matchPassword) return res.status(400).json({
//         message: "Password Incorrect",
//     });

//     const token = await jwt.sign({_id:user._id}, process.env.Jwt_Sec,{
//         expireIn : "15d"
//     });

//     res.json({
//         message : `Welcome back ${user.name}`,
//         token,
//         user,
//     })
// });



export const loginUser = TryCatch(async (req, res) => {
    // Extract email and password from request body
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
        return res.status(400).json({
            message: "Please provide both email and password.",
        });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({
            message: "No user found with this email.",
        });
    }

    // Compare passwords
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
        return res.status(400).json({
            message: "Incorrect password.",
        });
    }

    // Generate JWT token
    const token = jwt.sign(
        { _id: user._id },
        process.env.Jwt_Sec, // Ensure you have JWT_SECRET in your .env file
        { expiresIn: "15d" } // Corrected `expireIn` to `expiresIn`
    );

    // Send response
    res.status(200).json({
        message: `Welcome back, ${user.name}!`,
        token,
        user,
    });
});





export const verifyOTP = async (req, res) => {
    try {
        const { activationToken, otp } = req.body;

        // Verify the activation token
        const decoded = jwt.verify(activationToken, process.env.Activation_Secret);

        // Check if OTP matches
        if (decoded.otp !== parseInt(otp)) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Update user as verified
        const user = await User.findByIdAndUpdate(
            decoded.user._id, 
            { isVerified: true }, 
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ 
            message: "Email verified successfully", 
            user: { 
                email: user.email, 
                name: user.name 
            } 
        });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ message: "OTP has expired. Please request a new one." });
        }
        res.status(500).json({ message: error.message });
    }
};

export const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // Find the user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate new OTP
        const otp = Math.floor(100000 + Math.random() * 900000);

        // Create new activation token
        const activationToken = jwt.sign(
            { user: user.toObject(), otp },
            process.env.Activation_Secret,
            { expiresIn: "5m" }
        );

        // Prepare email data
        const data = { name: user.name, otp };

        // Send email with new OTP
        await sendMail(email, "Resend OTP - TM-LMS", data);

        res.status(200).json({
            message: "New OTP sent to your email",
            activationToken,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const myProfile = TryCatch(async (req, res) => {
    const user = await User.findById(req.user._id);

    res.json({ user });
});
