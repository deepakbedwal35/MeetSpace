import {getUser} from "../services/generateToken.js"
export const protectRoute = (req, res, next) => {
  const token = req.cookies.meetspace_token;
  if (!token) {
    req.user = null; // Do not throw a 401 error, just set user to null
    return next();
  }

  try {
    const decoded = getUser(token);
    
    req.user = decoded; 
    next();
  } catch (error) {
    req.user = null; 
    next();
  }
};
