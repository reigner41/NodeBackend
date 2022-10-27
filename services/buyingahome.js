
const db = require('../config/db')
module.exports = {
	buyinghome : (params) => {   
        return new Promise((resolve, reject) => {
            try {
                const email = params[0]
                const dbquery = "SELECT * FROM buyinghome WHERE email=?"
                db.query(dbquery, [email], (err, result)=>{
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
    },
	plantobuy : (params) => {   
        return new Promise((resolve, reject) => {
            try {
                const plantobuy = params[0]
                const email = params[1];
                const dbquery = "UPDATE users SET whentobuy = ? WHERE email=?"
                db.query(dbquery, [plantobuy, email], (err, result)=>{
        
                    if(!err){
                        return resolve("success");
                    }
                })
                } catch (error) {
                    console.log('Error in DB prequalification Service: ', error);
                    return reject('Error in DB prequalification Service: ', error);
            }
        })
    },
	province : (params) => {   
        return new Promise((resolve, reject) => {
            try {
                const province = params[0]
                const email = params[1];
                const dbquery = "UPDATE users SET province = ? WHERE email=?"
                db.query(dbquery, [province, email], (err, result)=>{
        
                    if(!err){
                        return resolve("success");
                    }
                })
                } catch (error) {
                    console.log('Error in DB prequalification Service: ', error);
                    return reject('Error in DB prequalification Service: ', error);
            }
        })
    },
	realtor : (params) => {   
        return new Promise((resolve, reject) => {
            try {
                const realtor = params[0]
                const email = params[1];
                const dbquery = "UPDATE users SET realtor = ? WHERE email=?"
                db.query(dbquery, [realtor, email], (err, result)=>{
        
                    if(err === null){
                        return resolve("success");
                    }
                })
                } catch (error) {
                    console.log('Error in DB prequalification Service: ', error);
                    return reject('Error in DB prequalification Service: ', error);
            }
        })
    },
	updateammortyears : (params) => {   
        return new Promise((resolve, reject) => {
            try {
                const ammortyears = params[0]
                const email = params[1];
                const dbquery = "UPDATE users SET ammortyears = ? WHERE email=?"
                db.query(dbquery, [ammortyears, email], (err, result)=>{
        
                    if(err === null){
                        return res.json("success");
                    }
                })
                } catch (error) {
                    console.log('Error in DB prequalification Service: ', error);
                    return reject('Error in DB prequalification Service: ', error);
            }
        })
    },
	annual : (params) => {   
        return new Promise((resolve, reject) => {
            try {
                const annualincome = params[0]
                const email = params[1];
                const dbquery = "SELECT * FROM buyinghome WHERE email=?"
                db.query(dbquery, [email], (err, result)=>{
                    if (result.length != 0){
                        const updatebuyingahome = "UPDATE buyinghome SET annualincome = ?, date = 'Incomeplete' WHERE email=?"
                        db.query(updatebuyingahome, [annualincome, email], (err, result)=>{
                            if(!err){
                                return resolve("success");
                            }
                        })
                    }
                    else{
                        const insertintobuyingahome = "INSERT INTO buyinghome (email, annualincome, date) VALUES (?,?,?)"
                        db.query(insertintobuyingahome, [email, annualincome, 'Incomeplete'], (err, result)=>{
                        return resolve("success");
                        });
                    }
                })
                } catch (error) {
                    console.log('Error in DB prequalification Service: ', error);
                    return reject('Error in DB prequalification Service: ', error);
            }
        })
    },
	coapplicant : (params) => {   
        return new Promise((resolve, reject) => {
            try {
                const coapplicant = params[0]
                const email = params[1];
                const dbquery = "UPDATE buyinghome SET coapplicant = ? WHERE email=?"
                db.query(dbquery, [coapplicant, email], (err, result)=>{
                    if(!err){
                            return resolve("success");
                        }
                    })
                } catch (error) {
                    console.log('Error in DB prequalification Service: ', error);
                    return reject('Error in DB prequalification Service: ', error);
            }
        })
    },
	coapplicantnames : (params) => {   
        return new Promise((resolve, reject) => {
            try {
                const coapplicant = params[0]
                const email = params[1];
                let errs = null
                for(let coapps of coapplicant) {
                    const insertuser = "INSERT INTO coapplicants (email, coapplicantsname, coannualincome) VALUES (?,?,?)"
                    db.query(insertuser, [email, coapps.Name, coapps.AnnualIncome], (err, result)=>{
                        errs = err
                    });
                }
                if (!errs){
                    return resolve("success");
                }  
                } catch (error) {
                    console.log('Error in DB prequalification Service: ', error);
                    return reject('Error in DB prequalification Service: ', error);
            }
        })
    },
	checkcoapplicants : (params) => {   
        return new Promise((resolve, reject) => {
            try {
                const email = params[0];
                const checkaccount = "SELECT * FROM coapplicants WHERE email=?"
                db.query(checkaccount, [email], (err, result)=>{
                    if (result.length != 0){
                        return res.json(result);
                    }
                    else{
                        return res.json("Failed");
                    }
                })
                } catch (error) {
                    console.log('Error in DB prequalification Service: ', error);
                    return reject('Error in DB prequalification Service: ', error);
            }
        })
    },
	savemonthlywithcoapplicants : (params) => {   
        return new Promise((resolve, reject) => {
            try {
                const email = params[0];
                const propertytax = params[1]
                const condofees = params[2]
                const heatingcost = params[3]
                const coapplicantarray = params[4]
                let errs = null
                const updateapplicant = "UPDATE buyinghome SET propertytax= ?, condofees=?, heatingcost=? WHERE email=?"
                db.query(updateapplicant, [propertytax,condofees,heatingcost, email], (err, result)=>{
                    errs = err
                })
                for(let coapps of coapplicantarray) {
                    const insertuser = "UPDATE coapplicants SET copropertytax= ?, cocondofees=?, coheatingcost=? WHERE email=? AND coapplicantsname=?"
                    db.query(insertuser, [coapps.copropertytax, coapps.cocondofees,coapps.coheatingcost,coapps.email,coapps.coapplicantsname], (err, result)=>{
                        errs = err
                    });
                }
                if (!errs){
                    return resolve("success");
                }
                } catch (error) {
                    console.log('Error in DB prequalification Service: ', error);
                    return reject('Error in DB prequalification Service: ', error);
            }
        })
    },
	checkcreditcard : (params) => {   
        return new Promise((resolve, reject) => {
            try {
                const name = params[0];
                const dbquery = "SELECT * FROM creditcard WHERE name=?"
                db.query(dbquery, [name], (err, result)=>{
                    if (result.length != 0){
                        return resolve(result);
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
    },
	addcreditcard : (params) => {   
        return new Promise((resolve, reject) => {
            try {
                const name = params[0];
                const creditcard = params[1];
                let errs = null
                for(let creditcards of creditcard) {
                    const insertuser = "INSERT INTO creditcard (name, type, ammount) VALUES (?,?,?)"
                    db.query(insertuser, [name, creditcards.type, creditcards.ammount], (err, result)=>{
                        errs = err
                    });
                }
                if (!errs){
                    return resolve("success");
                }
                } catch (error) {
                    console.log('Error in DB prequalification Service: ', error);
                    return reject('Error in DB prequalification Service: ', error);
            }
        })
    },
	addcocreditcards : (params) => {   
        return new Promise((resolve, reject) => {
            try {
                const creditcard = params[0];
                const email = params[1];
                let errs = null
                for(let creditcards of creditcard) {
                    const insertuser = "INSERT INTO creditcard (name, type, ammount, emailref) VALUES (?,?,?,?)"
                    db.query(insertuser, [creditcards.coapplicantsname, creditcards.type, creditcards.ammount, email], (err, result)=>{
                        errs = err
                    });
                }
                if (!errs){
                    return resolve("success");
                }
                } catch (error) {
                    console.log('Error in DB prequalification Service: ', error);
                    return reject('Error in DB prequalification Service: ', error);
            }
        })
    },
	checkcoapplicantscreditcard : (params) => {   
        return new Promise((resolve, reject) => {
            try {
                const coapplicantcreditcard = params[0];
                var items = []
                const checkaccount = "SELECT * FROM coapplicants WHERE email=?"
                db.query(checkaccount, [coapplicantcreditcard], (err, result)=>{
                    if (result.length != 0){
                            var completed = 0;
                            for(x=0; x<result.length; x++) {
                            const checkaccount = "SELECT * FROM creditcard WHERE name=?"
                            db.query(checkaccount, [result[x].coapplicantsname], (err, results)=>{
                                if (results.length != 0){
                                    for (i=0; i < results.length; i++){                  
                                       items.push(results[i])   
                                   }
                                   completed++;
                                   if (completed == result.length){
                     
                                    return resolve(items);
                                   }
                                }
                                else{
                                    return reject("Failed");
                                }
                            })
                        }
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
    },
	addcarpayment : (params) => {   
        return new Promise((resolve, reject) => {
            try {
                const carpay = params[0];
                const name = params[1];
                let errs = null
                for(let carpaymenst of carpay) {
                    const insertuser = "INSERT INTO carpayment (name, ammount) VALUES (?,?)"
                    db.query(insertuser, [name, carpaymenst.ammount], (err, result)=>{
                        errs = err
                    });
                }
                if (!errs){
                    return resolve("success");
                }
                } catch (error) {
                    console.log('Error in DB prequalification Service: ', error);
                    return reject('Error in DB prequalification Service: ', error);
            }
        })
    },
	addcarpayment : (params) => {   
        return new Promise((resolve, reject) => {
            try {
                const name = params[0];
                const checkaccount = "SELECT * FROM carpayment WHERE name=?"
                db.query(checkaccount, [name], (err, result)=>{
                    if (result.length != 0){
                        // return res.json({status: result});
                        return resolve({
                            status: result
                        });
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
    },
	addcoapplicantcar : (params) => {   
        return new Promise((resolve, reject) => {
            try {
                const coapplicantscarpay = params[0];
                const email = params[1];
                let errs = null
                for(let carpay of coapplicantscarpay) {
                    const insertuser = "INSERT INTO carpayment (name, ammount,emailref) VALUES (?,?,?)"
                    db.query(insertuser, [carpay.coapplicantsname, carpay.ammount, email], (err, result)=>{
                        errs = err
                    });
                }
                if (errs === null){
                    return resolve("success");
                }
                } catch (error) {
                    console.log('Error in DB prequalification Service: ', error);
                    return reject('Error in DB prequalification Service: ', error);
            }
        })
    },
}
