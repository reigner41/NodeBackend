const prequalification = require('../controllers/prequalification');
module.exports = (router) => {
    //insert new user
    router.post('/contactinsert', prequalification.insertcontact);
    //forgot password
    router.post('/forgotpassword', prequalification.forgotpassword);
    //confirm uuid secret for set password
    router.post('/confirmuuid', prequalification.confirmuuid);
    //new password
    router.post('/newpassword', prequalification.newpassword);
    //check email if existing in db
    router.post('/checkemail', prequalification.checkemail);
}

