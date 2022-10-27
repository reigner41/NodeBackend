const db = require('../config/db')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const randomstring = require('randomstring');
module.exports = {
	postlogin : (params) => {   
        return new Promise((resolve, reject) => {
            try {
                const email = params[0]
                const password = params[1];
                const checkaccount = "SELECT * FROM users WHERE email=?"
                db.query(checkaccount, [email], (err, result)=>{
                    if (result.length != 0){
                        bcrypt.compare(password, result[0].password, (error, response) => {
                            if (response){
                                // Removed to be handled in web backend
                                // req.session.user = result
                                // return resolve(result[0]);
                                return resolve(result);
                            }
                            else{
                                return reject("Failed");
                            }
                        })
                        
                        
                    }
                    else{
                        return reject("Failed");
                    }
                })
                } catch (error) {
                    console.log('Error in DB prequalification Service: ', error);
                    return reject('Error in DB prequalification Service: ', error);
            }
        })
    }
}