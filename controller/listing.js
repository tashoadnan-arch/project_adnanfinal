const Listing =require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken =process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index= async (req,res)=>{
   const allListings =await Listing.find({});
   res.render("listings/index.ejs",{allListings});
};


module.exports.renderNewForm =(req,res)=>{
    // console.log(req.user);
   
    res.render("listings/new.ejs")
}


module.exports.showListing =(async (req,res)=>{
    let {id}=req.params;
    // const listing=await Listing.findById(id).populate("reviews").populate("owner"); //proj 57
      const listing=await Listing.findById(id)
      .populate({
        path:"reviews" ,
        populate:{
             path:"author",
        },}).populate("owner");
    if(!listing){
        req.flash("error","listing you requested for does not exist!");
        return  res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing})
})


module.exports.createListing =async (req,res,next)=>{

      let  response=await  geocodingClient.forwardGeocode({
            query:req.body.listing.location,
            limit:1,
        })
        .send()
        // console.log(response.body.features[0].geometry);
        // res.send("done!");
       


    let url =req.file.path;
    let filename =req.file.filename;
    // console.log(url ,"..",filename); //58
    // if(!req.body.listing){
    //     throw new ExpressError(404,"send valid data for listing") //5thcustom error
    // }            ...................
    // let result =listingSchema.validate(req.body);            in 6th
    // console.log(result);
    // if(result.error){                        
    //     throw new ExpressError(400,result.error);
    // }               ..................

   const newListing= new Listing(req.body.listing); //in 58 blur

//    if(!newListing.title){                        error.ejs 5th
//     throw new ExpressError(400,"title is missing");
//    }
//    if(!newListing.description){
//     throw new ExpressError(400,"title is missing");
//    }
//    if(!newListing.price){
//     throw new ExpressError(400,"title is missing");
//    }
//    if(!newListing.location){
//     throw new ExpressError(400,"title is missing");
//    }

console.log(req.user); //57  //in 58 it blur
  newListing.owner =req.user._id; //pro 57
  newListing.image={url,filename};
 newListing.geometry= response.body.features[0].geometry;


   let savedListing =await newListing.save(); 
   console.log(savedListing);
   req.flash("success","new listing has added");
    res.redirect("/listings");
}

module.exports.renderEditForm =async (req,res)=>{
 let {id}=req.params;
    const listing=await Listing.findById(id);
        if(!listing){
        req.flash("error","listing you requested for does not exist!");
        return res.redirect("/listings");
      }
        //59 
        let originalImageUrl=listing.image.url;
         originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs",{listing ,originalImageUrl})
}

module.exports.updateListing =async (req,res)=>{
    //if(!req.body.listing){                  //validate laya to if ki zaroorat nahi padegi
    //throw new ExpressError(400,"send valid data");
    //}
     let {id}=req.params;
    //  let listing =await Listing.findById(id);            //57
    //   if(!listing.owner.equals(res.locals.currUser._id)){
    //     req.flash("error","you dont have permission to eddit");
    //       return  res.redirect(`/listings/${id}`);
    //   }
        //  await Listing.findByIdAndUpdate(// chatgpt se img issue ka masla hal proj 7
        //  id,
        //  { $set: req.body.listing },
        //  { runValidators: true, new: true }
        //   )  ;
       let listing =await Listing.findByIdAndUpdate(id,{...req.body.listing});
        if(typeof req.file !== "undefined"){
            let url =req.file.path;
            let filename =req.file.filename;
            listing.image={url,filename};
            await listing.save();

        }
     
        req.flash("success","new listing has updated"); 

    //  res.redirect("/listings");
     res.redirect(`/listings/${id}`);
}

module.exports.destroyListing =async (req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
       req.flash("success","listing deleted");

    res.redirect("/listings");
}