const services = require('../services/prequalificationdb');
const sendgrid = require('../services/sendgrid')
module.exports = {
    //insert contact
	insertcontact : async (req, res) => {   
        try {
            const email = req.body.email
            const name = req.body.name
            const phone = req.body.phone
            const refferal = req.body.reference
            const stat = false
            const params = [email, name, phone, refferal, stat];
            if (email !== null && name !== null){
                const result =  await services.contactinsert(params);
                
                if (result.status === 'success'){
                    const sendemail =  await sendgrid.sendemailverification(result.params);
                }
                return res.json({status: result.status});

            }
        } catch (error) {
            console.log('Error in prequalification Controller: ', error);
        }
    },
    //forgot password
	forgotpassword : async (req, res) => {   
        try {
            const email = req.body.email
            const params = [email];
            if (email !== null){
                const result =  await services.forgotpassword(params);
                if (result.status === 'success'){
                    const sendemail =  await sendgrid.forgotpassword(result.params);
                }
                return res.json({status: result});
            }
        } catch (error) {
            console.log('Error in prequalification Controller: ', error);
        }
    },
    //confirm uuid for set password
	confirmuuid : async (req, res) => {   
        try {
            const uuid = req.body.uuid
            const params = [uuid];
            if (uuid !== null){
                const result =  await services.confirmuuid(params);
                return res.json({status: result});
            }
        } catch (error) {
            console.log('Error in prequalification Controller: ', error);
        }
    },
    //new password
	newpassword : async (req, res) => {   
        try {
            const uuid = req.body.uuid
            const password = req.body.password
            const params = [uuid, password];
            if (uuid !== null){
                const result =  await services.newpassword(params);
                return res.json({status: result});
            }
        } catch (error) {
            console.log('Error in prequalification Controller: ', error);
        }
    },
    //check email from db
	checkemail : async (req, res) => {   
        try {
            const email = req.body.email
            const params = [email];
            if (email !== null){
                const result =  await services.checkemail(params);
                return res.json({status: result});
            }
        } catch (error) {
            console.log('Error in prequalification Controller: ', error);
        }
    }
}

