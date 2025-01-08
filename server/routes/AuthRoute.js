import { Router } from "express";
import { 
    signin,
    googleSignin, 
    signup, getAllUsers,
    fetchClients,
    addClient,
    getForms, 
    addForms, 
    editClient, 
    deleteClient,
    deleteForm,
    editForm,
    addFormData,
    getFormData,
    getFormHTML,
    saveFormData,
    getFormDetails } from "../controllers/AuthController.js";

const AuthRoute = Router()
AuthRoute.post("/signin", signin)
AuthRoute.post("/signup", signup)
AuthRoute.post('/google', googleSignin)
AuthRoute.get('/getAllUsers', getAllUsers)
AuthRoute.post('/fetchClients/:id', fetchClients)
AuthRoute.post('/addClient/:id', addClient)
AuthRoute.get('/getForms/:id', getForms)
AuthRoute.post('/addForm/:id', addForms)
AuthRoute.put('/editClient/:id', editClient)
AuthRoute.delete('/deleteClient/:id', deleteClient)
AuthRoute.delete('/deleteForm/:id', deleteForm)
AuthRoute.put('/editForm/:id', editForm)
AuthRoute.put('/addFormData/:id', addFormData)
AuthRoute.get('/getFormData/:id', getFormData)
AuthRoute.get('/getFormHTML/:id', getFormHTML)
AuthRoute.post('/saveFormData/:id', saveFormData)
AuthRoute.get('/form-details/:id', getFormDetails)


export default AuthRoute