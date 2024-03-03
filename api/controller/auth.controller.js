const User=require('../model/user.model')
const bcrypt =require('bcryptjs');
const { errorHandler } = require('../utils/error');
const jwt =require('jsonwebtoken')

const signup=async(req,res,next)=>{
   
  const {username,email,password}=req.body;
  console.log(username,email,password)
  const hashedPassword=bcrypt.hashSync(password,10)
  const newUser=new User({username,email,password:hashedPassword})
  try{
      const savedUser=await newUser.save()
      res.status(201).json(savedUser);
  }catch(error){
    next(error)
  }
} 

const signin=async(req,res,next)=>{
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, 'User not found!'));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json({rest,token});
  } catch (error) {
    next(error);
  }
}

const google=async(req,res,next)=>{

  try{
    
    const user =await User.findOne({email:req.body.email})
   
    if(user){
       
      const token =jwt.sign({id:user._id},process.env.JWT_SECRET)
      console.log(token)
      const {password:Pass, ...rest}=user._doc
       res
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json({rest,token});
        console.log(req.cookies.access_token);
    }else{
      
        const generatedPassword=Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
        const hashedPassword= bcrypt.hashSync(generatedPassword,10)
        const newUser=new User({username:req.body.username,email:req.body.email, password:hashedPassword,  avatar:req.body.photo})
        await  newUser.save();
        const token =jwt.sign({id:newUser},process.env.JWT_SECRET)
        console.log(token)
        const {password:Pass, ...rest}=newUser._doc
          res.cookie('access_token',token,{httpOnly:true}).status(200).json({rest,token})
          console.log(req.cookies.access_token);
          
    }
  }catch(error){
    next(error)
  }
}

const signOut=async(req,res)=>{
  
  try{ 
       res.clearCookie('access_token');
       res.status(200).json('user has been logged out')
  }catch (error){
       next(error)
  }

}


module.exports={signup,signin,google,signOut}
//.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4)