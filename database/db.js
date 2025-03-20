import mongoose from "mongoose";

export const conn = async() =>{
    try{
      await mongoose.connect(process.env.DB)
      console.log("database sucess")
    }catch(error){
        console.log(error);
    }
}
