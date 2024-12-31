import app from "./app.js"
import { connectToDatabase } from "./connection.js" 

const PORT = process.env.PORT || 3124
connectToDatabase().then(()=>{
  app.listen(PORT, ()=> console.log(`Server is up on ${PORT} and connected to DB`))
}).catch((err)=>console.log(err))