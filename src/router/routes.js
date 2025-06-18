import {Router} from "express";
const router =Router();
import * as userController from "../controller/user.js";
import * as studentController from "../controller/student.js";
import { authorization } from "../middleware/auth.js";

router.post("/api/signup",userController.signup);
router.post("/api/signin",userController.signin);
router.post("/api/students",authorization,studentController.students);
router.get("/api/students",authorization,studentController.getallstudents);
export default router;

