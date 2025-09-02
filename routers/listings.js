const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema,reviewSchema}=require("../schema.js");    //6th part c
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");
const {isLoggedIn ,isOwner,validateListing}=require("../middleware.js");
const multer =require("multer");
const {storage} =require("../cloudconfig.js");
// const upload =multer({dest: 'uploads/'});  //due to clodinary
const upload =multer({storage});



const listingcontroller=require("../controller/listing.js");

//validation for schema [middleware]
//  const validateListing=(req,res,next)=>{  
//      let {error} =listingSchema.validate(req.body);
    
//     if(error){                             //2nd
//         let errMsg =error.details.map((el)=>el.message).join(",");
//         throw new ExpressError(400,errMsg);        //in 2nd try errMsg
//     }else{
//         next();
//     }
//  }
//removing  /listings

router.route("/")
//index route
  .get(wrapAsync (listingcontroller.index))
   //create route/adding
   .post(isLoggedIn ,  upload.single('listing[image]'), wrapAsync (listingcontroller.createListing) )     

    //  .post(upload.single('listing[image]'),(req,res)=>{    proj 58 
    //       res.send(req.file);
    //  })

// app.post("/listings",async (req,res)=>{
//     try{
//     // let {title .. ,..,.,.}=req.body;
//     // let listing =req.body.listing;
//    const newListing= new Listing(req.body.listing);
//    await newListing.save();
//     // console.log(listing)
//     res.redirect("/listings");}
//     catch(err){
//         next(err);
//     }
// })

      
// new
router.get("/new",isLoggedIn ,listingcontroller.renderNewForm);

router.route("/:id")
    //show route
    .get(wrapAsync (listingcontroller.showListing) )
    //update route
    .put(isLoggedIn ,isOwner,upload.single('listing[image]'),validateListing, wrapAsync (listingcontroller.updateListing))
    //delete
    .delete(isLoggedIn,isOwner ,wrapAsync (listingcontroller.destroyListing));

       




//edit route
router.get("/:id/edit",isLoggedIn,isOwner ,wrapAsync (listingcontroller.renderEditForm));

module.exports=router;
