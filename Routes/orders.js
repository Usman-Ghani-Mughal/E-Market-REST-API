const router = require('express').Router();
const connectionRequest =  require('../config/database_config');

// seller Product reg validation
const {orderPlaceValidation} = require('../Validations/validation');


// const verifyToken = require('../Validation/verifyToken');
//const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');
// dotenv.config();  

// Register Route
router.post('/place', async (req, res) => {
    try {
         // ----------------  Validate data -------------------
        const {error} = orderPlaceValidation(req.body);
        if (error) return res.status(400).json({Success: 0, Error: error.details[0].message});

        connectDB = connectionRequest();

        // ----- check if buyer id is valid -------
        let find_query_bid = `SELECT * FROM Buyers WHERE id = '${req.body.buyer_id}' ;`;

        connectDB.query(find_query_bid, async(err, result) => {
            if(err){ 
                return res.status(400).json({Success: 0, Error: err.message}); 
            } 
            else if(result.length == 0){
                return res.status(400).json({Success: 0, Error: "Buyer Id is not valid"});
            }
            else
            {
                // ----------------- Check if Product id and seller id is valid -----------------
                let find_query_ps = `SELECT * FROM Products WHERE id = '${req.body.product_id}' AND seller_id =  '${req.body.seller_id}';`;
                
                connectDB.query(find_query_ps, async (err, result) => {
                    if(err){
                        return res.status(400).json({Success: 0, Error: err.message});
                    } 
                    else if(result.length == 0){
                        return res.status(400).json({Success: 0, Error: "Product Id or sller Id is not valid"});
                    }
                    else{
                        // --- check if price and quantity is valid
                        result = result[0];
                        let actual_price = result.price * req.body.quantity;
                        
                        console.log(actual_price);
                        console.log(req.body.amount);

                        if (actual_price == req.body.amount && result.quantity >= req.body.quantity)
                        {
                            // update value in products table
                            let update_query = `UPDATE Products SET  quantity = '${result.quantity - req.body.quantity}' WHERE id = '${req.body.product_id}';`;

                            connectDB.query(update_query, async (err, result) => {
                                if(err){
                                    return res.status(400).json({Success: 0, Error: err.message});
                                }
                                else if(result.affectedRows == 0){
                                    return res.status(400).json({Success: 0, Error: "Something went wrong"});
                                }
                                else{

                                    let order_description = req.body.order_description || "";
                                    // --------- For mysql today date.
                                    var isoDateString = new Date().toISOString();
                                    const isoDate = new Date(isoDateString);
                                    const today_date = isoDate.toJSON().slice(0, 19).replace('T', ' ');

                                    let status = "ok";
                                    let reason = "";

                                    // // ----------------- place order  ------------------
                                    let reg_query = `INSERT INTO Orders (product_id, seller_id, buyer_id, quantity, amount, order_description, order_date, status, reason) 
                                    VALUES ( '${req.body.product_id}', '${req.body.seller_id}', '${req.body.buyer_id}', '${req.body.quantity}', '${req.body.amount}', 
                                    '${order_description}', '${today_date}', '${status}', '${reason}'); `;

                                    connectDB.query(reg_query, (err, result) => {
                                        if (err){
                                            return res.status(400).json({Success: 0,Error: err.message});
                                        }else
                                        {
                                            return res.status(200).json({
                                                Success: 1,
                                                message: "order created successfully",
                                                product_id: result.insertId
                                            });
                                        }
                                    });

                                }
                            });
                        }
                        else{
                            return res.status(400).json({Success: 0, Error: "Price or quantity is invalid"});
                        }
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
        let find_query = `SELECT * FROM Orders`;

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
            Error: err.message
        });
    }
});


router.get('/:id', (req, res) => {
    try{

        connectDB = connectionRequest();
        let find_query = `SELECT * FROM Orders WHERE id = '${req.parms.id}';`;

        connectDB.query(find_query, (err, result) => {
            if (err) return res.status(400).json({Success: 0,Error: err.message});
    
            else if(result.length > 0){
                return res.status(200).json({Success:1, data: result});
            } 
    
            else{ res.status(400).json({Success: 0,Error: "no order found"});}
        } );

    }catch(err){
        res.status(500).json({
            Success: 0,
            Error: err.message
        });
    }
});




module.exports = router;