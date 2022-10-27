const services = require('../services/buyingahome');
module.exports = {
    //select buying a home
	buyinghome : async (req, res) => {   
        try {
            const email = req.body.email
            const params = [email];
            if (email !== null){
                const result =  await services.buyinghome(params);
                return res.json({status: result});

            }
        } catch (error) {
            console.log('Error in prequalification Controller: ', error);
        }
    },
    //insert plan to buy to db
	plantobuy : async (req, res) => {   
        try {
            const plantobuy = req.body.plantobuy
            const user = req.body.email
            const params = [plantobuy, user.email];
            if (user !== null){
                const result =  await services.plantobuy(params);
                return res.json({status: result});

            }
        } catch (error) {
            console.log('Error in prequalification Controller: ', error);
        }
    },
    //insert province to db
	province : async (req, res) => {   
        try {
            const province = req.body.province
            const user = req.body.email
            const params = [province, user.email];
            if (user !== null){
                const result =  await services.province(params);
                return res.json({status: result});

            }
        } catch (error) {
            console.log('Error in prequalification Controller: ', error);
        }
    },
    //insert realtor
	realtor : async (req, res) => {   
        try {
            const realtor = req.body.realtor
            const user = req.body.email
            const params = [realtor, user.email];
            if (user !== null){
                const result =  await services.realtor(params);
                return res.json({status: result});

            }
        } catch (error) {
            console.log('Error in prequalification Controller: ', error);
        }
    },
    //insert ammort years
	updateammortyears : async (req, res) => {   
        try {
            const ammortyears = req.body.ammortyears
            const user = req.body.email
            const params = [ammortyears, user.email];
            if (user !== null){
                const result =  await services.updateammortyears(params);
                return res.json({status: result});

            }
        } catch (error) {
            console.log('Error in prequalification Controller: ', error);
        }
    },
    //insert annual
	annual : async (req, res) => {   
        try {
            const annualincome = req.body.annualincome
            const user = req.body.email
            const params = [annualincome, user.email];
            if (user !== null){
                const result =  await services.annual(params);
                return res.json({status: result});

            }
        } catch (error) {
            console.log('Error in prequalification Controller: ', error);
        }
    },
    //insert coapplicant
	coapplicant : async (req, res) => {   
        try {
            const coapplicant = req.body.coapplicant
            const user = req.body.email
            const params = [coapplicant, user.email];
            if (user !== null){
                const result =  await services.coapplicant(params);
                return res.json({status: result});

            }
        } catch (error) {
            console.log('Error in prequalification Controller: ', error);
        }
    },
    //insert coapplicantnames
	coapplicantnames : async (req, res) => {   
        try {
            const coapplicantsnames = req.body.coapplicantsnames
            const user = req.body.email
            const params = [coapplicantsnames, user.email];
            if (user !== null){
                const result =  await services.coapplicantnames(params);
                return res.json({status: result});

            }
        } catch (error) {
            console.log('Error in prequalification Controller: ', error);
        }
    },
    //check co applicants
	checkcoapplicants : async (req, res) => {   
        try {
            const email = req.body.email
            const params = [email];
            if (user !== null){
                const result =  await services.checkcoapplicants(params);
                return res.json({status: result});

            }
        } catch (error) {
            console.log('Error in prequalification Controller: ', error);
        }
    },
    //insert coapplicant monthly expenses
	savemonthlywithcoapplicants : async (req, res) => {   
        try {
            const email = req.body.email
            const propertytax = req.body.propertytax
            const condofees = req.body.condofees
            const heatingcost = req.body.heatingcost
            const coapplicantarray = req.body.coapplicantarray
            const params = [email, propertytax,condofees,heatingcost,coapplicantarray];
            if (user !== null){
                const result =  await services.savemonthlywithcoapplicants(params);
                return res.json({status: result});

            }
        } catch (error) {
            console.log('Error in prequalification Controller: ', error);
        }
    },
    //check credit card
	checkcreditcard : async (req, res) => {   
        try {
            const name = req.body.name
            const params = [name];
            if (user !== null){
                const result =  await services.checkcreditcard(params);
                return res.json({status: result});

            }
        } catch (error) {
            console.log('Error in prequalification Controller: ', error);
        }
    },
    //add credit card
	addcreditcard : async (req, res) => {   
        try {
            const name = req.body.name
            const creditcard = req.body.creditcard
            const params = [name, creditcard];
            if (user !== null){
                const result =  await services.addcreditcard(params);
                return res.json({status: result});

            }
        } catch (error) {
            console.log('Error in prequalification Controller: ', error);
        }
    },
    //add co credit card
	addcocreditcards : async (req, res) => {   
        try {
            const creditcard = req.body.cocreditcard
            const email = req.body.email
            const params = [creditcard, email];
            if (creditcard !== null){
                const result =  await services.addcocreditcards(params);
                return res.json({status: result});

            }
        } catch (error) {
            console.log('Error in prequalification Controller: ', error);
        }
    },
    //check co applicant credit card
	checkcoapplicantscreditcard : async (req, res) => {   
        try {
            const coapplicantcreditcard = req.body.coapplicants
            const params = [coapplicantcreditcard];
            if (coapplicantcreditcard !== null){
                const result =  await services.checkcoapplicantscreditcard(params);
                return res.json({status: result});
            }
        } catch (error) {
            console.log('Error in prequalification Controller: ', error);
        }
    },
    //add car payment
	addcarpayment : async (req, res) => {   
        try {
            const carpay = req.body.carpayments
            const name = req.body.name
            const params = [carpay, name];
            if (carpay !== null){
                const result =  await services.addcarpayment(params);
                return res.json({status: result});
            }
        } catch (error) {
            console.log('Error in prequalification Controller: ', error);
        }
    },
    //check car payment
	checkcarpayments : async (req, res) => {   
        try {
            const name = req.body.name
            const params = [name];
            if (carpay !== null){
                const result =  await services.checkcarpayments(params);
                return res.json({status: result});
            }
        } catch (error) {
            console.log('Error in prequalification Controller: ', error);
        }
    },
    //add co applicant car payment
	addcoapplicantcar : async (req, res) => {   
        try {
            const coapplicantscarpay = req.body.coapplicantscarpay
            const email = req.body.email
            const params = [coapplicantscarpay, email];
            if (coapplicantscarpay !== null){
                const result =  await services.addcoapplicantcar(params);
                return res.json({status: result});
            }
        } catch (error) {
            console.log('Error in prequalification Controller: ', error);
        }
    }
}
