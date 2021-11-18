const router = require('express').Router();
const connectionRequest =  require('../config/database_config');


//// seller reg and login validation
const {buyerRegisterValidation} = require('../Validations/validation');
const {buyerLoginValidation} = require('../Validations/validation');

const bcrypt = require('bcryptjs');
// const verifyToken = require('../Validation/verifyToken');
//const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();  

// Register Route
router.post('/register', async (req, res) => {
    try {
         // ----------------  Validate data -------------------
        const {error} = buyerRegisterValidation(req.body);
        if (error) return res.status(400).json({Success: 0, Error: error.details[0].message});

        connectDB = connectionRequest();
        // ----------------- Check if App already in DB ------------------
        let find_query = `SELECT * FROM Buyers WHERE email = '${req.body.email}' OR name = '${req.body.name}';`;
        connectDB.query(find_query, async (err, result) => {
            if(err) return res.status(400).json({Success: 0,Error: err.message});

            else if(result.length != 0)
            {
                return res.status(200).json({Success: 0,Error: "Username or Email Already Exists"});
            } 
            else
            {
                // ----------------- Hash the password ------------------
                const salt = await bcrypt.genSalt(parseInt(process.env.salt_number, 10));
                const hashpassword = await bcrypt.hash(req.body.password, salt);
                req.body.password = hashpassword;

                let status = "ok";
                let reason = "";
                
                let reg_query = `INSERT INTO Buyers (name, email, password, phone, address, city, status, gender, reason, image_path) 
                                 VALUES ('${req.body.name}', '${req.body.email}', '${req.body.password}', '${req.body.phone}',   
                                          '${req.body.address}', '${req.body.city}', '${status}', 
                                          '${req.body.gender}','${reason}','${req.body.image_path}');`;
                
                connectDB.query(reg_query, (err, result) => {
                if (err) return res.status(400).json({Success: 0, Error: err.message});

                else{
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

        res.status(500).json({
            Success: 0,
            Error: err.message,
        });
    }
});


// Login Route
router.post('/login', async  (req, res) => {

    try{

        // ----------------  Validate data ------------------------- //
        const {error} = buyerLoginValidation(req.body);
        if (error) return res.status(400).json({Success: 0, Error:  'Invalid Email or Password'});

        connectDB = connectionRequest();
        // ----------------- Check if email exists ------------------ //
        let find_query = `SELECT * FROM Buyers WHERE email = '${req.body.email_username}' OR name = '${req.body.email_username}';`;
        connectDB.query(find_query, async (err, result) => {
            if(err){return res.status(200).json({Success: 0,Error: err.message});}

            else if(result.length > 0){
                // ----------------- Check if password matched  ----- //
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
            else return res.status(400).json({Success: 0, Error: "Invalid Email or Password"});
        });

    }catch(err)
    {
        res.status(500).json({
            Success: 0,
            Error: err.message,
        });
    }
    
    
});


router.get('/profile', (req, res) => {

    try{

        let find_query = `SELECT * FROM Buyers WHERE id = '${req.query.id}';`;
        connectDB = connectionRequest();
        connectDB.query(find_query, (err, result) => {
            if (err) return res.status(400).json({Success: 0, Error: err.message});
            else if(result.length > 0)
            {
                result = result[0];
                user_profile = {
                    name : result.name,
                    email :  result.email,
                    phone : result.phone,
                    city : result.city,
                    gender : result.gender,
                    image_path : result.image_path,
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
        res.status(500).json({
            Success: 0,
            Error: err.message,
        });
    }

    
});


router.get('/orders', (req, res) => {
    try{
        let find_query = `SELECT * FROM Orders WHERE buyer_id = '${req.query.id}';`;
        connectDB = connectionRequest();
        connectDB.query(find_query, (err, result) => {
            if (err) return res.status(400).json({Success: 0,Error: err.message});

            else if(result.length > 0){
            return res.status(200).json({Success:1, data: result});
            }       

            else{ res.status(400).json({Success: 0,Error: "no order found"});}
        } );
    }
    catch(err)
    {
        res.status(500).json({
            Success: 0,
            Error: err.message,
        });
    }
});

module.exports = router;