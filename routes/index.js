const test = require('./test');
const admin = require('./admin');
const prequalification = require('./prequalification');
const action = require('./action');
const clientsession = require('./clientsession');
const buyingahome = require('./buyingahome')
const approvalhome = require('./approvalhome')
module.exports = (instance) =>{
    test(instance);
    admin(instance);
    prequalification(instance);
    action(instance);
    clientsession(instance);
    buyingahome(instance);
    approvalhome(instance);
    return instance;
}

