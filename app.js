if(process.env.NODE_ENV !="production"){
        
require("dotenv").config();
}

console.log(process.env.SECRET)

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const MongoStore = require('connect-mongo');

const Listing=require("./models/listing.js");
const path=require("path")
const methodOverride=require("method-override");
const ejsmate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");    //6th part c
const Review=require("./models/review.js");   //project phase 2 part a
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User =require("./models/user.js");




// const mongo_url="mongodb://127.0.0.1:27017/wanderlust";
const dbUrl=process.env.ATLASDB_URL;

main().then((res)=>{
    console.log("connected to db");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);//mongo_url

}

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});
store.on("error",()=>{
    console.log("error in mongo session store",err);
})
const sessionOption={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,

    }
} 



app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
      res.locals.error=req.flash("error");
      res.locals.currUser=req.user;
    console.log(res.locals.success);
    next();
})

// app.get("/demouser",async (req,res)=>{
//     let fakeUser= new User({
//         email:"adnankhan",
//         username:"khanadnan",
//     });
//     let registeredUser=await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// })


const listingsRouter=require("./routers/listings.js");
const reviewsRouter=require("./routers/review.js");
const userRouter=require("./routers/user.js")


app.engine("ejs",ejsmate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));




//here add the matching part 
// app.use("/listings",listings);
app.use("/listings",listingsRouter);
    //yaha agar "/" root likha to dusra kuch karne ki zaroorat nahi but in this case 
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

app.get(("/testlisting"),wrapAsync ( async (req,res)=>{
      let sampleListing=new Listing({
        title:"bali",
        description:"massive house ever seen",
        price:2200,
        location:"goa",
        country:"india",
      });
      await sampleListing.save();
      console.log("sample was saved");
      res.send("successful testing");
}))

  

// app.get("/",(req,res)=>{
//     res.send("root page ");
// })
// app.all("/*", (req, res, next) => { //app.all
//     next(new ExpressError(404, "This page is not found"));
// });
app.use((req, res) => {
  res.status(402).render("error.ejs"); // or res.send("Page not found")
});

// app.all("*",(req,res,next)=>{
//     next( new ExpressError(404,"this page is not found"));
// })
// // app.use((err,req,res,next)=>{
// //     res.send("something went wrong")
// // })
// app.use((err,req,res,next)=>{
//     let {statusCode=500,message="something went wrong"}=err;
//     res.status(statusCode).send(message);
//     // res.status(statuscode).render("error.ejs",{message,statuscode}); //err
//    // res.render("error.ejs",{message});
// })


app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { statusCode, message });
});

app.listen((8080),()=>{
    console.log("listening to the port");
})