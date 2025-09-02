const express=require("express");
const router=express.Router();//{mergeParams:true} dont need
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport=require("passport");
const {saveRedirectUrl} =require("../middleware.js")

const usercontroller=require("../controller/users.js");

   router.route("/signup")
        .get( usercontroller.renderSignupForm)

        .post(wrapAsync ( usercontroller.signup  )
);


router.route("/login")
        .get(usercontroller.renderLoginForm)
//post
    .post(
    saveRedirectUrl,
    passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:"true",
}), usercontroller.login)

//loggedout
router.get("/logout",usercontroller.logout)

module.exports=router;
