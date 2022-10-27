const approvalhome = require('../services/approvalhome');
module.exports = {
	underwriternode: async (req, res) => {   
        try {
            const setunderwriter = req.body.setunderwriter;
            const Id = req.body.Id;
            const underwriter = req.body.underwriter;
            const params = [setunderwriter, Id, underwriter];
            if (setunderwriter !== null && underwriter !==null){
                const result =  await approvalhome.underwriternode(params);
                return res.json({status: result});
            }
        } catch (error) {
            console.log('Error in Admin Controller: ', error);
        }
        
    },

    closingdatenode: async (req, res) => {   
        try {
            const setclosingdate = req.body.setclosingdate;
            const Id = req.body.Id;
            const underwriter = req.body.underwriter;
            const params = [setclosingdate, Id, underwriter];

            if (setclosingdate !== null && underwriter !==null){
                const result =  await approvalhome.closingdatenode(params);
                return res.json({status: result});
            }
        } catch (error) {
            console.log('Error in Admin Controller: ', error);
        }
        
    },

    conditiondatenode: async (req, res) => {   
        try {
            const setconditiondate = req.body.setconditiondate;
            const Id = req.body.Id;
            const underwriter = req.body.underwriter;
            const params = [setconditiondate, Id, underwriter];

            if (setconditiondate !== null && underwriter !==null){
                const result =  await approvalhome.conditiondatenode(params);
                return res.json({status: result});
            }
        } catch (error) {
            console.log('Error in Admin Controller: ', error);
        }
        
    },

    printabletablenode: async (req, res) => {   
        try {
            const startdate = req.body.startdate;
            const enddate = req.body.enddate;
            const params = [startdate, enddate];
            if (startdate !== null){
                const result =  await approvalhome.printabletablenode(params);
                return res.json({status: result});
            }
        } catch (error) {
            console.log('Error in Admin Controller: ', error);
            return res.json({status: "Failed"});
        }
        
    },

    selectanotherpropertynode: async (req, res) => {   
        try {
            const Id = req.body.Id;
            const params = [Id];
            if (Id !== null){
                const result =  await approvalhome.selectanotherpropertynode(params);
                return res.json({status: result});
            }
        } catch (error) {
            console.log('Error in Admin Controller: ', error);
            return res.json({status: "Failed"});
        }
        
    },

    selectcoapplicantproperties: async (req, res) => {   
        try {
            const Id = req.body.Id;
            const params = [Id];
            if (Id !== null){
                const result =  await approvalhome.selectcoapplicantproperties(params);
                return res.json({status: result});
            }
        } catch (error) {
            console.log('Error in Admin Controller: ', error);
            return res.json({status: "Failed"});
        }
        
    },
}