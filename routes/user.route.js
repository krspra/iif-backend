const express=require('express')
const {Signup,Login,Logout,}=require('../controllers/user.controller')
const isAuthenticated=require('../middleware/isAuthenticated')

const router=express.Router();

router.post('/signup',Signup)
router.post('/login',Login)
router.get('/logout',Logout)
router.get('/checkauth',isAuthenticated)

module.exports=router;