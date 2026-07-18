import mongoose , {Schema} from "mongoose";

const userSchema = new Schema(
    {
        email:{
            type : String,
            required: true,
            unique : true
        },
        username:{
            type : String,
            required: true,
            unique : true
        },
        password:{
            type : String,
            required: true
        },
        isVerified:{
            type : Boolean,
            default : false
        },
        
        token:{
            type : String,
           
        }
    }
)

const User = mongoose.model("User" , userSchema);
export default User;