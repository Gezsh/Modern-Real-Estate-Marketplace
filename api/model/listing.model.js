const mongoose =require('mongoose')

const listingSchema = new mongoose.Schema({
    name : {
        type:String,
        required: true
    },
    description :{
        type:String,
        required :true,
    },
    address:{
        type:String,
        required:true,
    },
    regularPrice :{
        type :Number,
        required :true,
    },
    discountPrice :{
        type:Number,
        required:true,
    },
    bathrooms:{
        type:Number,
        required:true,
    },
    bedrooms:{
        type:Number,
        required :true,
    },
    furnished :{
        type:Boolean,
        required: true,
    },
    parking :{
        type:Boolean,
        required :true,
    },
    type :{
        type:String,
        required :true,
    },
    offer :{
        type:Boolean,
        required :true,
    },
    imageUrls :{
        type:Array,
        required: true,
    },
    UserRef :{
        type: String,
        required :true,
    }
},{timeStamp : true})



module.exports=mongoose.model('Listing',listingSchema)