const action = require('../services/action');
const sendgrid = require('../services/sendgrid')
module.exports = {
    //decline
	declineapproval : async (req, res) => {   
        try {
            const email = req.body.email
            const params = [email];
            if (email !== null){
                const result =  await action.declineapproval(params);
                if (result.status === 'success'){
                    const sendemail =  await sendgrid.declineapproval(result.params);
                }
                return res.json({status: result.status});

            }
        } catch (error) {
            console.log('Error in prequalification Controller: ', error);
        }
    },
    //decline refinancing
	declineapprovalrefinancing : async (req, res) => {   
        try {
            const email = req.body.email
            const params = [email];
            if (email !== null){
                const result =  await action.declineapprovalrefinancing(params);
                if (result.status === 'success'){
                    const sendemail =  await sendgrid.declineapprovalrefinancing(result.params);
                }
                return res.json({status: result.status});

            }
        } catch (error) {
            console.log('Error in prequalification Controller: ', error);
        }
    },
    //archive application
	Newnode : async (req, res) => {   
        try {
            const Id = req.body.Id
            const underwriter = req.body.underwriter
            const params = [Id, underwriter];
            if (Id !== null){
                const result =  await action.Newnode(params);
                return res.json({status: result});

            }
        } catch (error) {
            console.log('Error in prequalification Controller: ', error);
        }
    },
    //archive application
	Forfollowup : async (req, res) => {   
        try {
            const Id = req.body.Id
            const underwriter = req.body.underwriter
            const params = [Id, underwriter];
            if (Id !== null){
                const result =  await action.Forfollowup(params);
                return res.json({status: result});
            }
        } catch (error) {
            console.log('Error in prequalification Controller: ', error);
        }
    },
    //ready for submission
	Readyforsubmissionnode : async (req, res) => {   
        try {
            const Id = req.body.Id
            const underwriter = req.body.underwriter
            const params = [Id, underwriter];
            if (Id !== null){
                const result =  await action.Readyforsubmissionnode(params);
                return res.json({status: result});
            }
        } catch (error) {
            console.log('Error in prequalification Controller: ', error);
        }
    },
    //move to in progress
	approvedwithcommitment : async (req, res) => {   
        try {
            const Id = req.body.Id
            const underwriter = req.body.underwriter
            const params = [Id, underwriter];
            if (Id !== null){
                const result =  await action.approvedwithcommitment(params);
                return res.json({status: result});
            }
        } catch (error) {
            console.log('Error in prequalification Controller: ', error);
        }
    },
        //move to in progress
    closedforconservationnode : async (req, res) => {   
        try {
            const Id = req.body.Id
            const underwriter = req.body.underwriter
            const params = [Id, underwriter];
            if (Id !== null){
                const result =  await action.closedforconservationnode(params);
                return res.json({status: result});
            }
        } catch (error) {
            console.log('Error in prequalification Controller: ', error);
        }
    },
    cancellednode : async (req, res) => {   
        try {
            const Id = req.body.Id
            const underwriter = req.body.underwriter
            const params = [Id, underwriter];
            if (Id !== null){
                const result =  await action.cancellednode(params);
                return res.json({status: result});
            }
        } catch (error) {
            console.log('Error in prequalification Controller: ', error);
        }
    },
    fundeddeals : async (req, res) => {   
        try {
            const Id = req.body.Id
            const underwriter = req.body.underwriter
            const params = [Id, underwriter];
            if (Id !== null){
                const result =  await action.fundeddeals(params);
                return res.json({status: result});
            }
        } catch (error) {
            console.log('Error in prequalification Controller: ', error);
        }
    },
    senttobmomortgage : async (req, res) => {   
        try {
            const Id = req.body.Id
            const underwriter = req.body.underwriter
            const params = [Id, underwriter];
            if (Id !== null){
                const result =  await action.senttobmomortgage(params);
                return res.json({status: result});
            }
        } catch (error) {
            console.log('Error in prequalification Controller: ', error);
        }
    },
    //delete action button
	deletenode : async (req, res) => {   
        try {
            const Id = req.body.Id
            const admin = req.body.adminname
            const params = [Id,admin];
            if (Id !== null){
                const result =  await action.deletenode(params);
                return res.json({status: result});
            }
        } catch (error) {
            console.log('Error in prequalification Controller: ', error);
        }
    },
    //approve buying home
	approveclient : async (req, res) => {   
        try {
            const email = req.body.email
            const params = [email];
            if (email !== null){
                const result =  await action.approveclient(params);
                if (result.status === 'success'){
                    const sendemail =  await sendgrid.approveclient(result.params);
                }
                return res.json({status: result.status});

            }
        } catch (error) {
            console.log('Error in prequalification Controller: ', error);
        }
    },
    //approve refinancing
	approveclientrefinancing : async (req, res) => {   
        try {
            const email = req.body.email
            const params = [email];
            if (email !== null){
                const result =  await action.approveclientrefinancing(params);
                if (result.status === 'success'){
                    const sendemail =  await sendgrid.approveclientrefinancing(result.params);
                }
                return res.json({status: result.status});

            }
        } catch (error) {
            console.log('Error in prequalification Controller: ', error);
        }
    }
}
