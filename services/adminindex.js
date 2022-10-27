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

	searchnodecount: (params) => {   
        return new Promise((resolve, reject) => {

            try {
                const getsearch = params[0]
                const rowcount = params[1];
                const search = params[2];
            
    
                db.query(getsearch, [rowcount, search], (err, result)=>{
                        if (err) {
                            return reject('Error in db query: ' + err);
                        }
                        if (result.length != 0){
                                return resolve(result);     
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
        
    },

    searchnode: (params) => {   
        return new Promise((resolve, reject) => {

            try {
                const search = params[0]
                const searchby = params[1];
                const orderval = params[2];
                const order = params[3];
                const page = params[4];
                const rowcount = params[5];
                const startitem = params[6];
                const getsearch = "SELECT Id,purposeofapplication,givenName,surName,phoneNumberMobile,date,referralcode,refferalnumber,status,Underwriter FROM approval where "+searchby+" LIKE N? order by " + orderval+ " " + order + " LIMIT ?,?;"
                db.query(getsearch, [search,startitem,rowcount], (err, result)=>{
                    console.log(params)
                        if (err) {
                            return reject('Error in db query: ' + err);
                        }
                        if (result.length != 0){
                                return resolve(result);     
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