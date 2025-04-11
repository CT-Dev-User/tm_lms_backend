import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: "user",
        },
        subscription: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Courses",
        }],
        // Fields for password reset
        resetPasswordToken: {
            type: String,
            default: null
        },
        resetPasswordExpires: {
            type: Date,
            default: null
        },firstName: {
            type: String,
            default: "",
        },
        lastName: {
            type: String,
            default: "",
        },
        profileImage: {
            type: String,
            default: null,
        },
        profileComplete: {
            type: Boolean,
            default: false
        }
    }, 
    {
    timestamps: true
    }
);

schema.methods.generateToken = function () {
    try {
      let userToken = jwt.sign({ _id: this._id }, process.env.Jwt_Sec);
      return userToken;
    } catch (error) {
      console.log(error);
    } 
};

export const User = mongoose.model("User", schema);