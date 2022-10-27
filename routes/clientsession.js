const clientsession = require('../controllers/clientsession');
module.exports = (router) => {
    //client session
    router.get('/login', clientsession.getlogin);
    //client login
    router.post('/login', clientsession.postlogin);
}

