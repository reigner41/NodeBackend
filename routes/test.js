const controller = require('../controllers/test.js');

module.exports = (router) => {

    router.get('/test', controller.tests);

}