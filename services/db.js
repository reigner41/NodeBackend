const mysql = require('mysql2');

const db = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database:  process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = {

	adminlogin: (params) => {   
        return new Promise((resolve, reject) => {

            try {
                const username = params[0]
                const password = params[1];
                
                const sql = "SELECT * FROM admintbl WHERE username=?";
    
                db.query(sql, [username], (err, result)=>{
    
                        if (err) {
                            return reject('Error in db query: ' + err);
                        }
    
                        if (result.length != 0){
                            if (result[0].password === password){
                                return resolve(result[0]);
                            }
                            else{
                                return reject('Failed');
                            }     
                        }
                        else{
                            return reject('Failed');
                        }
                    })
                } catch (error) {
                    console.log('Error in DB Service: ', error);
                    return reject('Error in DB Service: ', error);
            }

        })
        
    }
    

}