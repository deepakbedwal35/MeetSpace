import User from "../models/User.js";
import wrapAsync from "../utils/wrapAsync.js";
import {getUser, setUser} from "../services/generateToken.js";
import {hashPassword, comparePassword} from "../services/passwordService.js";
import status from "http-status";

const sendTokenInCookie = (res, user) => {
  const token = setUser(user);
  const cookieOptions = {
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production", 
    sameSite: "lax", 
    maxAge: 10 * 24 * 60 * 60 * 1000, 
  };
  res.cookie("meetspace_token", token, cookieOptions);
  res.status(status.OK).json({
    message: "Success",
    user: { id: user._id, username: user.username, email: user.email },
  });
};

export const registerUser= wrapAsync(async(req,res)=>{
    const {username, email, password} = req.body;
    const existUser = await User.findOne({email});
    console.log("Registering user:", username, email, password);
    if(existUser){
        return res.status(status.BAD_REQUEST).json({message : "User already exist"});
    }

    const hashedPass = await hashPassword(password);
    const user = await User.create({username, email , password:hashedPass});
    // const token = setUser(user);

    sendTokenInCookie(res, user);
    
});

export const loginUser = wrapAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(status.UNAUTHORIZED).json({ message: "Invalid email or password" });
  }
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    return res.status(status.UNAUTHORIZED).json({ message: "Invalid email or password" });
  }

  // const token = setUser(user);

  sendTokenInCookie(res, user);
});


export const getMe = wrapAsync(async (req, res) => {
  // console.log("inside me ")
 
  if (!req.user?._id) {
    return res.status(status.OK).json({ user: null }); 
  }
  

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(status.OK).json({ user: null }); 
  }

  res.status(status.OK).json({
    user: { id: user._id, username: user.username, email: user.email },
  });
});


export const logoutUser = wrapAsync(async (req, res) => {
  res.clearCookie("meetspace_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.status(status.OK).json({ message: "Logged out successfully" });
});