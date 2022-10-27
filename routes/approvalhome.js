const controller = require('../controllers/approvalhome');
module.exports = (router) => {
    router.post('/underwriternode', controller.underwriternode);

    router.post('/closingdatenode', controller.closingdatenode);

    router.post('/conditiondatenode', controller.conditiondatenode);

    router.post('/printabletablenode', controller.printabletablenode);

    router.post('/selectanotherpropertynode', controller.selectanotherpropertynode);

    router.post('/selectcoapplicantproperties', controller.selectcoapplicantproperties);
}