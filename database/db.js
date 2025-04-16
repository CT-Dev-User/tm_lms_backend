import mongoose from "mongoose";

// export const conn = async() =>{
//     try{
//       await mongoose.connect(process.env.DB)
//       console.log("database sucess")
//     }catch(error){
//         console.log(error);
//     }
// }


export const conn = async () => {
  try {
    console.log("Connecting to DB:", process.env.DB);
    await mongoose.connect(process.env.DB);
    console.log("Database connection successful");
  } catch (error) {
    console.log("DB Connection Error:", error);
  }
};
