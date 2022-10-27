const buyingahome = require('../controllers/buyingahome');
module.exports = (router) => {
    //select buying a home
    router.post('/buyinghome', buyingahome.buyinghome);
    //insert plan to buy param to db
    router.post('/plantobuy', buyingahome.plantobuy);
    //insert province param to db
    router.post('/province', buyingahome.province);
    //insert realtor param to db
    router.post('/realtor', buyingahome.realtor);
    //insert ammortyears
    router.post('/updateammortyears', buyingahome.updateammortyears);
    //insert annual
    router.post('/annual', buyingahome.annual);
    //insert co-applicants
    router.post('/coapplicant', buyingahome.coapplicant);
    //insert co-applicants names
    router.post('/coapplicantnames', buyingahome.coapplicantnames);
    //select co applicants
    router.post('/checkcoapplicants', buyingahome.checkcoapplicants);
    //insert monthly coapplicants
    router.post('/savemonthlywithcoapplicants', buyingahome.savemonthlywithcoapplicants);
    //check creditcard
    router.post('/checkcreditcard', buyingahome.checkcreditcard);
    //insert credit card
    router.post('/addcreditcard', buyingahome.addcreditcard);
    //insert co credit card
    router.post('/addcocreditcards', buyingahome.addcocreditcards);
    //check co applicant
    router.post('/checkcoapplicantscreditcard', buyingahome.checkcoapplicantscreditcard);
    //add car payment
    router.post('/addcarpayment', buyingahome.addcarpayment);
    //check car payment
    router.post('/checkcarpayments', buyingahome.checkcarpayments);
    //add co applicant car payments
    router.post('/addcoapplicantcar', buyingahome.addcoapplicantcar);
}
