const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");    //6th part c
const Review=require("../models/review.js");   //project phase 2 part a
const Listing=require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor}=require("../middleware.js");

const { createReview, destroyReview } = require("../controller/review.js");

const reviewcontroller=require("../controller/review.js");





  //for review
//   const validateReview=(req,res,next)=>{  proj 57 removed it and print in middleware
//      let {error} =reviewSchema.validate(req.body);
    
//     if(error){                             //2nd
//         let errMsg =error.details.map((el)=>el.message).join(",");
//         throw new ExpressError(400,errMsg);        //in 2nd try errMsg
//     }else{
//         next();
//     }
//  }


//review
  //post review route
  router.post("/",isLoggedIn,validateReview ,wrapAsync(reviewcontroller.createReview));


  //post delete route
  router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync (reviewcontroller.destroyReview));

  module.exports=router;