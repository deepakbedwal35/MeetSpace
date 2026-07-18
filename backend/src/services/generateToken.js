
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET_KEY || "fallback_temporary_secret_key";


export function setUser(user) {
    const payload = {
        _id: user._id 
    };
    return jwt.sign(payload, secret, {
        expiresIn: "10d"
    }); 
}


export const getUser = (token) => {
    if (!token) return null;
    try {
        return jwt.verify(token, secret);
    } catch (err) {
        return null;
    } 
};
