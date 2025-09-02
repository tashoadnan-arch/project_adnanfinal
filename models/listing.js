const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js")

const listingSchema=new Schema({
    title:{
        type:String,
            required:true,
    },

    description:String,
    // image:{
    //     type:String,
    //     default: 
    //     "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d",
    //     set: (v) =>v ===""
    //     ? "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d" 
    //     : v,

    // },
      image: { 
    url: String, 
    filename: String, 
  },
  //  image: {
  //   url: {
  //     type: String,
  //     default: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d",
  //     set: (v) =>
  //       v === "" 
  //         ? "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d"
  //         : v,
  //   },
  //   filename: {
  //     type: String,
  //     default: "listingimage",
  //   },
  // },

  //     image: {
  //   filename: {
  //     type: String,
  //     default: "listingimage",
  //   },
  //   url: {
  //     type: String,
  //     default:
  //       "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d",
  //     set: (v) =>
  //       v === ""
  //         ? "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d"
  //         : v,
  //   },
  // },
   // price:Number,
    price: {
  type: Number,
  required: true,
  default: 0
},

    location:String,
    country:String,
    reviews:[
      {
        type:Schema.Types.ObjectId,
        ref:"Review",
      }
    ],
    owner:{
      type:Schema.Types.ObjectId,
      ref:"User",
    },
    geometry:{
      type:{
        type:String,
        enum:['Point'],
        required:true,
      },
      coordinates:{
        type:[Number],
        required:true
      },
    },
    // category:{
    //   type:String,
    //   enum:["mountains","arctic","farms","deserts"];
    // }
});

listingSchema.post("findOneAndDelete",async (listing) =>{
  if (listing){
    await Review.deleteMany({_id :{ $in : listing.reviews }});
  }
})
const Listing=mongoose.model("listing",listingSchema);
module.exports=Listing;