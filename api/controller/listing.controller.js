const Listing=require('../model/listing.model')
const { errorHandler } = require('../utils/error')

const createListing=async(req,res,next)=>{
  console.log('create listing',req.body)
  try{
   const listing =await Listing.create(req.body)
   res.status(201).json(listing)
   console.log('listing',listing)
  }catch(error){
    console.error('Error creating listing:', error);
    next(error)
  }
}

const deleteListing=async(req,res,next)=>{
   const listing=await Listing.findById(req.params.id)

   if(!listing){
     return next(errorHandler(404,"listing is not found"))
   }

   if(req.user.id !==  listing.UserRef){
    return next(errorHandler(401,"you can only delete your own listings"))
   }

   try{
        await Listing.findByIdAndDelete(req.params.id)
        res.status(200).json("the list is successfully deleted")
   }catch(error){
    next(error)
   }
}

const updateListing=async(req,res,next)=>{
   const listing=await Listing.findById(req.params.id)
   if(!listing){
     return next(errorHandler(404,"Listing is not found!"))
   }

   if(req.user.id !== listing.UserRef){
     return next(errorHandler(401, "you can only update your own listings"))
   }

   try{
     const updatedListing=  await Listing.findByIdAndUpdate(req.params.id,{
        $set:{
          imageUrls : req.body.imageUrls,
          name: req.body.name,
          description: req.body.description,
          address: req.body.address,
          type: req.body.type,
          bedrooms:req.body.bedrooms,
          bathrooms: req.body.bathrooms,
          regularPrice: req.body.regularPrice,
          discountPrice: req.body.discountPrice,
          offer: req.body.offer,
          parking: req.body.parking,
          furnished: req.body.furnished
        }
       },{new:true})

       res.status(200).json(updatedListing)
   }catch(error){
       next(error)
   }

}

const getListing=async(req,res,next)=>{
    console.log("get listing")
  try{
     const listing=await Listing.findById(req.params.id)
     if(!listing) {
      return next(errorHandler(404,"listing not found!"))
     }
     res.status(200).json(listing)
     console.log(listing)
  }catch(error){
    next(error)
  }

}

const getListingsForSearch=async(req,res,next)=>{
  console.log('getlisting')
    try{
      const limit =parseInt(req.params.limit) || 9;
      const startIndex =parseInt(req.query.startIndex) || 0;
      let offer=req.query.offer 

       if(offer === undefined || offer === 'false'){
           offer={ $in: [false,true]};

       }

       let furnished =req.query.furnished;

       if(furnished === undefined || furnished === 'false'){
        furnished={ $in: [false,true]};
       }
        let parking=req.query.parking;

        if(parking === undefined || parking === 'false'){
          parking={ $in: [false,true]};
        }
    
        let type= req.query.type;

        if(type=== undefined || type==="all"){
          type ={$in: ['sale','rent']}
        }

        const searchTerm =req.query.searchTerm || '';
        const sort= req.query.sort || 'createdAt';

        const order =req.query.order || 'desc'

        const listings=await Listing.find({
          name: { $regex : searchTerm, $options : 'i'},
          offer,
          furnished,
          parking,
          type
        }).sort(
          {[sort]:order}
        ).limit(limit).skip(startIndex)
        
        return res.status(200).json(listings)
        
    }catch(error){
      next(error)
    }

  } 

module.exports={createListing,deleteListing,updateListing,getListing,getListingsForSearch}