const User=require("../models/user")
module.exports.renderSignupForm=(req,res)=>{
    // res.send("form")
    res.render("users/signup.ejs");
}

module.exports.signup  =async (req,res)=>{
    try{
     let{username ,email ,password} =req.body;
     const newUser = new User ({email,username});
    const registeredUser=  await User.register (newUser,password);
    console.log(registeredUser);
    req.login(registeredUser ,(err)=>{
        if(err){
            return next(err);
        }
            req.flash("success","welcome to wanderlust");
    res.redirect("/listings");
    })
    // req.flash("success","welcome to wanderlust");
    // res.redirect("/listings");
    }
    catch(e){
        req.flash("error" , e.message);
        res.redirect("/signup");
    }
  }

  module.exports.renderLoginForm =(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login= async (req,res)=>{
        // res.send("weelcome to wonderlust you are logged in");
        req.flash("success","welcome back to wanderlust");
        const redirectUrl =res.locals.redirectUrl || "/listings" ;  //sometime dowsnot work
            //  const redirectUrl = req.session.returnTo || "/listings"; // 👈 fallback
    //   delete req.session.returnTo;
        res.redirect(redirectUrl)//"/listings"  //req.session.redirectUrl  //res.locals. newly remove

}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out now");
        res.redirect("/listings");
    })
}