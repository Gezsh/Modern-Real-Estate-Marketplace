const express=require("express")
const mongoose= require("mongoose")
const userRouter=require("./routes/users.route")
const authRouter=require('./routes/auth.route')
const cookieParser=require('cookie-parser')
const listingRouter=require('./routes/listing.route')
// const path =require('path')
require('dotenv').config()

const app=express();

// const __dirname=path.resolve();
// const corsOptions = {
//     origin: 'https://realestatesgezsh.netlify.app',
//     credentials: true, // Enable credentials (cookies)
//   };

const cors=require('cors')
app.use(express.json())
app.use(cors());
app.use(cookieParser())
app.use("/api/user",userRouter)
app.use("/api/auth",authRouter)
app.use("/api/listing",listingRouter)

// app.use(express.static(path.join(__dirname,'/client/dist')))

// app.get('*',(req,res)=>{
//     res.sendFile(path.join(__dirname, 'client','dist','index.html'))
// })

mongoose.connect(process.env.MONGO_URL).then(()=>console.log("connected to database")).catch((err)=>console.log(err));

app.listen (3000,()=>{
   console.log("server is runnig on port 3000!");
});

app.use((err,req,res,next)=>{
    const statusCode=err.statusCode || 500;
    const message=err.message || "internal server error"
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message
       })
})