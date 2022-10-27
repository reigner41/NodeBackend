const db = require('../config/db')
var moment = require('moment')
module.exports = {
    declineapproval : (params) => {   
        return new Promise((resolve, reject) => {
            try {
                const email = params[0]
                const updatebuyhome = "UPDATE buyinghome SET status = 1 where email = ?"
                db.query(updatebuyhome, [email], (err, result)=>{
    
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
    declineapprovalrefinancing : (params) => {   
        return new Promise((resolve, reject) => {
            try {
                const email = params[0]
                const updatebuyhome = "UPDATE refinancinghome SET status = 1 where email = ?"
                db.query(updatebuyhome, [email], (err, result)=>{
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
    Newnode : (params) => {   
        return new Promise((resolve, reject) => {
            try {
                const Id = params[0]
                const underwriter = params[1]
                const updateapplication = "UPDATE approval SET status = 0 where Id = ?"
                db.query(updateapplication, [Id], (err, result)=>{
                    console.log(err);
                    if(err === null){
                        return resolve({status: "success"});
                    }
                })
                } catch (error) {
                    console.log('Error in DB prequalification Service: ', error);
                    return reject('Error in DB prequalification Service: ', error);
            }
        })
    },
    Forfollowup : (params) => {   
        return new Promise((resolve, reject) => {
            try {
                const Id = params[0]
                const underwriter = params[1]
                const updateapplication = "UPDATE approval SET status = 2 where Id = ?"
                db.query(updateapplication, [Id], (err, result)=>{
                    console.log(err);
                    if(err === null){
                        return resolve({status: "success"});
                    }
                })
                } catch (error) {
                    console.log('Error in DB prequalification Service: ', error);
                    return reject('Error in DB prequalification Service: ', error);
            }
        })
    },
    Readyforsubmissionnode : (params) => {   
        return new Promise((resolve, reject) => {
            try {
                const Id = params[0]
                const underwriter = params[1]
                const updateapplication = "UPDATE approval SET status = 1 where Id = ?"
                db.query(updateapplication, [Id], (err, result)=>{
                    console.log(err);
                    if(err === null){
                        return resolve({status: "success"});
                    }
                })
                } catch (error) {
                    console.log('Error in DB prequalification Service: ', error);
                    return reject('Error in DB prequalification Service: ', error);
            }
        })
    },
    approvedwithcommitment : (params) => {   
        return new Promise((resolve, reject) => {
            try {
                const Id = params[0]
                const underwriter = params[1]
                const updateapplication = "UPDATE approval SET status = 3 where Id = ?"
                db.query(updateapplication, [Id], (err, result)=>{
                    console.log(err);
                    if(err === null){
                        return resolve({status: "success"});
                    }
                })
                } catch (error) {
                    console.log('Error in DB prequalification Service: ', error);
                    return reject('Error in DB prequalification Service: ', error);
            }
        })
    },
    cancellednode : (params) => {   
        return new Promise((resolve, reject) => {
            try {
                const Id = params[0]
                const underwriter = params[1]
                const updateapplication = "UPDATE approval SET status = 5  where Id = ?"
                db.query(updateapplication, [Id], (err, result)=>{
                    console.log(err);
                    if(err === null){
                        return resolve({status: "success"});
                    }
                })
                } catch (error) {
                    console.log('Error in DB prequalification Service: ', error);
                    return reject('Error in DB prequalification Service: ', error);
            }
        })
    },
    fundeddeals : (params) => {   
        return new Promise((resolve, reject) => {
            try {
                const Id = params[0]
                const underwriter = params[1]
                const updateapplication = "UPDATE approval SET status = 6 where Id = ?"
                db.query(updateapplication, [Id], (err, result)=>{
                    console.log(err);
                    if(err === null){
                        return resolve({status: "success"});
                    }
                })
                } catch (error) {
                    console.log('Error in DB prequalification Service: ', error);
                    return reject('Error in DB prequalification Service: ', error);
            }
        })
    },
    senttobmomortgage : (params) => {   
        return new Promise((resolve, reject) => {
            try {
                const Id = params[0]
                const underwriter = params[1]
                const updateapplication = "UPDATE approval SET status = 7 where Id = ?"
                db.query(updateapplication, [Id], (err, result)=>{
                    console.log(err);
                    if(err === null){
                        return resolve({status: "success"});
                    }
                })
                } catch (error) {
                    console.log('Error in DB prequalification Service: ', error);
                    return reject('Error in DB prequalification Service: ', error);
            }
        })
    },
    closedforconservationnode : (params) => {   
        return new Promise((resolve, reject) => {
            try {
                const Id = params[0]
                const underwriter = params[1]
                const updateapplication = "UPDATE approval SET status = 4 where Id = ?"
                db.query(updateapplication, [Id], (err, result)=>{
                    console.log(err);
                    if(err === null){
                        return resolve({status: "success"});
                    }
                })
                } catch (error) {
                    console.log('Error in DB prequalification Service: ', error);
                    return reject('Error in DB prequalification Service: ', error);
            }
        })
    },
    deletenode : (params) => {   
        return new Promise((resolve, reject) => {
            try {
                const Id = params[0]
                const adminname = params[1]
                var date = moment().format('Y-M-D H:m:s');
                const selectadmin = "Select * from admintbl where name = ?"
                db.query(selectadmin, [adminname], (errsel, resultsel)=>{
                    if (errsel === null){
                        const updatebuyhome = "Delete from approval where Id = ?"
                        db.query(updatebuyhome, [Id], (err, result)=>{
                            console.log(err + " no error on delete approval");
                            if(err === null){
                                const deleteactivity = "Delete from approvalactivity where approvalId = ?"
                                db.query(deleteactivity, [Id], (err, result)=>{
                                console.log(err + " no error on delete activity");
                                })
                                const deletecoapproval = "Delete from coappapproval where approvalId = ?"
                                db.query(deletecoapproval, [Id], (err, result)=>{
                                console.log(err + " no error on delete co approval");
                                })
                                const insertadudit = "INSERT INTO audithistory (UserID, Operation, ChangeDate, TableName, PrimaryKey) VALUES (?,?,?,?,?)"
                                    db.query(insertadudit, [resultsel[0].id, "D", date, "approval", Id], (err, result)=>{console.log(err)});
                                
                                return resolve("success");
                            }
                        })
                }
            });
                } catch (error) {
                    console.log('Error in DB prequalification Service: ', error);
                    return reject('Error in DB prequalification Service: ', error);
            }
        })
    },
    approveclient : (params) => {   
        return new Promise((resolve, reject) => {
            try {
                const email = params[0]
                const updatebuyhome = "UPDATE buyinghome SET status = 2 where email = ?"
                db.query(updatebuyhome, [email], (err, result)=>{
                if (!err){
                    return resolve("success");
                }
                })
    
                } catch (error) {
                    console.log('Error in DB prequalification Service: ', error);
                    return reject('Error in DB prequalification Service: ', error);
            }
        })
    },
    approveclientrefinancing : (params) => {   
        return new Promise((resolve, reject) => {
            try {
                const email = params[0]
                const updatebuyhome = "UPDATE refinancinghome SET status = 2 where email = ?"
                db.query(updatebuyhome, [email], (err, result)=>{
                    if (!err){
                        return resolve("success");
                    }
                })
    
                } catch (error) {
                    console.log('Error in DB prequalification Service: ', error);
                    return reject('Error in DB prequalification Service: ', error);
            }
        })
    },
}

