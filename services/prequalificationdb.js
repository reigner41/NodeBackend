const db = require('../config/db')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const randomstring = require('randomstring');
module.exports = {
	contactinsert : (params) => {   
        return new Promise((resolve, reject) => {
            try {
                const email = params[0]
                const name = params[1];
                const phone = params[2];
                const refferal = params[3];
                const stat = params[4];
                const sql = "SELECT * FROM users WHERE email=?"
                const insertuser = "INSERT INTO users (email, name, phone, refferal_person, uuid,status) VALUES (?,?,?,?,?,?)"
                db.query(sql, [email], (err, result)=>{
                        if (err) {
                            return reject('Error in db query: ' + err);
                        }
                        else{
                            const sercrettoken = randomstring.generate();
                            db.query(insertuser, [email, name, phone, refferal,sercrettoken,stat], (err, result)=>{
                                if (err){
                                    return reject('Error in db query: ' + err);
                                }
                            });
                            const params = [email, sercrettoken];
                            return resolve({status: "success", params: params});
                        }
                    })
                } catch (error) {
                    console.log('Error in DB prequalification Service: ', error);
                    return reject('Error in DB prequalification Service: ', error);
            }
        })
    },
    forgotpassword : (params) => {   
        return new Promise((resolve, reject) => {
            try {
                const email = params[0]
                const checkemail = "SELECT * FROM users WHERE email=?"
                db.query(checkemail, [email], (err, result)=>{
                    if (result.length != 0){
                        const sercrettoken = randomstring.generate();
                        const updateuuid = "UPDATE users SET uuid = ? WHERE email=?"
                        db.query(updateuuid, [sercrettoken, email], (err, result)=>{
                            if(!err){
                                const params = [email, sercrettoken];
                                return resolve({status: "success", params: params});
                            }
                            })
                        
                    }
                })
                } catch (error) {
                    console.log('Error in DB prequalification Service: ', error);
                    return reject('Error in DB prequalification Service: ', error);
            }
        })
    },
    confirmuuid : (params) => {   
        return new Promise((resolve, reject) => {
            try {
                const uuid = params[0]
                const checkuuid = "SELECT * FROM users WHERE uuid=?"
                db.query(checkuuid, [uuid], (err, result)=>{
                    if (result.length != 0){
                        return resolve(result[0]);
                    }
                    else{
                        return resolve("failed");
                    }
                })
                } catch (error) {
                    console.log('Error in DB prequalification Service: ', error);
                    return reject('Error in DB prequalification Service: ', error);
            }
        })
    },
    newpassword : (params) => {   
        return new Promise((resolve, reject) => {
            try {
                const uuid = params[0]
                const password = params[1]
                bcrypt.hash(password, saltRounds, (err,hash) => {
                    const updatepassword = "UPDATE users SET password = ?, status = 1,uuid = null WHERE uuid=?"
                    db.query(updatepassword, [hash, uuid], (err, result)=>{
                        if(err === null){
                            return resolve("success");
                        }
                    })
        
                })
                } catch (error) {
                    console.log('Error in DB prequalification Service: ', error);
                    return reject('Error in DB prequalification Service: ', error);
            }
        })
    },
    checkemail : (params) => {   
        return new Promise((resolve, reject) => {
            try {
                const email = params[0]
                const checkaccount = "SELECT * FROM users WHERE email=?"
                db.query(checkaccount, [email], (err, result)=>{
                    if (result.length != 0){
                        return resolve(result[0]);
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
