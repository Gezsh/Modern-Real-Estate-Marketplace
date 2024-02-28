const mongoose=require("mongoose")


const userSchema =new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,

    },
    email:{
        type:String,
        required:true,
        unique:true,

    },
    password:{
        type:String,
        required:true,
        
    },
    avatar:{
       type:String,
       default:" https://lh3.googleusercontent.com/a/ACg8ocLeUiRQo1nfSwiscqQwisOI77Jv5ooOJI1T-fgzWIoRuA=s96-c",


    }
},{timestamps:true})

module.exports= mongoose.model("User",userSchema);

