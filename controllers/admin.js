const mysql = require('mysql2');


const db = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database:  process.env.MYSQL_DB,
    port: process.env.MYSQL_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


const services = require('../services/db');
const adminindex = require('../services/adminindex');

module.exports = {

	adminlogin: (req, res) => {   
        //
        try {
            console.log('Here is the request ', req.body);
            const username = req.body.username;
            const password = req.body.password;

            if (username !== null && password !==null){
                const checkaccount = "SELECT * FROM admintbl WHERE username=?"
                db.query(checkaccount, [username], (err, result)=>{
                        console.log(err)
                    if (err) {
                        return res.send('Error fetching data from database: ', err);
                    }

                    if (result.length != 0){
                        if (result[0].password === password){
                            secured = true
                            req.session.useradmin = result
                            return res.json({status: result});
                        }
                        else{
                            return res.json({status: "Failed"});
                        }     
                    }
                    else{
                        return res.json({status: "Failed"});
                    }
                })
            }

        } catch (error) {
            console.log('Error in Admin Controller: ', error);
        }
        
    },

	adminlogin2: async (req, res) => {   
        
        try {
            const username = req.body.username;
            const password = req.body.password;

            const params = [username, password];

            if (username !== null && password !==null){
                
                const result =  await services.adminlogin(params);
                return res.json({status: result});

            }

        } catch (error) {
            console.log('Error in Admin Controller: ', error);
        }
        
    },

    searchnodecount: async (req, res) => {   
        
        try {
            const rowcount = req.body.rowcount;
            let search = req.body.search;
            const searchby = req.body.searchby;
            search = '%' + search + '%';
            const getsearch = "SELECT Round(Count(1) / ?) numberofpages FROM approval where " +searchby + " LIKE ?;"
            const params = [getsearch, rowcount, search];
            const result =  await adminindex.searchnodecount(params);
            return res.json({status: result});
        } catch (error) {
            console.log('Error in Admin Controller search node count: ', error);
        }
        
    },

    searchnode: async (req, res) => {   
        
        try {
            let search = req.body.search;
            const searchby = req.body.searchby;
            const orderval = req.body.ascdesc;
            const orderbool = req.body.arrowicon;
            let order = "";
            if (orderbool == false){
                order = "desc"
            }
            else{
                order = "asc"
            }
            search = '%' + search + '%';
            const page = req.body.page;
            const rowcount = req.body.rowcount;
            let startitem = (rowcount * (page - 1));
            const params = [search, searchby, orderval, order, page, rowcount, startitem];
            const result =  await adminindex.searchnode(params);
            return res.json({status: result});
        } catch (error) {
            console.log('Error in Admin Controller search node: ', error);
        }
        
    }

}