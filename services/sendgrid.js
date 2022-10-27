const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_KEY);
module.exports = {
	sendemailverification : async (params) => {   
        try {
            const email = params[0]
            const secrettoken = params[1];
            const emailverification ={
                to: email,
                from: 'apply@greatwaymortgage.com',
                subject: 'GreatWay Account Activation',
                text: 'Thank you for your Contact Information, we need to verify if this is your correct email address.'+' https://greatwaymortgage.online/newpassword/'+secrettoken
            }
            sgMail.send(emailverification, function(err, info){
            if(!err){
                return resolve("success");
            }
            })
        } catch (error) {
            console.log('Error in Admin Controller: ', error);
        }
    },
    declineapproval : async (params) => {   
        try {
            const email = params[0]
            const verifyemail ={
                to: email,
                from: 'apply@greatwaymortgage.com',
                subject: 'GreatWay Mortgage',
                 text: 'You have been declined on your Greatway Application'
            }
            sgMail.send(verifyemail, function(err, info){
            if(!err){
                return resolve("success");
            }
            })
        } catch (error) {
            console.log('Error in Admin Controller: ', error);
        }
    },
    forgotpassword : async (params) => {   
        try {
            const email = params[0]
            const sercrettoken = randomstring.generate();
            const updateuuid = "UPDATE users SET uuid = ? WHERE email=?"
            db.query(updateuuid, [sercrettoken, email], (err, result)=>{
            if(err === null){
                const verifyemail ={
                    to: email,
                    from: 'apply@greatwaymortgage.com',
                    subject: 'GreatWay Reset Password',
                    text: 'Reset Password. '+' https://greatwaymortgage.online/newpassword/'+sercrettoken
                }
                sgMail.send(verifyemail, function(err, info){
                if(!err){
                    return resolve("success");
                }
                else {
                    return resolve("failed");
                }
                })
            }
            })
        } catch (error) {
            console.log('Error in Admin Controller: ', error);
        }
    },
    declineapprovalrefinancing : async (params) => {   
        try {
            const email = params[0]
            const verifyemail ={
                to: email,
                from: 'apply@greatwaymortgage.com',
                subject: 'GreatWay Mortgage',
                text: 'You have been declined on your Greatway Application'
            }
            sgMail.send(verifyemail, function(err, info){
                if(!err){
                    return resolve("success");
                }
            })
        } catch (error) {
            console.log('Error in Admin Controller: ', error);
        }
    },
    approveclient : async (params) => {   
        try {
            const email = params[0]
            const verifyemail ={
                to: email,
                from: 'apply@greatwaymortgage.com',
                subject: 'GreatWay Mortgage',
                text: 'You passed the pre-qualifications for Buying a home at GreatWay Mortgage please proceed with your application please click on' + ' ' + 'https://greatwaymortgage.online/Application'
            }
            sgMail.send(verifyemail, function(err, info){
                if(!err){
                    return resolve("success");
                }
            })
        } catch (error) {
            console.log('Error in Admin Controller: ', error);
        }
    },
    approveclientrefinancing : async (params) => {   
        try {
            const email = params[0]
            const verifyemail ={
                to: email,
                from: 'apply@greatwaymortgage.com',
                subject: 'GreatWay Mortgage',
               text: 'You passed the pre-qualifications for Refinancing at GreatWay Mortgage please proceed with your application please click on' + ' ' + 'https://greatwaymortgage.online/Approval'
           }
            sgMail.send(verifyemail, function(err, info){
                if(!err){
                    return resolve("success");
                }
            })
        } catch (error) {
            console.log('Error in Admin Controller: ', error);
        }
    }
}

