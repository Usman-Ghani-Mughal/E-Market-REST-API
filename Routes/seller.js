const router = require('express').Router();
const connectionRequest =  require('../config/database_config');

//// seller reg and login validation
const {sellerRegisterValidation} = require('../Validations/validation');
const {sellerLoginValidation} = require('../Validations/validation');
const {sellerUpdateProfileValidation} = require('../Validations/validation');


const bcrypt = require('bcryptjs');
// const verifyToken = require('../Validation/verifyToken');
//const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const verifyToken = require('../Validations/verifyToken');
dotenv.config();
// for uploding files.
const upload = require("../Middleware/uploadimage");



// Register Route
router.post('/register', upload.single('image_path') ,async (req, res) => {
    try {
         // ----------------  Validate data -------------------
        const {error} = sellerRegisterValidation(req.body);
        if (error) return res.status(400).json({Success: 0, Error: error.details[0].message});

        connectDB = connectionRequest();
        // ----------------- Check if Seller already register -----------------
        let find_query = `SELECT * FROM Sellers WHERE email = '${req.body.email}' OR name =  '${req.body.name} OR CNIC =  '${req.body.cnic}';`;

        connectDB.query(find_query, async (err, result) => {
            if(err){
                return res.status(400).json({Success: 0,Error: err.message});
            } 
            else if(result.length != 0){
                return res.status(400).json({Success: 0,Error: "User Already Exists"});
            }
            else{
                // ----------------- Hash the password ------------------
                const salt = await bcrypt.genSalt(parseInt(process.env.salt_number, 10));
                const hashpassword = await bcrypt.hash(req.body.password, salt);
                req.body.password = hashpassword;

                let status = "ok";
                let reason = "";

                 // // ----------------- Register seller ------------------
                let reg_query = `INSERT INTO Sellers (CNIC, name, email, password, phone, shop_name, shop_type, shop_details, address, city, gender, image_path, status, reason) 
                                VALUES ( '${req.body.cnic}', '${req.body.name}', '${req.body.email}', '${req.body.password}', '${req.body.phone}', 
                                        '${req.body.shop_name}', '${req.body.shop_type}', '${req.body.shop_details}', 
                                        '${req.body.address}', '${req.body.city}', '${req.body.gender}', '${"https://e-market-rest-api.herokuapp.com/" + req.file.path}', 
                                        '${status}', '${reason}'); `;

                connectDB.query(reg_query, (err, result) => {
                    if (err)
                    {
                        return res.status(400).json({
                            Success: 0,
                            Error: err.message
                        });
                    }else
                    {
                        return res.status(200).json({
                            Success: 1,
                            message: "user created successfully",
                            user_id: result.insertId
                        });
                    }
                });
            }
        });
    } catch (err) {

        res.status(400).json({
            Success: 0,
            Error: err.message,
        });
    }
});


// Login Route
router.post('/login', async  (req, res) => {
    try{
        // ----------------  Validate data ------------------------- //
        const {error} = sellerLoginValidation(req.body);
        if (error) return res.status(400).json({Success: 0, Error:  'Invalid Email or Password'});

        connectDB = connectionRequest();
        // ----------------- Check if email exists ------------------ //
        let find_query = `SELECT * FROM Sellers WHERE email = '${req.body.email_username}' OR name = '${req.body.email_username}';`;
        connectDB.query(find_query, async (err, result) => {
            if(err){return res.status(200).json({Success: 0,Error: err.message});}

            else if(result.length > 0){
                // ----------------- Check if password matched  ------ //
                result = result[0];
                const validpass = await bcrypt.compare(req.body.password, result.password);
                if (!validpass) return res.status(400).json( {Success: 0, Error: 'Invalid Email or Password'});
                else{
                    // user info is matched
                    res.status(200).json({
                    Success:1,
                    description: "Successfuly login",
                    user_details: {
                        id : result.id,
                        name: result.name
                        }
                    });
                }
            }
            else return res.status(400).json({Success: 0,Error: "Invalid Email or Password"});
        });

    }catch(err)
    {
        res.status(400).json({
            Success: 0,
            Error: err.message,
        });
    }
    
});


router.get('/profile', (req, res) => {

    try{

        connectDB = connectionRequest();
        let find_query = `SELECT * FROM Sellers WHERE id = '${req.query.id}';`;

        connectDB.query(find_query, (err, result) => {
            if (err) return res.status(400).json({Success: 0,Error: err.message});
            else if(result.length > 0)
            {
                result = result[0];
                user_profile = {
                    name : result.name,
                    email :  result.email,
                    phone : result.phone,
                    shop_name : result.shop_name,
                    shop_type : result.shop_type,
                    city : result.city,
                    gender : result.gender,
                    image_path : result.image_path,
                    shop_details : result.shop_details,
                    address : result.address
                }
                return res.status(200).json({
                    Success:1,
                    data: user_profile
                });
            }
            else{ res.status(400).json({Success: 0,Error: "user not found"});}
        } );

    }catch(err)
    {
        res.status(400).json({
            Success: 0,
            Error: err.message,
        });
    }

    

});


router.get('/products', (req, res) => {

    try{

        connectDB = connectionRequest();
        let find_query = `SELECT * FROM Products WHERE seller_id = '${req.query.id}';`;

        connectDB.query(find_query, (err, result) => {
            if (err) return res.status(400).json({Success: 0,Error: err.message});
            else if(result.length > 0)
            {
                return res.status(200).json({
                    Success:1,
                    data: result
                });
            }
            else{ res.status(400).json({Success: 0,Error: "product not found"});}
        } );

    }catch(err)
    {
        res.status(400).json({
            Success: 0,
            Error: err.message,
        });
    }

    

});


router.get('/orders', (req, res) => {
    try{

        connectDB = connectionRequest();
        let find_query = `SELECT * FROM Orders WHERE seller_id = '${req.query.id}';`;

        connectDB.query(find_query, (err, result) => {
            if (err) return res.status(400).json({Success: 0,Error: err.message});

            else if(result.length > 0){
                return res.status(200).json({Success:1, data: result});
            } 

            else{ res.status(400).json({Success: 0,Error: "no order found"});}
        } );

    }catch(err)
    {
        res.status(400).json({
            Success: 0,
            Error: err.message,
        });
    }
    
});


// update profile route
router.post('/updateprofile',async (req, res) => {
    try {
         // ----------------  Validate data -------------------
        const {error} = sellerUpdateProfileValidation(req.body);
        if (error) return res.status(400).json({Success: 0, Error: error.details[0].message});

        connectDB = connectionRequest();
        // ----------------- Check if Seller already register -----------------
        let find_query = `SELECT * FROM Sellers WHERE id = '${req.body.seller_id}';`;

        connectDB.query(find_query, async (err, result) => {
            if(err){
                return res.status(400).json({Success: 0,Error: err.message});
            }
            else if(result.length !=0){
                result = result[0];
                let new_password = "";
                if (req.body.password){
                    // ----------------- Hash the password ------------------
                    const salt = await bcrypt.genSalt(parseInt(process.env.salt_number, 10));
                    const hashpassword = await bcrypt.hash(req.body.password, salt);
                    req.body.password = hashpassword;
                    new_password = req.body.password;
                }else{
                    new_password = result.password;
                }
                // update value in Seller table
                let update_query = `UPDATE Sellers SET  name = '${req.body.name || result.name}',
                                                        email = '${req.body.email || result.email}',
                                                        password = '${new_password}',
                                                        shop_name = '${req.body.shop_name || result.shop_name}',
                                                        shop_type = '${req.body.shop_type || result.shop_type}',
                                                        city = '${req.body.city || result.city}',
                                                        gender = '${req.body.gender || result.gender}',
                                                        shop_details = '${req.body.shop_details || result.shop_details}',
                                                        phone = '${req.body.phone || result.phone}',
                                                        address = '${req.body.address || result.address}',
                                                        image_path = '${result.image_path}'

                                                        WHERE id = '${req.body.seller_id}';`;

                connectDB.query(update_query, (err, result) => {
                    if (err){
                        return res.status(400).json({Success: 0, Error: err.message});
                    }
                    else if(result.affectedRows == 0){
                        return res.status(400).json({Success: 0, Error: "Something went wrong"});
                    }
                    else{
                        return res.status(200).json({
                            Success: 1,
                            message: "updated successfully"
                        });
                    }
                });
                
            }else{
                return res.status(400).json({Success: 0,Error: "No Seller Found"});
            }
            
        });
    } catch (err) {

        res.status(400).json({
            Success: 0,
            Error: err.message,
        });
    }
});


module.exports = router;


