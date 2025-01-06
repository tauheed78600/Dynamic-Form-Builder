import { Router } from "express";
import { signin, googleSignin, signup, getAllUsers, fetchClients, addClient, getForms,addForms } from "../controllers/AuthController.js";

const AuthRoute = Router()
AuthRoute.post("/signin", signin)
AuthRoute.post("/signup", signup)
AuthRoute.post('/google', googleSignin)
AuthRoute.get('/getAllUsers', getAllUsers)
AuthRoute.post('/fetchClients/:id', fetchClients)
AuthRoute.post('/addClient/:id', addClient)
AuthRoute.get('/getForms/:id', getForms)
AuthRoute.post('/addForm/:id', addForms)

export default AuthRoute