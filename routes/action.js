const action = require('../controllers/action');
module.exports = (router) => {
    //decline buying a home application
    router.post('/declineapproval', action.declineapproval);
    //decline refinancing application
    router.post('/declineapproval', action.declineapprovalrefinancing);
    //archive application
    router.post('/Newnode', action.Newnode);
    //unarchive application
    router.post('/Forfollowup', action.Forfollowup);
    //ready for submission
    router.post('/Readyforsubmissionnode', action.Readyforsubmissionnode);
    //move to progress
    router.post('/approvedwithcommitment', action.approvedwithcommitment);
    //delete action button
    router.post('/deletenode', action.deletenode);
    //approve buying a home
    router.post('/closedforconservationnode', action.closedforconservationnode);
    //approve buying a home
    router.post('/cancellednode', action.cancellednode);
    //approve buying a home
    router.post('/fundeddeals', action.fundeddeals);
    //approve buying a home
    router.post('/senttobmomortgage', action.senttobmomortgage);
    //approve refinancing
    router.post('/approveclientrefinancing', action.approveclient);
}

