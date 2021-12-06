const Joi = require('@hapi/joi');


// Seller Register Validation
const sellerRegisterValidation = (data) =>{
    // set scheme for joi
    const validateSellerschema = Joi.object().keys({
        cnic: Joi.string().min(15).max(15).required(),
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

// Seller update profile
const sellerUpdateProfileValidation = (data) =>{
    // set scheme for joi
    const validateSellerschema = Joi.object().keys({
        seller_id: Joi.number().required(),
        name: Joi.string().min(5).max(255),
        email: Joi.string(),
        password: Joi.string().min(8),
        shop_name: Joi.string().min(5).max(255),
        shop_type: Joi.string().min(5).max(255),
        city: Joi.string().min(3).max(255),
        gender: Joi.string().min(3),
        shop_details: Joi.string(),
        phone: Joi.string().min(10),
        address: Joi.string(),
        image_path: Joi.string(),
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

// buyer update profile
const buyerUpdateProfileValidation = (data) =>{
    // set scheme for joi
    const validateBuyerschema = Joi.object().keys({
        buyer_id: Joi.number().required(),
        name: Joi.string().min(5).max(255),
        email: Joi.string(),
        password: Joi.string().min(8),
        city: Joi.string().min(3).max(255),
        gender: Joi.string().min(3),
        phone: Joi.string().min(10),
        address: Joi.string(),
        image_path: Joi.string(),
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
        image_path: Joi.string(),
        description: Joi.string()
        });    
    
    return validateSellerschema.validate(data);
}

// Seller Products update 
const sellerProductUpdateValidation = (data) =>{
    // set scheme
    const validateSellerschema = Joi.object().keys({
        
        seller_id: Joi.number().required(),
        product_id: Joi.number().required(),
        name: Joi.string().max(255),
        type: Joi.string().max(255),
        price : Joi.number(),
        quantity : Joi.number(),
        description: Joi.string()

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
        amount: Joi.number().required(),
        order_description: Joi.string()
        });    
    
    return validateOrderschema.validate(data);
}

 module.exports.sellerRegisterValidation = sellerRegisterValidation; 
 module.exports.sellerLoginValidation = sellerLoginValidation;
 module.exports.sellerUpdateProfileValidation = sellerUpdateProfileValidation;

 

 module.exports.buyerRegisterValidation = buyerRegisterValidation; 
 module.exports.buyerLoginValidation = buyerLoginValidation;
 module.exports.buyerUpdateProfileValidation = buyerUpdateProfileValidation;
 

 module.exports.sellerProductRegisterValidation = sellerProductRegisterValidation; 
 module.exports.sellerProductUpdateValidation = sellerProductUpdateValidation; 

 module.exports.orderPlaceValidation = orderPlaceValidation; 

