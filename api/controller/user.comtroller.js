const Listing = require("../model/listing.model")
const User=require("../model/user.model")
const { errorHandler } = require("../utils/error")
const bcrypt=require('bcryptjs')

const updateUser=async(req,res,next)=>{
    console.log(req.body)
   if(req.user.id !== req.params.id) return next(errorHandler(401,'you can only update your own account'))
   try{  
    if(req.body.password){
        req.body.password =  bcrypt.hashSync(req.body.password,10)
        
    }
    const updatedUser =await User.findByIdAndUpdate(req.params.id,{
        $set: {
           username:req.body.username,
           email:req.body.email,
           password:req.body.password,
           avatar:req.body.avatar,
        }}, {new: true})
        console.log("updatedUser",updatedUser)
        const {password,...rest}=updatedUser._doc
        res.status(200).json(updatedUser)
        console.log(rest)
}catch(error){
   next(error)
}
}

const deleteUser=async(req,res,next)=>{
      
     if(req.user.id !== req.params.id) return next(errorHandler(401,'you can only update your own account'))
     
     try{
       await User.findByIdAndDelete(req.params.id)
      
       res.status(200).json({message:'User has been deleted...'})
     }catch(error){
       next(error)
     }
     
}

const getUserListing=async(req,res,next)=>{
  
  if(req.user.id === req.params.id){
       try{
           const listings=await Listing.find({UserRef:req.params.id})
           res.status(200).json({listings: listings})
       }catch(error){
        next(error)
       }
  }else{
    return next(errorHandler(401,"you can only view your own listing!"))
  }

}

const getUser=async(req,res,next)=>{
  try{
 const user=await User.findById(req.params.id)

    if(!user) return next(errorHandler(404,"User not found"))

    const {password:pass, ...rest} =user._doc
    res.status(200).json(rest)
  }catch(error){
    next(error)
  }
   
}


module.exports={updateUser,deleteUser,getUserListing,getUser}

