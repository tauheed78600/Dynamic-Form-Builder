import { Router } from "express";
import { signin, googleSignin, signup, getAllUsers } from "../controllers/AuthController.js";

const AuthRoute = Router()
AuthRoute.post("/signin", signin)
AuthRoute.post("/signup", signup)
AuthRoute.post('/google', googleSignin)
AuthRoute.get('/getAllUsers', getAllUsers)

export default AuthRoute