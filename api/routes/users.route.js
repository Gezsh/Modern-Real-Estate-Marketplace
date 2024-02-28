const express=require("express");

const router=express.Router();
const {updateUser,deleteUser,getUserListing,getUser}=require("../controller/user.comtroller");
const { verifyToken } = require("../utils/verifyUser");

router.patch('/update/:id',verifyToken,updateUser)
router.delete('/delete/:id',verifyToken,deleteUser)
router.get('/listing/:id',verifyToken,getUserListing)
router.get('/:id',verifyToken,getUser)
module.exports = router;