const {errorHandler} = require('./error')
const jwt =require('jsonwebtoken') 
 const verifyToken=(req,res,next)=>{
    console.log('verified')
    const token =req.cookies.access_token;
   
    if(!token) return next(errorHandler(401,'Unauthorized'))
    
    jwt.verify(token, process.env.JWT_SECRET,(error,user)=>{
        if(error) return next(errorHandler(403,'Forbidden'))
        req.user=user;
   
       next();
    })
  
}

module.exports={verifyToken}