const Listing =require("./models/listing");
const Review =require("./models/review");

const {listingSchema,reviewSchema}=require("./schema.js");    //6th part c
const ExpressError=require("./utils/ExpressError.js");
module.exports.isLoggedIn=(req,res,next)=>{
    console.log(req.user);//req.path,"..",req.originalUrl);
     if(!req.isAuthenticated()){
        req.session.redirectUrl= req.originalUrl;
        req.flash("error","you must be logged in to create listings");
         return res.redirect("/login")
    }
    next();
}

module.exports.saveRedirectUrl =(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner= async (req,res,next)=>{
       let {id}=req.params;
     let listing =await Listing.findById(id);  //57
      if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","you are not the owner of the list");
          return  res.redirect(`/listings/${id}`);
      }
      next();
}

 module.exports.validateListing=(req,res,next)=>{
     let {error} =listingSchema.validate(req.body);
    
    if(error){                             //2nd
        let errMsg =error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);        //in 2nd try errMsg
    }else{
        next();
    }
 }

  module.exports.validateReview=(req,res,next)=>{
     let {error} =reviewSchema.validate(req.body);
    
    if(error){                             //2nd
        let errMsg =error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);        //in 2nd try errMsg
    }else{
        next();
    }
 }

 module.exports.isReviewAuthor= async (req,res,next)=>{
       let {id,reviewId}=req.params;
     let review =await Review.findById(reviewId);  //57
      if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","you are not the owner of the review");
          return  res.redirect(`/listings/${id}`);
      }
      next();
}