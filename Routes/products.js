const router = require('express').Router();
const connectionRequest =  require('../config/database_config');

// seller Product reg validation
const {sellerProductRegisterValidation} = require('../Validations/validation');
const {sellerProductUpdateValidation} = require('../Validations/validation');

// for uploding files.
const upload = require("../Middleware/uploadimage");
const { uploadFile, getFileStream } = require('../Middleware/up_down_image_s3');
// deleting files
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);

// Register Route
router.post('/register', upload.single('image_path') ,async (req, res) => {
    try {
         // ----------------  Validate data -------------------
        const {error} = sellerProductRegisterValidation(req.body);
        if (error) return res.status(400).json({Success: 0, Error: error.details[0].message});

        connectDB = connectionRequest();
        // ----------------- Check if Product already register -----------------
        let find_query = `SELECT * FROM Products WHERE name = '${req.body.name}' AND seller_id =  '${req.body.seller_id}';`;

        connectDB.query(find_query, async (err, result) => {
            if(err){
                return res.status(400).json({Success: 0, Error: err.message});
            } 
            else if(result.length != 0){
                return res.status(400).json({Success: 0, Error: "Product Already Exists"});
            }
            else{
                
                // upload image to s3
                const file = req.file;
                const result_aws = await uploadFile(file);
                await unlinkFile(file.path);
                let file_link = `https://e-market-rest-api.herokuapp.com/images/get?key=${result_aws.key}`;

                let status = "ok";
                let reason = "";
                let description = req.body.description || "";

                // --------- For mysql today date.
                var isoDateString = new Date().toISOString();
                const isoDate = new Date(isoDateString);
                const today_date = isoDate.toJSON().slice(0, 19).replace('T', ' ');

                 // // ----------------- Register Product ------------------
                let reg_query = `INSERT INTO Products (name, type, price, quantity, description, seller_id, status, reason, publish_date, image_path) 
                                VALUES ( '${req.body.name}', '${req.body.type}', '${req.body.price}', '${req.body.quantity}', '${description}', 
                                         '${req.body.seller_id}', '${status}', '${reason}', '${today_date}', '${file_link}' ); `;

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
                            message: "Product created successfully",
                            product_id: result.insertId
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


router.get('/', (req, res) => {
    try{
        connectDB = connectionRequest();
        let find_query = `SELECT * FROM Products`;

        connectDB.query(find_query, (err, result) => {
            if (err) return res.status(400).json({Success: 0,Error: err.message});
    
            else if(result.length > 0){
                return res.status(200).json({Success:1, data: result});
            } 
    
            else{ res.status(400).json({Success: 0,Error: "no product found"});}
        } );
    }
    catch(err)
    {
        res.status(500).json({
            Success: 0,
            Error: err.message
        });
    }
});

router.get('/type', (req, res) => {
    try{
        //let find_query = `SELECT * FROM Orders WHERE buyer_id = '${req.query.id}';`;
         
        let find_query = `SELECT * FROM Products WHERE type = '${req.query.type}';`;

        connectDB = connectionRequest();
        connectDB.query(find_query, (err, result) => {
            if (err) return res.status(400).json({Success: 0,Error: err.message});

            else if(result.length > 0){
            return res.status(200).json({Success:1, data: result});
            }       

            else{ res.status(400).json({Success: 0,Error: "no product found"});}
        } );
    }
    catch(err)
    {
        res.status(400).json({
            Success: 0,
            Error: err.message,
        });
    }
});

// update products route
router.post('/updateproduct',async (req, res) => {
    try {
         // ----------------  Validate data -------------------
        const {error} = sellerProductUpdateValidation(req.body);
        if (error) return res.status(400).json({Success: 0, Error: error.details[0].message});

        connectDB = connectionRequest();
        // ----------------- Check if Products is present -----------------
        let find_query = `SELECT * FROM Products WHERE id = '${req.body.product_id}' AND seller_id =  '${req.body.seller_id}';`;

        connectDB.query(find_query, async (err, result) => {
            if(err){
                return res.status(400).json({Success: 0,Error: err.message});
            }
            else if(result.length !=0){
                result = result[0];
               
                // update value in Products table
                let update_query = `UPDATE Products SET name = '${req.body.name || result.name}',
                                                        type = '${req.body.type || result.type}',
                                                        price = '${req.body.price || result.price}',
                                                        quantity = '${req.body.quantity || result.quantity}',
                                                        description = '${req.body.description || result.description}'
                                                        
                                                        WHERE id = '${req.body.product_id}';`;

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
                return res.status(400).json({Success: 0,Error: "No Product Found"});
            }
            
        });
    } catch (err) {

        res.status(400).json({
            Success: 0,
            Error: err.message,
        });
    }
});


// update products route
router.post('/deleteproduct',async (req, res) => {
    try{
        connectDB = connectionRequest();
        // let find_query = `SELECT * FROM Products WHERE id = '${req.query.id}';`;
        let del_query = `DELETE FROM Products WHERE id = '${req.query.id}';`;

        connectDB.query(del_query, (err, result) => {
            if (err) return res.status(400).json({Success: 0,Error: err.message});
            else return res.status(200).json({Success:1, data: result});
        } );

    }catch(err)
    {
        res.status(400).json({
            Success: 0,
            Error: err.message,
        });
    }
});

module.exports = router;

module.exports = router;