const express =require('express')

const router=express.Router()

const {createListing,deleteListing,updateListing,getListing,getListingsForSearch} = require('../controller/listing.controller')
const { verifyToken } = require('../utils/verifyUser')

router.post('/create',verifyToken,createListing)
router.delete('/delete/:id',verifyToken,deleteListing)
router.patch('/update/:id',verifyToken,updateListing)
router.get('/getListing/:id',getListing)
router.get('/getListings',getListingsForSearch)

module.exports=router





