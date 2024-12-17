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
            ref: "Course",
        },
        ],
    }, 
    {
    timestamps: true
    }
);



schema.methods.generatetoken = function () {
    try {
      let usertoken = jwt.sign({ _id: this._id }, secretkey);
      return usertoken;
    } catch (error) {
      console.log(error);
    } 
  };



export const User = mongoose.model("User", schema)