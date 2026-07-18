import {Router} from "express";
const router = Router();
import {registerUser , loginUser , getMe} from "../controllers/authController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/me").get(protectRoute , getMe);
export default router;