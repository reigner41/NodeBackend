const controller = require('../controllers/admin');

module.exports = (router) => {

    router.post('/adminlogn2', controller.adminlogin);

    router.post('/adminlogn', controller.adminlogin2);
    
    router.post('/searchnodecount', controller.searchnodecount);

    router.post('/searchnode', controller.searchnode);
}