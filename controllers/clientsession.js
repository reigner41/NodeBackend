const express = require('express');
const app = express();
const session = require('express-session');
const clientsession = require('../services/clientsession');

// Removed to be handled in web express backend
// app.use(session(
//     {
//         key: "userID",
//         secret: "GWFReigner26!",
//         resave: false,
//         saveUninitialized: false,
//         cookie: {
//             expires: 10000000,
//         },
//     }
// ))

module.exports = {
    //get login session
	getlogin : async (req, res) => {   
        try {
            if (req.session.user){
                return res.json({loggedIn: true, user: req.session.user});
            }
            else{
                return res.json({loggedIn: false});
            }
        } catch (error) {
            console.log('Error in prequalification Controller: ', error);
        }
    },
    //post login session
	postlogin : async (req, res) => {   
        try {
            const email = req.body.email
            const password = req.body.password
            const params = [email, password];
            if (email !== null && password !== null){
                const result =  await clientsession.postlogin(params);
                return res.json({status: result});

            }
        } catch (error) {
            console.log('Error in prequalification Controller: ', error);
        }
    },
}
