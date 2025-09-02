const Joi = require('joi');

module.exports.listingSchema=Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description: Joi.string().required(),
        location :Joi.string().required(),
        country :Joi.string().required(),
        price :Joi.number().required().min(0),
        image:Joi.string().allow("",null)
    //       image: Joi.object({
    //       url: Joi.string().uri().allow("", null),   // url is string
    //       filename: Joi.string().allow("", null)     // filename is string
    // }).optional()
    // image: Joi.object({
    // url: Joi.string().uri().empty("").optional(),
    // filename: Joi.string().empty("").optional()
    // }).optional()


    }).required(),
    
})


// const listingSchema=Joi.object({
//     listing:Joi.object({
//         title:Joi.string().required(),
//         description: Joi.string().required(),
//         location :Joi.string().required(),
//         country :Joi.string().required(),
//         price :Joi.number().required().min(0),
//         image:Joi.string().allow("",null)

//     }).required(),
    
// })

module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required(),
    }).required(),
      


});

