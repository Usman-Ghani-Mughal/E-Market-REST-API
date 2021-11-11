module.exports = function () {
    let mysql = require('mysql2')

    const db_conn = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DATABASE
    });

    try{

        db_conn.connect((err) => {    
            if(err) throw err;
            console.log(`Data Base Connected!!!`);
        });
        
    }catch(err){
        console.error(err);
        process.exit(1);
    }

    //return connection object
    return db_conn;
}
