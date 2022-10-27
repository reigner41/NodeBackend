const mysql = require('mysql2');
var moment = require('moment')
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
	underwriternode: (params) => {   
        return new Promise((resolve, reject) => {
            try {
                var date = moment().format('Y-M-D H:m:s');
                const setunderwriter = params[0]
                const Id = params[1];
                const underwriter = params[2];
                const getsearch = "Update approval SET status = 2, Underwriter = ? where Id = ?"
                db.query(getsearch, [setunderwriter, Id], (err, result)=>{
                        if (err) {
                            return reject('Error in db query: ' + err);
                        }
                        if (result.length != 0){
                            const selectadmin = "Select * from admintbl where name = ?"
                            db.query(selectadmin, [underwriter], (errsel, resultsel)=>{ 
                                if (err === null){
                                    const insertadudit = "INSERT INTO audithistory (UserID, Operation, ChangeDate, TableName, ModifiedFields, PrimaryKey) VALUES (?,?,?,?,?,?)"
                                    db.query(insertadudit, [resultsel[0].id, "U", date, "approval","SETUnderwriter", Id], (err, result)=>{console.log(err)});
                                }
                            });
                            return resolve(result);     
                        }
                        else{
                            return reject('Failed');
                        }
                    })
                }catch (error) {
                    console.log('Error in DB Service: ', error);
                    return reject('Error in DB Service: ', error);
            }
        })
    },

    closingdatenode: (params) => {   
        return new Promise((resolve, reject) => {
            try {
                var date = moment().format('Y-M-D H:m:s');
                const setclosingdate = params[0]
                const Id = params[1];
                const underwriter = params[2];
                const getsearch = "Update approval SET closingdate = ? where Id = ?"
                db.query(getsearch, [setclosingdate, Id], (err, result)=>{
                    console.log(result)
                        if (err) {
                            return reject('Error in db query: ' + err);
                        }
                        if (result.length != 0){
                            const selectadmin = "Select * from admintbl where name = ?"
                            db.query(selectadmin, [underwriter], (errsel, resultsel)=>{ 
                                if (err === null){
                                    const insertadudit = "INSERT INTO audithistory (UserID, Operation, ChangeDate, TableName, ModifiedFields, PrimaryKey) VALUES (?,?,?,?,?,?)"
                                    db.query(insertadudit, [resultsel[0].id, "U", date, "approval","SETClosingDate", Id], (err, result)=>{console.log(err)});
                                }
                            });
                            return resolve(result);     
                        }
                        else{
                            return reject('Failed');
                        }
                    })
                }catch (error) {
                    console.log('Error in DB Service: ', error);
                    return reject('Error in DB Service: ', error);
            }
        })
    },

    conditiondatenode: (params) => {   
        return new Promise((resolve, reject) => {
            try {
                var date = moment().format('Y-M-D H:m:s');
                const setconditiondate = params[0]
                const Id = params[1];
                const underwriter = params[2];
                const getsearch = "Update approval SET conditiondate = ? where Id = ?"
                db.query(getsearch, [setconditiondate, Id], (err, result)=>{
                    console.log(result)
                        if (err) {
                            return reject('Error in db query: ' + err);
                        }
                        if (result.length != 0){
                            const selectadmin = "Select * from admintbl where name = ?"
                            db.query(selectadmin, [underwriter], (errsel, resultsel)=>{ 
                                if (err === null){
                                    const insertadudit = "INSERT INTO audithistory (UserID, Operation, ChangeDate, TableName, ModifiedFields, PrimaryKey) VALUES (?,?,?,?,?,?)"
                                    db.query(insertadudit, [resultsel[0].id, "U", date, "approval","SETClosingDate", Id], (err, result)=>{console.log(err)});
                                }
                            });
                            return resolve(result);     
                        }
                        else{
                            return reject('Failed');
                        }
                    })
                }catch (error) {
                    console.log('Error in DB Service: ', error);
                    return reject('Error in DB Service: ', error);
            }
        })
    },

    printabletablenode: (params) => {   
        return new Promise((resolve, reject) => {
            try {
                var date = moment().format('Y-M-D H:m:s');
                const startdateparam = params[0]
                let startdate = moment(startdateparam).format('Y-M-D H:m:s');

                const enddateparam = params[1];
                let enddate = moment(enddateparam).format('Y-M-D H:m:s');

                const getsearch = "Select * from approval where date between ? and ?"
                db.query(getsearch, [startdate, enddate], (err, result)=>{
                    console.log(result, err)
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
                }catch (error) {
                    console.log('Error in DB Service: ', error);
                    return reject('Error in DB Service: ', error);
            }
        })
    },

    selectanotherpropertynode: (params) => {   
        return new Promise((resolve, reject) => {
            try {
                const Id = params[0]
                const getsearch = "Select * from anotherproperty where approvalid = ?"
                db.query(getsearch, [Id], (err, result)=>{
                    console.log(result, err)
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
                }catch (error) {
                    console.log('Error in DB Service: ', error);
                    return reject('Error in DB Service: ', error);
            }
        })
    },

    selectcoapplicantproperties: (params) => {   
        return new Promise((resolve, reject) => {
            try {
                const Id = params[0]
                const getsearch = "Select * from anotherproperty where approvalid = ?"
                db.query(getsearch, [Id], (err, result)=>{
                    console.log(result, err)
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
                }catch (error) {
                    console.log('Error in DB Service: ', error);
                    return reject('Error in DB Service: ', error);
            }
        })
    }
}