const Joi = require('@hapi/joi');


// Seller Register Validation
const sellerRegisterValidation = (data) =>{
    // set scheme for joi
    const validateSellerschema = Joi.object().keys({
        name: Joi.string().min(5).max(255).required(),
        email: Joi.string().required().email(),
        password: Joi.string().min(8).required(),
        shop_name: Joi.string().min(5).max(255).required(),
        shop_type: Joi.string().min(5).max(255).required(),
        city: Joi.string().min(3).max(255).required(),
        gender: Joi.string().min(3).required(),
        shop_details: Joi.string(),
        phone: Joi.string().min(10),
        address: Joi.string(),
        image_path: Joi.string()
        });    
    
    return validateSellerschema.validate(data);
}

// Seller Login Validation
const sellerLoginValidation = (data) =>{
    // set scheme for joi
    const validateSellerschema = Joi.object().keys({
        email_username: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(8).required()
        });    
    
    return validateSellerschema.validate(data);
}


// buyer Register Validation
const buyerRegisterValidation = (data) =>{
    // set scheme for joi
    const validateBuyerschema = Joi.object().keys({
        name: Joi.string().min(5).max(255).required(),
        email: Joi.string().required().email(),
        password: Joi.string().min(8).required(),
        city: Joi.string().min(3).max(255).required(),
        gender: Joi.string().min(3).required(),
        phone: Joi.string().min(9),
        address: Joi.string(),
        image_path: Joi.string()
        });    
    
    return validateBuyerschema.validate(data);
}

// buyer Login Validation
const buyerLoginValidation = (data) =>{
    // set scheme for joi
    const validatebuyerchema = Joi.object().keys({
        email_username: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(8).required()
        });
    
    return validatebuyerchema.validate(data);
}



// Seller Products Register Validation
const sellerProductRegisterValidation = (data) =>{
    // set scheme
    const validateSellerschema = Joi.object().keys({
        name: Joi.string().max(255).required(),
        type: Joi.string().max(255).required(),
        price : Joi.number().required(),
        quantity : Joi.number().required(),
        seller_id : Joi.number().required(),
        image_path: Joi.string()
        });    
    
    return validateSellerschema.validate(data);
}

// Order Place Validation
const orderPlaceValidation = (data) =>{
    // set scheme
    const validateOrderschema = Joi.object().keys({

        product_id: Joi.number().required(),
        seller_id: Joi.number().required(),
        buyer_id: Joi.number().required(),
        quantity: Joi.number().required(),
        amount: Joi.number().required()
        });    
    
    return validateOrderschema.validate(data);
}

 module.exports.sellerRegisterValidation = sellerRegisterValidation; 
 module.exports.sellerLoginValidation = sellerLoginValidation;

 module.exports.buyerRegisterValidation = buyerRegisterValidation; 
 module.exports.buyerLoginValidation = buyerLoginValidation;

 module.exports.sellerProductRegisterValidation = sellerProductRegisterValidation; 

 module.exports.orderPlaceValidation = orderPlaceValidation; 

