const router = require('express').Router();
const connectionRequest =  require('../config/database_config');



// const verifyToken = require('../Validation/verifyToken');
//const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');
// dotenv.config();  

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