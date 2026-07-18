import mongoose from 'mongoose';

export const connectDB = async ()=>{
    mongoose.connect(process.env.MONGO_URI , {dbName:"MeetSpace"})
    .then(()=>{
        console.log("Connected to DB")
   
    })
    .catch((err)=>console.log("DB connection error: " + err.message));
};

