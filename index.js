const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const sgMail = require('@sendgrid/mail')
var moment = require('moment')
const fs = require('fs');
const fileupload = require('express-fileupload');
const PORT = 8081;
const session = require('express-session');

require('dotenv').config()
//CROSS ORIGIN
app.use((req, res, next) => {
    const allowedOrigins = [process.env.ORIGIN_CORS];
    const origin = req.headers.origin;
    console.log('Allowed Origin: ', allowedOrigins);
    console.log('Actual Origin: ', origin);
    if (allowedOrigins.includes(origin)) {
         res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    return next();
  });

//db for mysql
const db = require('./config/db');

var imgB64 = fs.readFileSync(__dirname+'/htmlresponse/icon.PNG').toString('base64');
const cleanImgB64 = imgB64.replace('data:image/png;base64,' , '');

//auto response email generation
const mail = fs.readFileSync(__dirname+'/htmlresponse/comfirmation-mail.html',{encoding:'utf8', flag:'r'});
sgMail.setApiKey(process.env.SENDGRID_KEY);

app.use(session(
    {
        key: "userID",
        secret: "GWFReigner26!",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 10000000,
        },
    }
))
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(fileupload());
app.use(express.static(__dirname + '/public/uploads'));  

//route files
const routes = require('./routes/index');
const { start } = require('repl');
app.use('/api', routes(router));

app.post('/api/getpagecount', (req,res)=>{
    const rowcount = req.body.rowcount;
    const getpagecount = "SELECT Round(Count(1) / ?) numberofpages FROM approval;"
    db.query(getpagecount, [rowcount], (err, result)=>{
        if (result.length != 0){
            return res.json({status: result});
        }
        else{
            return res.json({status: "Failed"});
        }
    })
});
app.post('/api/getapprovalhome', (req,res)=>{
        const status = req.body.status;
        const rowcount = req.body.rowcount;
        const page = req.body.page;
        const ascdesc = req.body.ascdesc;
        const arrowicon = req.body.arrowicon;
        const purposeofapplication = req.body.purposeofapplication;
        let searchunderwriter = req.body.seachunderwriter;
        let betweenvalue = "date";
        let underwritersearch = "Underwriter";
        let startdateval = req.body.startdateval;
        if (startdateval === null){
            startdateval = moment("2000-01-01").toISOString();
        }
        let enddateval = req.body.enddateval;
        if (enddateval === null){
            enddateval = moment().toISOString();
        }
        if (ascdesc === "givenName" || ascdesc === "surName" || ascdesc === "referralcode" || ascdesc === "Underwriter"){
            betweenvalue = "date"
        }else{
            betweenvalue = ascdesc;
        }
        if (ascdesc === "referralcode" || ascdesc === "Underwriter"){
            underwritersearch = ascdesc;
        }else{
            underwritersearch = "Underwriter";
        }
        if (searchunderwriter === undefined || searchunderwriter === null || searchunderwriter === "IS Not Null"){
            searchunderwriter = " IS Not Null"
        }else{
            searchunderwriter = " ='" + searchunderwriter + "'"
        }
        let purposefilter = "";
        if (purposeofapplication == 0){
            purposefilter = "IS Not Null"
        }
        else if (purposeofapplication == 1){
            purposefilter = "='First Time Home Buyer'"
        }
        else if (purposeofapplication == 2){
            purposefilter = "='Buying a Second Home or rental Property'"
        }
        else if (purposeofapplication == 3){
            purposefilter = "='Mortgage Renewal'"
        }
        else if (purposeofapplication == 4){
            purposefilter = "='Refinancing'"
        }
        else if (purposeofapplication == 5){
            purposefilter = "='HELOC/IO'"
        }
        let order = "";
        if (arrowicon == false){
            order = "desc" 
        }
        else{
            order = "asc"
        }
        let startitem = (rowcount * (page - 1));
        let getgrid = '';
        if (ascdesc === "Underwriter"){
            getgrid = "SELECT Id,purposeofapplication,givenName,surName,phoneNumberMobile,province,date,referralcode,refferalnumber,status,Underwriter,closingdate,conditiondate FROM mortgagedb.approval WHERE " +underwritersearch+searchunderwriter+" and status = IF(?=99,status,?) and purposeofapplication "+purposefilter+" and " +betweenvalue+ " Between '" + startdateval + "' and '" + enddateval + "' order by " + ascdesc + " " + order + " LIMIT ?,?;";
        } else {
            getgrid = "SELECT Id,purposeofapplication,givenName,surName,phoneNumberMobile,province,date,referralcode,refferalnumber,status,Underwriter,closingdate,conditiondate FROM mortgagedb.approval WHERE status = IF(?=99,status,?) and purposeofapplication "+purposefilter+" and " +betweenvalue+ " Between '" + startdateval + "' and '" + enddateval + "' order by " + ascdesc + " " + order + " LIMIT ?,?;";
        }
        console.log(status,status,purposefilter,betweenvalue,startdateval,enddateval,ascdesc,order,startitem,rowcount)
        db.query(getgrid, [status, status,startitem, rowcount], (err, result)=>{
            if (err === null){
                console.log(result)
                if (result.length != 0){
                    return res.json({status: result});
                }
                else{
                    return res.json({status: "Failed"});
                }
            }
            else{
                console.log(err)
            }
        })
});
app.post('/api/getbuyinghome', (req,res)=>{
    const dropdown = req.body.dropdown
    const checkaccount = "select us.email, us.name, us.phone, us.refferal_person, us.whentobuy,us.province,us.realtor,us.ammortyears, buyinghome.annualincome, buyinghome.propertytax, buyinghome.condofees,buyinghome.heatingcost, buyinghome.coapplicant, buyinghome.date, buyinghome.status  from users us left join buyinghome ON buyinghome.email = us.email where buyinghome.status = ?"
    db.query(checkaccount, [dropdown], (err, result)=>{
        
        if (result.length != 0){
            return res.json({status: result});
        }
        else{
            return res.json({status: "Failed"});
        }
    })
});
app.post('/api/getrefinancinghome', (req,res)=>{
    const dropdown = req.body.dropdown
    const checkaccount = "select us.email, us.name, us.phone, refinancing.provincelocated, refinancing.whentorenew, refinancing.valueofproperty, refinancing.standingmortgage, refinancing.currentlender, refinancing.interestrate, refinancinghome.annualincome, refinancinghome.propertytax, refinancinghome.condofees, refinancinghome.heatingcost, refinancinghome.coapplicant, refinancinghome.date, refinancinghome.status from users us left join refinancing ON refinancing.email = us.email inner join refinancinghome ON refinancinghome.email = us.email where refinancinghome.status = ?"
    db.query(checkaccount,[dropdown], (err, result)=>{
        if (result.length != 0){
            return res.json({status: result});
        }
        else{
            return res.json({status: "Failed"});
        }
    })
});


app.post('/api/getuserbyemail', (req,res)=>{
    const email = req.body.email
    if (email !== '' || email !== null){

        let user
        var usercredit = []
        let usercarpayment = []
        let usercoapplicant = []
        let coapplicantcredit = []
        let coapplicantcarpayment = []
            const checkaccount = "select us.email, us.name, us.phone, us.refferal_person, us.whentobuy,us.province,us.realtor,us.ammortyears, buyinghome.annualincome, buyinghome.propertytax, buyinghome.condofees,buyinghome.heatingcost, buyinghome.coapplicant, buyinghome.date from users us inner join buyinghome ON buyinghome.email = us.email where us.email = ?"
            db.query(checkaccount, [email], (err, result)=>{
            if (result.length != 0){
                user = result[0]
            }
            const checkusercredit = "SELECT * FROM creditcard WHERE name=?"
            db.query(checkusercredit, [user.name], (err, result)=>{
                if (result.length != 0){
                    for(let resss of result) {
                        usercredit.push(resss) 
                    }
            }
            const checkusercarpayment = "SELECT * FROM carpayment WHERE name=?"
            db.query(checkusercarpayment, [user.name], (err, result)=>{
                if (result.length != 0){
                    for(let resss of result) {
                        usercarpayment.push(resss) 
                    }
                   
            }
            const checkusercoapplicant = "SELECT * FROM coapplicants WHERE email=?"
            db.query(checkusercoapplicant, [user.email], (err, result)=>{
                if (result.length != 0){
                    for(let resss of result) {
                        usercoapplicant.push(resss) 
                    }
                 
            }
            const checkusercocreditcard = "SELECT * FROM creditcard WHERE emailref=?"
            db.query(checkusercocreditcard, [user.email], (err, result)=>{
                if (result.length != 0){
                    for(let resss of result) {
                        coapplicantcredit.push(resss) 
                    }
                  
            }
            const checkusercocarpayment = "SELECT * FROM carpayment WHERE emailref=?"
            db.query(checkusercocarpayment, [user.email], (err, result)=>{
                if (result.length != 0){
                    for(let resss of result) {
                        coapplicantcarpayment.push(resss) 
                    }
            }
    
            let data = {
                "email" : user.email,
                "name" : user.name,
                "phone" : user.phone,
                "realtor" : user.realtor,
                "whentobuy" : user.whentobuy,
                "propertytax" : user.propertytax,
                "condofees" : user.condofees,
                "heatingcost" : user.heatingcost,
                "coapplicant" : user.coapplicant,
                "ammortyears" : user.ammortyears,
                "annualincome" : user.annualincome,
                "province" : user.province,
                "refferal_person" : user.refferal_person,
                "date" : user.date,
                "usercredit" : usercredit,
                "usercarpayment" : usercarpayment,
                "usercoapplicant" : usercoapplicant,
                "coapplicantcredit" : coapplicantcredit,
                "coapplicantcarpayment" : coapplicantcarpayment,
            }
            return res.json({status: data});
    
            })
            })
            })
            })
            })   
            })
      
    }
    

});
app.post('/api/getuserbyid', (req,res)=>{
    const id = req.body.id
    if (id !== ''){
        const getapproval = "select * from approval where Id = ?"
            db.query(getapproval, [id], (err, result)=>{
            console.log(result, err)
            if (result.length != 0){
                return res.json({status: result[0]});
            }
            else{
                return res.json({status: "Failed"});
            }
  
        })
    }
    

});
app.post('/api/getusercoappid', (req,res)=>{
    const id = req.body.id
    if (id !== ''){
        const getapproval = "select * from coappapproval where approvalId = ?"
            db.query(getapproval, [id], (err, result)=>{
            if (result.length != 0){
                return res.json({status: result});
            }
            else{
                return res.json({status: "Failed"});
            }
  
        })
    }
    

});

app.post('/api/getuserbyemailrefinancing', (req,res)=>{
    const email = req.body.email
    if (email !== '' || email !== null){

        let user
        var usercredit = []
        let usercarpayment = []
        let usercoapplicant = []
        let coapplicantcredit = []
        let coapplicantcarpayment = []
            const checkaccount = "select us.email, us.name, us.phone, refinancing.provincelocated, refinancing.whentorenew, refinancing.valueofproperty, refinancing.standingmortgage, refinancing.currentlender, refinancing.interestrate, refinancinghome.annualincome, refinancinghome.propertytax, refinancinghome.condofees, refinancinghome.heatingcost, refinancinghome.coapplicant, refinancinghome.date from users us inner join refinancing ON refinancing.email = us.email inner join refinancinghome ON refinancinghome.email = us.email where us.email = ?"
            db.query(checkaccount, [email], (err, result)=>{
            if (result.length != 0){
                user = result[0]
            }
            const checkusercredit = "SELECT * FROM creditcardrefinancing WHERE name=?"
            db.query(checkusercredit, [user.name], (err, result)=>{
                if (result.length != 0){
                    for(let resss of result) {
                        usercredit.push(resss) 
                    }
            }
            const checkusercarpayment = "SELECT * FROM carpaymentrefinancing WHERE name=?"
            db.query(checkusercarpayment, [user.name], (err, result)=>{
                if (result.length != 0){
                    for(let resss of result) {
                        usercarpayment.push(resss) 
                    }
                   
            }
            const checkusercoapplicant = "SELECT * FROM coapplicantsrefinancing WHERE email=?"
            db.query(checkusercoapplicant, [user.email], (err, result)=>{
                if (result.length != 0){
                    for(let resss of result) {
                        usercoapplicant.push(resss) 
                    }
                 
            }
            const checkusercocreditcard = "SELECT * FROM creditcardrefinancing WHERE emailref=?"
            db.query(checkusercocreditcard, [user.email], (err, result)=>{
                if (result.length != 0){
                    for(let resss of result) {
                        coapplicantcredit.push(resss) 
                }
                  
            }
            const checkusercocarpayment = "SELECT * FROM carpaymentrefinancing WHERE emailref=?"
            db.query(checkusercocarpayment, [user.email], (err, result)=>{
                if (result.length != 0){
                    for(let resss of result) {
                        coapplicantcarpayment.push(resss) 
                    }
            }
    
            let data = {
                "email" : user.email,
                "name" : user.name,
                "phone" : user.phone,
                "provincelocated" : user.provincelocated,
                "whentorenew" : user.whentorenew,
                "valueofproperty" : user.valueofproperty,
                "standingmortgage" : user.standingmortgage,
                "currentlender" : user.currentlender,
                "interestrate" : user.interestrate,
                "annualincome" : user.annualincome,
                "propertytax" : user.propertytax,
                "condofees" : user.condofees,
                "heatingcost" : user.heatingcost,
                "coapplicant" : user.coapplicant,
                "date" : user.date,
                "usercredit" : usercredit,
                "usercarpayment" : usercarpayment,
                "usercoapplicant" : usercoapplicant,
                "coapplicantcredit" : coapplicantcredit,
                "coapplicantcarpayment" : coapplicantcarpayment,
            }
            return res.json({status: data});
    
            })
            })
            })
            })
            })   
            })
      
    }
    

});


app.post('/api/approvalentry', (req,res)=>{
    var date = moment().format('Y-M-D H:m:s');
    const personalinfo = req.body.personalinfo
    const residenceexp = req.body.residenceexp
    const employmenthistory = req.body.employmenthistory
    const assets = req.body.assets
    const liabilities = req.body.liabilities
    const propertiesownedval = req.body.propertiesownedval
    const miscinfo = req.body.miscinfo
    const coapplicants = req.body.coapplicants
    const anotherPropertylist = req.body.anotherPropertylist
    const anotherPropertylistcoapp0 = req.body.anotherPropertylistcoapp0
    const anotherPropertylistcoapp1 = req.body.anotherPropertylistcoapp1
    const anotherPropertylistcoapp2 = req.body.anotherPropertylistcoapp2
    const insertuser = "INSERT INTO approval(purposeofapplication, whendoyoubuy, givenName, surName, birthDay, genDer, maritalstatus, email, phoneNumberWork, phoneNumberMobile, phoneNumberHome,"+
        "NumberofDependent, unit, street, city, province, postalcode, country, howmanyyear, andmonths, doyouownorrent, howmuchareyourenting, unit2, street2, city2, province2, postalcode2, country2, howmanyyear2,"+
        "andmonths2, doyouownorrent2, howmuchareyourenting2, unit3, street3, city3, province3, postalcode3, country3, howmanyyear3, andmonths3, doyouownorrent3, howmuchareyourenting3, employmenttype1, companyname1,"+
        "countryemployment1, provinceresidence1, cityresidence1, companyphonenumber1, jobtitle1, industrysector1, employmentstatus1, incometype1, annualsalary1, hourlysalary1, howmanyhoursperweek1, empstartdate1, empenddate1, yearsincompany1, andmonthscompany1, "+
        "yearsinindustry1, andmonthsindustry1, employmenttype2, companyname2, countryemployment2, provinceresidence2, cityresidence2, companyphonenumber2, jobtitle2, industrysector2, employmentstatus2, incometype2, annualsalary2,"+
        "hourlysalary2, howmanyhoursperweek2, empstartdate2, empenddate2, yearsincompany2, andmonthscompany2, yearsinindustry2, andmonthsindustry2, employmenttype3, companyname3, countryemployment3, provinceresidence3, cityresidence3, "+
        "companyphonenumber3, jobtitle3, industrysector3, employmentstatus3, incometype3, annualsalary3, hourlysalary3, howmanyhoursperweek3, empstartdate3, empenddate3, yearsincompany3, andmonthscompany3, yearsinindustry3, andmonthsindustry3, chequingammount,"+
        "chequingcompany, savingsammount, savingscompany, rrspammount, rrspcompany, respammount, respcompany, tfsaammount, tfsacompany, mutualfundammount, mutualfundcompany, pensionplanammount, pensionplancompany,"+
        "vehicle1, vehicle1selling, vehicle2, vehicle2selling, vehicle3, vehicle3selling, lifeinsurance, lifeinsuranceammount,lifeinsurancefundammount, lifeinsurance2, lifeinsuranceammount2,lifeinsurancefundammount2, creditcard1, creditcard1ammount, creditcard2, creditcard2ammount,"+
        "creditcard3, creditcard3ammount, linecredit1, linecredit1ammount, linecredit2, linecredit2ammount, carloan1, carloan1balance, carloan1monthly, carloan2, carloan2balance, carloan2monthly, carloan3,"+
        "carloan3balance, carloan3monthly, personalloan, personalbalance, personalmonthly, studentloan, studentbalance, studentmonthly, anotherproperty,howmanyproperty, owneroccupiedorrent, ownerunit, ownerstreet,"+
        "ownercity, ownerprovince, ownerpostal, ownerestimatedprop, ownerorigval, ownerpurchasedate, ownerannualtax, monthlycondofee,ownerheatingcost, ownerisitrentedoroccupied, ownercurrentbal, ownermortgagepayment,"+
        "ownerpaymentfreq, ownermaturitydate, ownerisitrentedoroccupied2, ownerratetype, ownerholder, ownerinterestrate, ownerrentedbalance2, cosignor, declaredconsumer, typeofmortgage, coapplicant, date, referralcode,"+
        "refferalemail, refferalnumber, status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
    db.query(insertuser, [personalinfo.purposeofapplication, personalinfo.whentobuy, personalinfo.givenname, personalinfo.surname, personalinfo.birthday, personalinfo.gender, personalinfo.maritalstatus, 
        personalinfo.email, personalinfo.phonenumberwork, personalinfo.phonenumbermobile, personalinfo.phonenumberhome, personalinfo.numberofdependent, residenceexp.unit, residenceexp.street, residenceexp.city, 
        residenceexp.province, residenceexp.postalcode, residenceexp.country, residenceexp.howmanyyear, residenceexp.andmonths, residenceexp.doyouownorrent, residenceexp.howmuchareyourenting, residenceexp.unit2, 
        residenceexp.street2, residenceexp.city2, residenceexp.province2, residenceexp.postalcode2, residenceexp.country2, residenceexp.howmanyyear2, residenceexp.andmonths2, residenceexp.doyouownorrent2, 
        residenceexp.howmuchareyourenting2, residenceexp.unit3, residenceexp.street3, residenceexp.city3, residenceexp.province3, residenceexp.postalcode3, residenceexp.country3, residenceexp.howmanyyear3, 
        residenceexp.andmonths3, residenceexp.doyouownorrent3, residenceexp.howmuchareyourenting3, employmenthistory.employmenttype1, employmenthistory.companyname1, employmenthistory.countryemployment1, 
        employmenthistory.provinceresidence1, employmenthistory.cityresidence1, employmenthistory.companyphonenumber1, employmenthistory.jobtitle1, employmenthistory.industrysector1, employmenthistory.employmentstatus1, employmenthistory.incometype1, 
        employmenthistory.annualsalary1, employmenthistory.hourlysalary1, employmenthistory.howmanyhoursperweek1, employmenthistory.empstartdate1, employmenthistory.empenddate1, employmenthistory.yearsincompany1, employmenthistory.andmonthscompany1, 
        employmenthistory.yearsindustry1, employmenthistory.andmonthsindustry1, employmenthistory.employmenttype2, employmenthistory.companyname2, employmenthistory.countryemployment2, 
        employmenthistory.provinceresidence2, employmenthistory.cityresidence2, employmenthistory.companyphonenumber2, employmenthistory.jobtitle2, employmenthistory.industrysector2, employmenthistory.employmentstatus2,
        employmenthistory.incometype2, employmenthistory.annualsalary2, employmenthistory.hourlysalary2, employmenthistory.howmanyhoursperweek2, employmenthistory.empstartdate2, employmenthistory.empenddate2, employmenthistory.yearsincompany2, 
        employmenthistory.andmonthscompany2, employmenthistory.yearsindustry2, employmenthistory.andmonthsindustry2, employmenthistory.employmenttype3, employmenthistory.companyname3, 
        employmenthistory.countryemployment3, employmenthistory.provinceresidence3, employmenthistory.cityresidence3, employmenthistory.companyphonenumber3, employmenthistory.jobtitle3, 
        employmenthistory.industrysector3, employmenthistory.employmentstatus3, employmenthistory.incometype3, employmenthistory.annualsalary3, employmenthistory.hourlysalary3, employmenthistory.howmanyhoursperweek3, employmenthistory.empstartdate3, employmenthistory.empenddate3, employmenthistory.yearsincompany3,
        employmenthistory.andmonthscompany3, employmenthistory.yearsindustry3, employmenthistory.andmonthsindustry3, assets.chequingammount, assets.chequingcompany, assets.savingsammount, assets.savingscompany, 
        assets.rrspammount, assets.rrspcompany, assets.respammount, assets.respcompany, assets.tfsammount, assets.tfsacompany, assets.mutualfundammount, assets.mutualfundcompany, assets.pensionplanammount, 
        assets.pensionplancompany, assets.vehicle1, assets.vehicle1selling, assets.vehicle2, assets.vehicle2selling, assets.vehicle3, assets.vehicle3selling, assets.lifeinsurance, assets.lifeinsuranceammount, 
        assets.lifeinsurancefundammount,assets.lifeinsurance2, assets.lifeinsuranceammount2, 
        assets.lifeinsurancefundammount2, liabilities.creditcard1, liabilities.creditcard1ammount, liabilities.creditcard2, liabilities.creditcard2ammount, liabilities.creditcard3, liabilities.creditcard3ammount, 
        liabilities.linecredit1, liabilities.linecredit1ammount, liabilities.linecredit2, liabilities.linecredit2ammount, liabilities.carloan1, liabilities.carloan1balance, liabilities.carloan1monthly, 
        liabilities.carloan2, liabilities.carloan2balance, liabilities.carloan2monthly, liabilities.carloan3, liabilities.carloan3balance, liabilities.carloan3monthly, liabilities.personalloan, 
        liabilities.personalbalance, liabilities.personalmonthly, liabilities.studentloan, liabilities.studentbalance, liabilities.studentmonthly, propertiesownedval.anotherproperty, 
        propertiesownedval.howmanyproperty, propertiesownedval.owneroccupiedorrent, propertiesownedval.ownerunit, propertiesownedval.ownerstreet, propertiesownedval.ownercity, propertiesownedval.ownerprovince,
        propertiesownedval.ownerpostal, propertiesownedval.ownerestimatedprop, propertiesownedval.ownerorigval, propertiesownedval.ownerpurchasedate, propertiesownedval.ownerannualtax, 
        propertiesownedval.monthlycondofee, propertiesownedval.ownerheatingcost, propertiesownedval.ownerisitrentedoroccupied1, propertiesownedval.ownercurrentbal, propertiesownedval.ownermortgagepayment, 
        propertiesownedval.ownerpaymentfreq, propertiesownedval.ownermaturitydate, propertiesownedval.ownerisitrentedoroccupied2, propertiesownedval.ownerratetype, propertiesownedval.ownerholder, 
        propertiesownedval.ownerinterestrate, propertiesownedval.ownerrentedbalance2, miscinfo.cosignor, miscinfo.declaredconsumer, miscinfo.typeofmortgage, personalinfo.coapplicant, date, 
        personalinfo.referral, personalinfo.refferalemail, personalinfo.refferalnumber, 0], (err, result)=>{
if (!err){
    if (coapplicants.length > 0){
        coapplicants.forEach(function (coapplicantlist, index) {
            const insertcoapplicant = "INSERT INTO coappapproval(approvalId,purposeofapplication,givenName,surName,birthDay,genDer,maritalstatus,email,phoneNumberWork,phoneNumberMobile,phoneNumberHome,"+
            "NumberofDependent,relationshiptoprimary,residencesameasmain,unit,street,city,province,postalcode,country,howmanyyear,andmonths,doyouownorrent,howmuchareyourenting,unit2,street2,city2,province2,postalcode2,country2,"+
            "howmanyyear2,andmonths2,doyouownorrent2,howmuchareyourenting2,unit3,street3,city3,province3,postalcode3,country3,howmanyyear3,andmonths3,doyouownorrent3,howmuchareyourenting3,employmenttype1,"+
            "companyname1,countryemployment1,provinceresidence1,cityresidence1,companyphonenumber1,jobtitle1,industrysector1,employmentstatus1,incometype1,annualsalary1,hourlysalary1,howmanyhoursperweek1,empstartdate1,empenddate1,yearsincompany1,"+
            "andmonthscompany1,yearsinindustry1,andmonthsindustry1,employmenttype2,companyname2,countryemployment2,provinceresidence2,cityresidence2,companyphonenumber2,jobtitle2,industrysector2,employmentstatus2,incometype2,"+
            "annualsalary2,hourlysalary2,howmanyhoursperweek2,empstartdate2,empenddate2,yearsincompany2,andmonthscompany2,yearsinindustry2,andmonthsindustry2,employmenttype3,companyname3,countryemployment3,provinceresidence3,cityresidence3,"+
            "companyphonenumber3,jobtitle3,industrysector3,employmentstatus3,incometype3,annualsalary3,hourlysalary3,howmanyhoursperweek3,empstartdate3,empenddate3,yearsincompany3,andmonthscompany3,yearsinindustry3,andmonthsindustry3,chequingammount,"+
            "chequingcompany,savingsammount,savingscompany,rrspammount,rrspcompany,respammount,respcompany,tfsaammount,tfsacompany,mutualfundammount,mutualfundcompany,pensionplanammount,pensionplancompany,"+
            "vehicle1,vehicle1selling,vehicle2,vehicle2selling,vehicle3,vehicle3selling,lifeinsurance,lifeinsuranceammount,lifeinsurancefundammount,lifeinsurance2,lifeinsuranceammount2,lifeinsurancefundammount2,creditcard1,creditcard1ammount,creditcard2,creditcard2ammount,"+
            "creditcard3,creditcard3ammount,linecredit1,linecredit1ammount,linecredit2,linecredit2ammount,carloan1,carloan1balance,carloan1monthly,carloan2,carloan2balance,carloan2monthly,carloan3,carloan3balance,"+
            "carloan3monthly,personalloan,personalbalance,personalmonthly,studentloan,studentbalance,studentmonthly,anotherproperty,howmanyproperty,ownersameasmain,owneroccupiedorrent,ownerunit,ownerstreet,ownercity,ownerprovince,ownerpostal,"+
            "ownerestimatedprop,ownerorigval,ownerpurchasedate,ownerannualtax,monthlycondofee,ownerheatingcost,ownerisitrentedoroccupied,ownercurrentbal,ownermortgagepayment,ownerpaymentfreq,ownermaturitydate,"+
            "ownerisitrentedoroccupied2,ownerratetype,ownerholder,ownerinterestrate,ownerrentedbalance2,cosignor,declaredconsumer,typeofmortgage) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
            db.query(insertcoapplicant, [result.insertId, coapplicantlist.purposeofapplication, coapplicantlist.givenName, coapplicantlist.surName, coapplicantlist.birthDay, coapplicantlist.genDer, 
                coapplicantlist.maritalstatus, coapplicantlist.email, coapplicantlist.phonenumberwork, coapplicantlist.phonenumbermobile, coapplicantlist.phonenumberhome, coapplicantlist.numberofdependent, 
                coapplicantlist.relationshiptoprimary, coapplicantlist.residencesameasmain, coapplicantlist.unit, coapplicantlist.street, coapplicantlist.city, coapplicantlist.province, coapplicantlist.postalcode, coapplicantlist.country, 
                coapplicantlist.howmanyyear, coapplicantlist.andmonths, coapplicantlist.doyouownorrent, coapplicantlist.howmuchareyourenting, coapplicantlist.unit2, coapplicantlist.street2, coapplicantlist.city2,
                coapplicantlist.province2, coapplicantlist.postalcode2, coapplicantlist.country2, coapplicantlist.howmanyyear2, coapplicantlist.andmonths2, coapplicantlist.doyouownorrent2, 
                coapplicantlist.howmuchareyourenting2, coapplicantlist.unit3, coapplicantlist.street3, coapplicantlist.city3, coapplicantlist.province3, coapplicantlist.postalcode3, coapplicantlist.country3, 
                coapplicantlist.howmanyyear3, coapplicantlist.andmonths3, coapplicantlist.doyouownorrent3, coapplicantlist.howmuchareyourenting3, coapplicantlist.employmenttype1, coapplicantlist.companyname1, 
                coapplicantlist.countryemployment1, coapplicantlist.provinceresidence1, coapplicantlist.cityresidence1, coapplicantlist.companyphonenumber1, coapplicantlist.jobtitle1, 
                coapplicantlist.industrysector1,coapplicantlist.employmentstatus1, coapplicantlist.incometype1, coapplicantlist.annualsalary1, coapplicantlist.hourlysalary1, coapplicantlist.howmanyhoursperweek1, coapplicantlist.empstartdate1, coapplicantlist.empenddate1, coapplicantlist.yearsincompany1, 
                coapplicantlist.andmonthscompany1, coapplicantlist.yearsindustry1, coapplicantlist.andmonthsindustry1, coapplicantlist.employmenttype2, coapplicantlist.companyname2, 
                coapplicantlist.countryemployment2, coapplicantlist.provinceresidence2, coapplicantlist.cityresidence2, coapplicantlist.companyphonenumber2, coapplicantlist.jobtitle2, 
                coapplicantlist.industrysector2,coapplicantlist.employmentstatus2, coapplicantlist.incometype2, coapplicantlist.annualsalary2, coapplicantlist.hourlysalary2, coapplicantlist.howmanyhoursperweek2,coapplicantlist.empstartdate2, coapplicantlist.empenddate2, coapplicantlist.yearsincompany2,
                coapplicantlist.andmonthscompany2, coapplicantlist.yearsindustry2, coapplicantlist.andmonthsindustry2, coapplicantlist.employmenttype3, coapplicantlist.companyname3,
                coapplicantlist.countryemployment3, coapplicantlist.provinceresidence3, coapplicantlist.cityresidence3, coapplicantlist.companyphonenumber3, coapplicantlist.jobtitle3, 
                coapplicantlist.industrysector3,coapplicantlist.employmentstatus3, coapplicantlist.incometype3, coapplicantlist.annualsalary3, coapplicantlist.hourlysalary3, coapplicantlist.howmanyhoursperweek3, coapplicantlist.empstartdate3, coapplicantlist.empenddate3,
                coapplicantlist.yearsincompany3, coapplicantlist.andmonthscompany3, coapplicantlist.yearsindustry3, coapplicantlist.andmonthsindustry3, coapplicantlist.chequingammount, 
                coapplicantlist.chequingcompany, coapplicantlist.savingsammount, coapplicantlist.savingscompany, coapplicantlist.rrspammount, coapplicantlist.rrspcompany, coapplicantlist.respammount, 
                coapplicantlist.respcompany, coapplicantlist.tfsammount, coapplicantlist.tfsacompany, coapplicantlist.mutualfundammount, coapplicantlist.mutualfundcompany, coapplicantlist.pensionplanammount, 
                coapplicantlist.pensionplancompany, coapplicantlist.vehicle1, coapplicantlist.vehicle1selling, coapplicantlist.vehicle2, coapplicantlist.vehicle2selling, coapplicantlist.vehicle3, 
                coapplicantlist.vehicle3selling, coapplicantlist.lifeinsurance, coapplicantlist.lifeinsuranceammount, coapplicantlist.lifeinsurancefundammount,coapplicantlist.lifeinsurance2, coapplicantlist.lifeinsuranceammount2, coapplicantlist.lifeinsurancefundammount2, coapplicantlist.creditcard1, 
                coapplicantlist.creditcard1ammount, coapplicantlist.creditcard2, coapplicantlist.creditcard2ammount, coapplicantlist.creditcard3, coapplicantlist.creditcard3ammount, 
                coapplicantlist.linecredit1, coapplicantlist.linecredit1ammount, coapplicantlist.linecredit2, coapplicantlist.linecredit2ammount, coapplicantlist.carloan1, 
                coapplicantlist.carloan1balance, coapplicantlist.carloan1monthly, coapplicantlist.carloan2, coapplicantlist.carloan2balance, coapplicantlist.carloan2monthly, coapplicantlist.carloan3, 
                coapplicantlist.carloan3balance, coapplicantlist.carloan3monthly, coapplicantlist.personalloan, coapplicantlist.personalbalance, coapplicantlist.personalmonthly, coapplicantlist.studentloan, 
                coapplicantlist.studentbalance, coapplicantlist.studentmonthly, coapplicantlist.anotherproperty,coapplicantlist.howmanyproperty,coapplicantlist.ownersameasmain,coapplicantlist.owneroccupiedorrent, coapplicantlist.ownerunit, coapplicantlist.ownerstreet,
                coapplicantlist.ownercity, coapplicantlist.ownerprovince, coapplicantlist.ownerpostal, coapplicantlist.ownerestimatedprop, coapplicantlist.ownerorigval, coapplicantlist.ownerpurchasedate, 
                coapplicantlist.ownerannualtax, coapplicantlist.monthlycondofee, coapplicantlist.ownerheatingcost, coapplicantlist.ownerisitrentedoroccupied1, coapplicantlist.ownercurrentbal, 
                coapplicantlist.ownermortgagepayment, coapplicantlist.ownerpaymentfreq, coapplicantlist.ownermaturitydate, coapplicantlist.ownerisitrentedoroccupied2, coapplicantlist.ownerratetype, 
                coapplicantlist.ownerholder, coapplicantlist.ownerinterestrate, coapplicantlist.ownerrentedbalance2, coapplicantlist.cosignor, coapplicantlist.declaredconsumer, coapplicantlist.typeofmortgage
                ], (err, resultcoapp)=>{
                    console.log(err)
                    if (!err){
                        const uuidcoapp = resultcoapp.insertId
                        if (index === 0){
                            if (anotherPropertylistcoapp0 !== null){
                                anotherPropertylistcoapp0.forEach(items => {
                                    const insertanotherproperty = "INSERT INTO anotherproperty (approvalid, owneroccupiedorrent, ownerunit, ownerstreet, ownercity, ownerprovince, ownerpostal, ownerestimatedprop, ownerorigval, ownerpurchasedate, ownerannualtax, monthlycondofee, ownerheatingcost, ownerisitrentedoroccupied, ownercurrentbal, ownermortgagepayment, ownerpaymentfreq, ownermaturitydate, ownerisitrentedoroccupied2, ownerratetype, ownerholder, ownerinterestrate, ownerrentedbalance2) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
                                    db.query(insertanotherproperty, [uuidcoapp,items.owneroccupiedorrent,items.ownerunit,items.ownerstreet,items.ownercity,items.ownerprovince,items.ownerpostal,items.ownerestimatedprop,
                                        items.ownerorigval,items.ownerpurchasedate,items.ownerannualtax,items.monthlycondofee,items.ownerheatingcost,items.ownerisitrentedoroccupied1,items.ownercurrentbal,
                                        items.ownermortgagepayment,items.ownerpaymentfreq,items.ownermaturitydate,items.ownerisitrentedoroccupied2,items.ownerratetype,items.ownerholder,items.ownerinterestrate,
                                        items.ownerrentedbalance2], (err, result)=>{
                                        console.log(err,result)
                                    });
                                })
                            }

                        }
                        if (index === 1){
                            if (anotherPropertylistcoapp1 !== null){
                            anotherPropertylistcoapp1.forEach(items => {
                                const insertanotherproperty = "INSERT INTO anotherproperty (approvalid, owneroccupiedorrent, ownerunit, ownerstreet, ownercity, ownerprovince, ownerpostal, ownerestimatedprop, ownerorigval, ownerpurchasedate, ownerannualtax, monthlycondofee, ownerheatingcost, ownerisitrentedoroccupied, ownercurrentbal, ownermortgagepayment, ownerpaymentfreq, ownermaturitydate, ownerisitrentedoroccupied2, ownerratetype, ownerholder, ownerinterestrate, ownerrentedbalance2) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
                                db.query(insertanotherproperty, [uuidcoapp,items.owneroccupiedorrent,items.ownerunit,items.ownerstreet,items.ownercity,items.ownerprovince,items.ownerpostal,items.ownerestimatedprop,
                                    items.ownerorigval,items.ownerpurchasedate,items.ownerannualtax,items.monthlycondofee,items.ownerheatingcost,items.ownerisitrentedoroccupied1,items.ownercurrentbal,
                                    items.ownermortgagepayment,items.ownerpaymentfreq,items.ownermaturitydate,items.ownerisitrentedoroccupied2,items.ownerratetype,items.ownerholder,items.ownerinterestrate,
                                    items.ownerrentedbalance2], (err, result)=>{
                                    console.log(err,result)
                                });
                            })
                        }
                        }
                        if (index === 2){
                            if (anotherPropertylistcoapp2 !== null){
                            anotherPropertylistcoapp2.forEach(items => {
                                const insertanotherproperty = "INSERT INTO anotherproperty (approvalid, owneroccupiedorrent, ownerunit, ownerstreet, ownercity, ownerprovince, ownerpostal, ownerestimatedprop, ownerorigval, ownerpurchasedate, ownerannualtax, monthlycondofee, ownerheatingcost, ownerisitrentedoroccupied, ownercurrentbal, ownermortgagepayment, ownerpaymentfreq, ownermaturitydate, ownerisitrentedoroccupied2, ownerratetype, ownerholder, ownerinterestrate, ownerrentedbalance2) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
                                db.query(insertanotherproperty, [uuidcoapp,items.owneroccupiedorrent,items.ownerunit,items.ownerstreet,items.ownercity,items.ownerprovince,items.ownerpostal,items.ownerestimatedprop,
                                    items.ownerorigval,items.ownerpurchasedate,items.ownerannualtax,items.monthlycondofee,items.ownerheatingcost,items.ownerisitrentedoroccupied1,items.ownercurrentbal,
                                    items.ownermortgagepayment,items.ownerpaymentfreq,items.ownermaturitydate,items.ownerisitrentedoroccupied2,items.ownerratetype,items.ownerholder,items.ownerinterestrate,
                                    items.ownerrentedbalance2], (err, result)=>{
                                    console.log(err,result)
                                });
                            })
                        }
                        }
                    }
                    else{
                        return res.json({status: "Failed"});
                    }
                });
        })
    }
    let doc_id = 0;
    if (personalinfo.purposeofapplication == "First Time Home Buyer" || personalinfo.purposeofapplication == "Buying a Second Home or rental Property"){
        doc_id = 0
    }
    else{
        doc_id = 1
    }
    const insertapprovaldoc = "INSERT INTO approval_docs (approval_id,doc_id,create_date,paystub,letterofemployment,t4,noa,t1,mortgagestatement,propertytax,fireinsurance,renewalletter) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)"
    db.query(insertapprovaldoc, [result.insertId, doc_id,date,personalinfo.paystub,personalinfo.letterofemployment,personalinfo.t4,personalinfo.noa,personalinfo.t1,personalinfo.mortgagestatement,personalinfo.propertytax,personalinfo.fireinsurance,personalinfo.renewalletter], (err, result)=>{
    });
    const uuid = result.insertId
    const checkuuid = "SELECT * FROM approval WHERE Id=?"
    db.query(checkuuid, [uuid], (err, result)=>{
        if (result.length != 0){
            const email = result[0].email;
            const name = result[0].givenName;
            const lastname = result[0].surName;
            const verifyemail ={
                to: email,
                from: process.env.EMAIL_APPLY_FROM,
                subject: 'Greatway Notification',
                html: mail,
                attachments: [
                    {
                        filename: "icon.PNG",
                        content: cleanImgB64,
                        contentType: "image/png",
                        content_id: "logo",
                        disposition: "inline"
                    }
                ],
            }
            sgMail.send(verifyemail, function(err, info){})
            if (propertiesownedval.howmanyproperty > 0){
                anotherPropertylist.forEach(items => {
                    const insertanotherproperty = "INSERT INTO anotherproperty (approvalid, owneroccupiedorrent, ownerunit, ownerstreet, ownercity, ownerprovince, ownerpostal, ownerestimatedprop, ownerorigval, ownerpurchasedate, ownerannualtax, monthlycondofee, ownerheatingcost, ownerisitrentedoroccupied, ownercurrentbal, ownermortgagepayment, ownerpaymentfreq, ownermaturitydate, ownerisitrentedoroccupied2, ownerratetype, ownerholder, ownerinterestrate, ownerrentedbalance2) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
                    db.query(insertanotherproperty, [uuid,items.owneroccupiedorrent,items.ownerunit,items.ownerstreet,items.ownercity,items.ownerprovince,items.ownerpostal,items.ownerestimatedprop,
                        items.ownerorigval,items.ownerpurchasedate,items.ownerannualtax,items.monthlycondofee,items.ownerheatingcost,items.ownerisitrentedoroccupied1,items.ownercurrentbal,
                        items.ownermortgagepayment,items.ownerpaymentfreq,items.ownermaturitydate,items.ownerisitrentedoroccupied2,items.ownerratetype,items.ownerholder,items.ownerinterestrate,
                        items.ownerrentedbalance2], (err, result)=>{
                        console.log(err)
                    });
                })
            }
            return res.json({status: result[0]});
        }
        else{
            return res.json({status: "Failed"});
        }
    })
}
else{
    return res.json({status: "Failed"});
}
});
});
app.post('/api/approvalentryupdate', (req,res)=>{
    const selectedPerson = req.body.selectedPerson
    const coapplicants = req.body.coapplicants
    const underwriter = req.body.underwriter
    const updatgeselectedperson = "UPDATE approval SET purposeofapplication=?, whendoyoubuy=?, givenName=?, surName=?, birthDay=?, genDer=?," +
    "maritalstatus=?,email=?, phoneNumberWork=?, phoneNumberMobile=?, phoneNumberHome=?, NumberofDependent=?, unit=?, street=?, city=?, province=?," +
    "postalcode=?, country=?, howmanyyear=?, andmonths=?, doyouownorrent=?, howmuchareyourenting=?, unit2=?, street2=?, city2=?, province2=?, postalcode2=?,"+
    "country2=?, howmanyyear2=?, andmonths2=?, doyouownorrent2=?, howmuchareyourenting2=?, unit3=?, street3=?, city3=?, province3=?, postalcode3=?," +
    "country3=?, howmanyyear3=?, andmonths3=?, doyouownorrent3=?, howmuchareyourenting3=?, employmenttype1=?, companyname1=?, countryemployment1=?," +
    "provinceresidence1=?, cityresidence1=?, companyphonenumber1=?, jobtitle1=?, industrysector1=?, incometype1=?, annualsalary1=?, hourlysalary1=?," +
    "howmanyhoursperweek1=?, yearsincompany1=?, andmonthscompany1=?, yearsinindustry1=?, andmonthsindustry1=?, employmenttype2=?, companyname2=?," +
    "countryemployment2=?, provinceresidence2=?, cityresidence2=?, companyphonenumber2=?, jobtitle2=?, industrysector2=?, incometype2=?, annualsalary2=?,"+
    "hourlysalary2=?, howmanyhoursperweek2=?, yearsincompany2=?, andmonthscompany2=?, yearsinindustry2=?, andmonthsindustry2=?, employmenttype3=?,"+
    "companyname3=?, countryemployment3=?, provinceresidence3=?, cityresidence3=?, companyphonenumber3=?, jobtitle3=?, industrysector3=?, incometype3=?,"+
    "annualsalary3=?, hourlysalary3=?, howmanyhoursperweek3=?, yearsincompany3=?, andmonthscompany3=?, yearsinindustry3=?, andmonthsindustry3=?,"+
    "chequingammount=?, chequingcompany=?, savingsammount=?, savingscompany=?, rrspammount=?, rrspcompany=?, respammount=?, respcompany=?, tfsaammount=?,"+
    "tfsacompany=?, mutualfundammount=?, mutualfundcompany=?, pensionplanammount=?, pensionplancompany=?, vehicle1=?, vehicle1selling=?, vehicle2=?," +
    "vehicle2selling=?, vehicle3=?, vehicle3selling=?, lifeinsurance=?, lifeinsuranceammount=?,lifeinsurancefundammount=?, creditcard1=?, creditcard1ammount=?,"+
    "creditcard2=?, creditcard2ammount=?, creditcard3=?, creditcard3ammount=?, linecredit1=?, linecredit1ammount=?, linecredit2=?, linecredit2ammount=?,"+
    "carloan1=?, carloan1balance=?, carloan1monthly=?, carloan2=?, carloan2balance=?, carloan2monthly=?, carloan3=?, carloan3balance=?, carloan3monthly=?,"+
    "personalloan=?, personalbalance=?, personalmonthly=?, studentloan=?, studentbalance=?, studentmonthly=?, anotherproperty=?, owneroccupiedorrent=?,"+
    "ownerunit=?, ownerstreet=?, ownercity=?, ownerprovince=?, ownerpostal=?, ownerestimatedprop=?, ownerorigval=?, ownerpurchasedate=?, ownerannualtax=?,"+
    "monthlycondofee=?,ownerheatingcost=?, ownerisitrentedoroccupied=?, ownercurrentbal=?, ownermortgagepayment=?, ownerpaymentfreq=?, ownermaturitydate=?,"+
    "ownerisitrentedoroccupied2=?, ownerratetype=?, ownerholder=?, ownerinterestrate=?, ownerrentedbalance2=?, cosignor=?, declaredconsumer=?, typeofmortgage=?,"+
    "coapplicant=?, referralcode = ?, refferalemail = ?, refferalnumber = ?, Underwriter = ? WHERE Id=?"
    db.query(updatgeselectedperson, [
        selectedPerson.purposeofapplication,selectedPerson.whendoyoubuy,selectedPerson.givenName,selectedPerson.surName,selectedPerson.birthDay, 
        selectedPerson.genDer,selectedPerson.maritalstatus,selectedPerson.email,selectedPerson.phoneNumberWork,selectedPerson.phoneNumberMobile,
        selectedPerson.phoneNumberHome,selectedPerson.NumberofDependent,selectedPerson.unit,selectedPerson.street,selectedPerson.city,
        selectedPerson.province,selectedPerson.postalcode,selectedPerson.country,selectedPerson.howmanyyear,selectedPerson.andmonths,
        selectedPerson.doyouownorrent,selectedPerson.howmuchareyourenting,selectedPerson.unit2,selectedPerson.street2,selectedPerson.city2,
        selectedPerson.province2,selectedPerson.postalcode2,selectedPerson.country2,selectedPerson.howmanyyear2,selectedPerson.andmonths2,
        selectedPerson.doyouownorrent2,selectedPerson.howmuchareyourenting2,selectedPerson.unit3,selectedPerson.street3,selectedPerson.city3,
        selectedPerson.province3,selectedPerson.postalcode3,selectedPerson.country3,selectedPerson.howmanyyear3,selectedPerson.andmonths3,
        selectedPerson.doyouownorrent3,selectedPerson.howmuchareyourenting3,selectedPerson.employmenttype1,selectedPerson.companyname1,
        selectedPerson.countryemployment1,selectedPerson.provinceresidence1,selectedPerson.cityresidence1,selectedPerson.companyphonenumber1,
        selectedPerson.jobtitle1,selectedPerson.industrysector1,selectedPerson.incometype1,selectedPerson.annualsalary1,selectedPerson.hourlysalary1,
        selectedPerson.howmanyhoursperweek1,selectedPerson.yearsincompany1,selectedPerson.andmonthscompany1,selectedPerson.yearsinindustry1,
        selectedPerson.andmonthsindustry1,selectedPerson.employmenttype2,selectedPerson.companyname2,selectedPerson.countryemployment2,
        selectedPerson.provinceresidence2,selectedPerson.cityresidence2,selectedPerson.companyphonenumber2,selectedPerson.jobtitle2,
        selectedPerson.industrysector2,selectedPerson.incometype2,selectedPerson.annualsalary2,selectedPerson.hourlysalary2,selectedPerson.howmanyhoursperweek2,
        selectedPerson.yearsincompany2,selectedPerson.andmonthscompany2,selectedPerson.yearsinindustry2,selectedPerson.andmonthsindustry2,
        selectedPerson.employmenttype3,selectedPerson.companyname3,selectedPerson.countryemployment3,selectedPerson.provinceresidence3,
        selectedPerson.cityresidence3,selectedPerson.companyphonenumber3,selectedPerson.jobtitle3,selectedPerson.industrysector3,selectedPerson.incometype3,
        selectedPerson.annualsalary3,selectedPerson.hourlysalary3,selectedPerson.howmanyhoursperweek3,selectedPerson.yearsincompany3,
        selectedPerson.andmonthscompany3,selectedPerson.yearsinindustry3,selectedPerson.andmonthsindustry3,selectedPerson.chequingammount,
        selectedPerson.chequingcompany,selectedPerson.savingsammount,selectedPerson.savingscompany,selectedPerson.rrspammount,selectedPerson.rrspcompany,
        selectedPerson.respammount,selectedPerson.respcompany,selectedPerson.tfsaammount,selectedPerson.tfsacompany,selectedPerson.mutualfundammount,
        selectedPerson.mutualfundcompany,selectedPerson.pensionplanammount,selectedPerson.pensionplancompany,selectedPerson.vehicle1,
        selectedPerson.vehicle1selling,selectedPerson.vehicle2,selectedPerson.vehicle2selling,selectedPerson.vehicle3,selectedPerson.vehicle3selling,
        selectedPerson.lifeinsurance,selectedPerson.lifeinsuranceammount,selectedPerson.lifeinsurancefundammount,selectedPerson.creditcard1,
        selectedPerson.creditcard1ammount,selectedPerson.creditcard2,selectedPerson.creditcard2ammount,selectedPerson.creditcard3,
        selectedPerson.creditcard3ammount,selectedPerson.linecredit1,selectedPerson.linecredit1ammount,selectedPerson.linecredit2,
        selectedPerson.linecredit2ammount,selectedPerson.carloan1,selectedPerson.carloan1balance,selectedPerson.carloan1monthly,selectedPerson.carloan2,
        selectedPerson.carloan2balance,selectedPerson.carloan2monthly,selectedPerson.carloan3,selectedPerson.carloan3balance,selectedPerson.carloan3monthly,
        selectedPerson.personalloan,selectedPerson.personalbalance,selectedPerson.personalmonthly,selectedPerson.studentloan,selectedPerson.studentbalance,
        selectedPerson.studentmonthly,selectedPerson.anotherproperty,selectedPerson.owneroccupiedorrent,selectedPerson.ownerunit,selectedPerson.ownerstreet,
        selectedPerson.ownercity,selectedPerson.ownerprovince,selectedPerson.ownerpostal,selectedPerson.ownerestimatedprop,selectedPerson.ownerorigval,
        selectedPerson.ownerpurchasedate,selectedPerson.ownerannualtax,selectedPerson.monthlycondofee,selectedPerson.ownerheatingcost,
        selectedPerson.ownerisitrentedoroccupied,selectedPerson.ownercurrentbal,selectedPerson.ownermortgagepayment,selectedPerson.ownerpaymentfreq,
        selectedPerson.ownermaturitydate,selectedPerson.ownerisitrentedoroccupied2,selectedPerson.ownerratetype,selectedPerson.ownerholder,
        selectedPerson.ownerinterestrate,selectedPerson.ownerrentedbalance2,selectedPerson.cosignor,selectedPerson.declaredconsumer,
        selectedPerson.typeofmortgage,selectedPerson.coapplicant,selectedPerson.referralcode,selectedPerson.refferalemail,selectedPerson.refferalnumber,underwriter,
        selectedPerson.Id], (err, result)=>{
        console.log(err)
        if(!err){
            if (coapplicants.length > 0){
                coapplicants.forEach(coapplicantlist => {
                    const updatgeselectedperson2 = "UPDATE coappapproval SET givenName=?, surName=?, birthDay=?, genDer=?, maritalstatus=?,email=?, phoneNumberWork=?, phoneNumberMobile=?, phoneNumberHome=?, "+
                    "NumberofDependent=?,relationshiptoprimary=?, unit=?, street=?, city=?, province=?, postalcode=?, country=?, howmanyyear=?, andmonths=?, doyouownorrent=?, howmuchareyourenting=?, unit2=?, street2=?,"+
                    "city2=?, province2=?, postalcode2=?, country2=?, howmanyyear2=?, andmonths2=?, doyouownorrent2=?, howmuchareyourenting2=?, unit3=?, street3=?, city3=?, province3=?, postalcode3=?, country3=?, "+
                    "howmanyyear3=?, andmonths3=?, doyouownorrent3=?, howmuchareyourenting3=?, employmenttype1=?, companyname1=?, countryemployment1=?, provinceresidence1=?, cityresidence1=?, companyphonenumber1=?, "+
                    "jobtitle1=?, industrysector1=?, incometype1=?, annualsalary1=?, hourlysalary1=?, howmanyhoursperweek1=?, yearsincompany1=?, andmonthscompany1=?, yearsinindustry1=?, andmonthsindustry1=?, employmenttype2=?, "+
                    "companyname2=?, countryemployment2=?, provinceresidence2=?, cityresidence2=?, companyphonenumber2=?, jobtitle2=?, industrysector2=?, incometype2=?, annualsalary2=?, hourlysalary2=?, howmanyhoursperweek2=?, "+
                    "yearsincompany2=?, andmonthscompany2=?, yearsinindustry2=?, andmonthsindustry2=?, employmenttype3=?, companyname3=?, countryemployment3=?, provinceresidence3=?, cityresidence3=?, companyphonenumber3=?, "+
                    "jobtitle3=?, industrysector3=?, incometype3=?, annualsalary3=?, hourlysalary3=?, howmanyhoursperweek3=?, yearsincompany3=?, andmonthscompany3=?, yearsinindustry3=?, andmonthsindustry3=?, chequingammount=?, "+
                    "chequingcompany=?, savingsammount=?, savingscompany=?, rrspammount=?, rrspcompany=?, respammount=?, respcompany=?, tfsaammount=?, tfsacompany=?, mutualfundammount=?, mutualfundcompany=?, pensionplanammount=?,"+
                    "pensionplancompany=?, vehicle1=?, vehicle1selling=?, vehicle2=?, vehicle2selling=?, vehicle3=?, vehicle3selling=?, lifeinsurance=?, lifeinsuranceammount=?,lifeinsurancefundammount=?, creditcard1=?, "+
                    "creditcard1ammount=?, creditcard2=?, creditcard2ammount=?, creditcard3=?, creditcard3ammount=?, linecredit1=?, linecredit1ammount=?, linecredit2=?, linecredit2ammount=?, carloan1=?, carloan1balance=?, "+
                    "carloan1monthly=?, carloan2=?, carloan2balance=?, carloan2monthly=?, carloan3=?, carloan3balance=?, carloan3monthly=?, personalloan=?, personalbalance=?, personalmonthly=?, studentloan=?, studentbalance=?, "+
                    "studentmonthly=?, anotherproperty=?, owneroccupiedorrent=?, ownerunit=?, ownerstreet=?, ownercity=?, ownerprovince=?, ownerpostal=?, ownerestimatedprop=?, ownerorigval=?, ownerpurchasedate=?, ownerannualtax=?,"+
                    "monthlycondofee=?,ownerheatingcost=?, ownerisitrentedoroccupied=?, ownercurrentbal=?, ownermortgagepayment=?, ownerpaymentfreq=?, ownermaturitydate=?, ownerisitrentedoroccupied2=?, ownerratetype=?, ownerholder=?, "+
                    "ownerinterestrate=?, ownerrentedbalance2=?, cosignor=?, declaredconsumer=?, typeofmortgage=? WHERE Id=?"
                    db.query(updatgeselectedperson2, [coapplicantlist.givenName, coapplicantlist.surName, coapplicantlist.birthDay, coapplicantlist.genDer, coapplicantlist.maritalstatus, coapplicantlist.email, 
                        coapplicantlist.phonenumberwork, coapplicantlist.phonenumbermobile, coapplicantlist.phonenumberhome, coapplicantlist.numberofdependent, coapplicantlist.relationshiptoprimary, coapplicantlist.unit,
                        coapplicantlist.street, coapplicantlist.city, coapplicantlist.province, coapplicantlist.postalcode, coapplicantlist.country, coapplicantlist.howmanyyear, coapplicantlist.andmonths, 
                        coapplicantlist.doyouownorrent, coapplicantlist.howmuchareyourenting, coapplicantlist.unit2, coapplicantlist.street2, coapplicantlist.city2, coapplicantlist.province2, coapplicantlist.postalcode2, 
                        coapplicantlist.country2, coapplicantlist.howmanyyear2, coapplicantlist.andmonths2, coapplicantlist.doyouownorrent2, coapplicantlist.howmuchareyourenting2, coapplicantlist.unit3, 
                        coapplicantlist.street3, coapplicantlist.city3, coapplicantlist.province3, coapplicantlist.postalcode3, coapplicantlist.country3, coapplicantlist.howmanyyear3, coapplicantlist.andmonths3, 
                        coapplicantlist.doyouownorrent3, coapplicantlist.howmuchareyourenting3, coapplicantlist.employmenttype1, coapplicantlist.companyname1, coapplicantlist.countryemployment1,
                        coapplicantlist.provinceresidence1, coapplicantlist.cityresidence1, coapplicantlist.companyphonenumber1, coapplicantlist.jobtitle1, coapplicantlist.industrysector1, coapplicantlist.incometype1,
                        coapplicantlist.annualsalary1, coapplicantlist.hourlysalary1, coapplicantlist.howmanyhoursperweek1, coapplicantlist.yearsincompany1, coapplicantlist.andmonthscompany1, coapplicantlist.yearsindustry1,
                        coapplicantlist.andmonthsindustry1, coapplicantlist.employmenttype2, coapplicantlist.companyname2, coapplicantlist.countryemployment2, coapplicantlist.provinceresidence2, 
                        coapplicantlist.cityresidence2, coapplicantlist.companyphonenumber2, coapplicantlist.jobtitle2, coapplicantlist.industrysector2, coapplicantlist.incometype2, coapplicantlist.annualsalary2, 
                        coapplicantlist.hourlysalary2, coapplicantlist.howmanyhoursperweek2, coapplicantlist.yearsincompany2, coapplicantlist.andmonthscompany2, coapplicantlist.yearsindustry2, 
                        coapplicantlist.andmonthsindustry2, coapplicantlist.employmenttype3, coapplicantlist.companyname3, coapplicantlist.countryemployment3, coapplicantlist.provinceresidence3, 
                        coapplicantlist.cityresidence3, coapplicantlist.companyphonenumber3, coapplicantlist.jobtitle3, coapplicantlist.industrysector3, coapplicantlist.incometype3, coapplicantlist.annualsalary3, 
                        coapplicantlist.hourlysalary3, coapplicantlist.howmanyhoursperweek3, coapplicantlist.yearsincompany3, coapplicantlist.andmonthscompany3, coapplicantlist.yearsindustry3, 
                        coapplicantlist.andmonthsindustry3, coapplicantlist.chequingammount, coapplicantlist.chequingcompany, coapplicantlist.savingsammount, coapplicantlist.savingscompany, coapplicantlist.rrspammount, 
                        coapplicantlist.rrspcompany, coapplicantlist.respammount, coapplicantlist.respcompany, coapplicantlist.tfsammount, coapplicantlist.tfsacompany, coapplicantlist.mutualfundammount, 
                        coapplicantlist.mutualfundcompany, coapplicantlist.pensionplanammount, coapplicantlist.pensionplancompany, coapplicantlist.vehicle1, coapplicantlist.vehicle1selling, coapplicantlist.vehicle2, 
                        coapplicantlist.vehicle2selling, coapplicantlist.vehicle3, coapplicantlist.vehicle3selling, coapplicantlist.lifeinsurance, coapplicantlist.lifeinsuranceammount, 
                        coapplicantlist.lifeinsurancefundammount, coapplicantlist.creditcard1, coapplicantlist.creditcard1ammount, coapplicantlist.creditcard2, coapplicantlist.creditcard2ammount, 
                        coapplicantlist.creditcard3, coapplicantlist.creditcard3ammount, coapplicantlist.linecredit1, coapplicantlist.linecredit1ammount, coapplicantlist.linecredit2, coapplicantlist.linecredit2ammount,
                        coapplicantlist.carloan1, coapplicantlist.carloan1balance, coapplicantlist.carloan1monthly, coapplicantlist.carloan2, coapplicantlist.carloan2balance, coapplicantlist.carloan2monthly, 
                        coapplicantlist.carloan3, coapplicantlist.carloan3balance, coapplicantlist.carloan3monthly, coapplicantlist.personalloan, coapplicantlist.personalbalance, coapplicantlist.personalmonthly,
                        coapplicantlist.studentloan, coapplicantlist.studentbalance, coapplicantlist.studentmonthly, coapplicantlist.anotherproperty, coapplicantlist.owneroccupiedorrent, coapplicantlist.ownerunit,
                        coapplicantlist.ownerstreet, coapplicantlist.ownercity, coapplicantlist.ownerprovince, coapplicantlist.ownerpostal, coapplicantlist.ownerestimatedprop, coapplicantlist.ownerorigval, 
                        coapplicantlist.ownerpurchasedate, coapplicantlist.ownerannualtax, coapplicantlist.monthlycondofee, coapplicantlist.ownerheatingcost, coapplicantlist.ownerisitrentedoroccupied1, 
                        coapplicantlist.ownercurrentbal, coapplicantlist.ownermortgagepayment, coapplicantlist.ownerpaymentfreq, coapplicantlist.ownermaturitydate, coapplicantlist.ownerisitrentedoroccupied2,
                        coapplicantlist.ownerratetype, coapplicantlist.ownerholder, coapplicantlist.ownerinterestrate, coapplicantlist.ownerrentedbalance2, coapplicantlist.cosignor, coapplicantlist.declaredconsumer, 
                        coapplicantlist.typeofmortgage, coapplicantlist.Id], (err, result)=>{console.log(err)})
                })
            }
        }
        if(err === null){
            return res.json({status: "success"});
        }
    })
});



app.post('/api/getactivitylog', (req,res)=>{
    const id = req.body.approvalid
    const checkactivity = "SELECT * FROM approvalactivity where approvalId = ?"
    db.query(checkactivity, [id], (err, result)=>{
        if (result != null){
            if (result.length != 0){
                return res.json({status: result});
            }
            else{
                return res.json({status: "Failed"});
            }
        }

    })
});
app.post('/api/getapprovaldocnode', (req,res)=>{
    const id = req.body.approvalid
    
    const checkapproval = "SELECT * FROM approval_docs where approval_id = ?"
    db.query(checkapproval, [id], (err, result)=>{
        if (result != null){
            if (result.length != 0){
                return res.json({status: result});
            }
            else{
                return res.json({status: "Failed"});
            }
        }

    })
});
app.post('/api/savechecklistnode', (req,res)=>{
    const docfile = req.body.docfile
    const approval = req.body.approval
    
    var date = moment().format('Y-M-D H:m:s');
    const checkapproval = "SELECT * FROM approval_docs where approval_id = ?"
    db.query(checkapproval, [approval.Id], (err, ress)=>{
            if (ress.length != 0){
                
                const updatechecklist = "UPDATE approval_docs SET updated_date = ?,paystub = ?,letterofemployment = ?,t4 = ?,noa = ?,t1 = ?,mortgagestatement = ?,propertytax = ?, fireinsurance = ?,renewalletter = ? where id = ?"
                db.query(updatechecklist, [date, docfile.paystub,docfile.letterofemployment,docfile.t4,docfile.noa,docfile.t1,docfile.mortgagestatement,docfile.propertytax,docfile.fireinsurance,docfile.renewalletter,ress[0].id], (err, result)=>{
                    return res.json({status: result});
                })
                
            }
            else{
                const insertchecklist = "INSERT INTO approval_docs (approval_id,create_date, paystub, letterofemployment, t4,noa,t1,mortgagestatement,propertytax,fireinsurance,renewalletter) VALUES (?,?,?,?,?,?,?,?,?,?,?)"
                db.query(insertchecklist, [approval.Id,date, docfile.paystub,docfile.letterofemployment,docfile.t4,docfile.noa,docfile.t1,docfile.mortgagestatement,docfile.propertytax,docfile.fireinsurance,docfile.renewalletter], (err, result)=>{
                    return res.json({status: result});
                })
            }
        }
    )
});
app.post('/api/addactivity', (req,res)=>{
    const id = req.body.approvalid
    const activitytype = req.body.activitytype
    const activitydesc = req.body.activitydesc
    const adminname = req.body.adminname
    const activityid = req.body.activityid

    var date = moment().format('Y-M-D H:m:s');
    if (activityid === null){
        const insertactivity = "INSERT INTO approvalactivity (approvalId, activitydate, activitytype, activitydesc,nameofadmin) VALUES (?,?,?,?,?)"
        db.query(insertactivity, [id, date, activitytype, activitydesc,adminname], (err, result)=>{
        
            // if (adminname !== null){
            //     const updateapplication = "UPDATE approval SET Underwriter = ? where Id = ?"
            //     db.query(updateapplication, [adminname,id], (err, result)=>{
            //     })
            // } 
            if(!err){
                return res.json({status: "success"});
            }
            else{
                return res.json({status: "Failed"});
            }
        });
    }
    else{
        const updateactivity = "UPDATE approvalactivity SET activitydate = ?, activitytype = ?, activitydesc = ?, nameofadmin = ? WHERE activityId=?"
        db.query(updateactivity, [date,activitytype,activitydesc,adminname,activityid], (err, result)=>{
            if (adminname !== null){
                // const updateapplication = "UPDATE approval SET Underwriter = ? where Id = ?"
                // db.query(updateapplication, [adminname,id], (err, result)=>{
                // })
            } 
            if(!err){
                return res.json({status: "success"});
            }
            else{
                return res.json({status: "Failed"});
            }
          
        });
    }
});
app.post('/api/deleteactivitynode', (req,res)=>{
    var date = moment().format('Y-M-D H:m:s');
    const id = req.body.activityId
    const admin = req.body.adminname
    let activitytype = ""
    let activitydesc = ""
    if (id !== null){
        const selectactivity = "Select * from approvalactivity where activityId = ?"
        db.query(selectactivity, [id], (selectactivityerr, selectactivityresult)=>{
        if (selectactivityerr == null){
            activitytype = selectactivityresult[0].activitytype
            activitydesc = selectactivityresult[0].activitydesc
            const deleteactivity = "Delete from approvalactivity where activityId = ?"
            db.query(deleteactivity, [id], (err, result)=>{
                console.log(result);
                if(err === null){
                    const selectadmin = "Select * from admintbl where name = ?"
                    db.query(selectadmin, [admin], (errsel, resultsel)=>{
                        if (errsel === null){
                            console.log(resultsel)
                            const insertadudit = "INSERT INTO audithistory (UserID, Operation, ChangeDate, TableName, OldValue, PrimaryKey) VALUES (?,?,?,?,?,?)"
                            db.query(insertadudit, [resultsel[0].id, "D", date, "approvalactivity", activitytype + "," +activitydesc, id], (err, result)=>{

                            });
                        }
                    });
                return res.json({status: "success"});
                }
            })
        }
        else{
            console.log(selectactivityerr + " no errors on select activity")
        }
    });
}

});
//file upload insert
app.post('/api/fileupload', (req,res)=>{
    let files = req.files
    let person = req.body.Id
    let givenName = req.body.givenName
    let surName = req.body.surName
    console.log(person)
    fs.mkdir(`${__dirname}/public/uploads/${person}${givenName}${surName}`, (err) => {
      if (err) {
          
          throw err;
      }
  
     });
    for(const fileitems in files){
      const file = files[fileitems];
      file.mv(`${__dirname}/public/uploads/${person}${givenName}${surName}/${file.name}`, err=>{
  
      })
    }
      return res.json({status:{filePath: `/uploads/${person}`}});
  });
  app.post('/api/fileuploadcoapplicant1', (req,res)=>{
      let files = req.files
      let person = req.body.Id
      let givenName = req.body.givenName
      let surName = req.body.surName
      fs.mkdir(`${__dirname}/public/uploads/${person}${givenName}${surName}/Coapplicant`, (err) => {
          if (err) {
              
              throw err;
          }
         });
      for(const fileitems in files){
        const file = files[fileitems];
        file.mv(`${__dirname}/public/uploads/${person}${givenName}${surName}/Coapplicant/${file.name}`, err=>{
    
        })
      }
        return res.json({status:{filePath: `/uploads/${person}`}});
    });
    app.post('/api/fileuploadcoapplicant2', (req,res)=>{
      let files = req.files
      let person = req.body.Id
      let givenName = req.body.givenName
      let surName = req.body.surName
      fs.mkdir(`${__dirname}/public/uploads/${person}${givenName}${surName}/Coapplicant2`, (err) => {
          if (err) {
              
              throw err;
          }
         });
      for(const fileitems in files){
        const file = files[fileitems];
        file.mv(`${__dirname}/public/uploads/${person}${givenName}${surName}/Coapplicant2/${file.name}`, err=>{
       
        })
      }
        return res.json({status:{filePath: `/uploads/${person}`}});
  });
  
  //update fileupload
  app.post('/api/fileuploadupdate', (req,res)=>{
      let files = req.files
      let person = req.body.Id
      let givenName = req.body.givenName
      let surName = req.body.surName
      for(const fileitems in files){
        const file = files[fileitems];
        file.mv(`${__dirname}/public/uploads/${person}${givenName}${surName}/${file.name}`, err=>{
        })
      }
        return res.json({status:'success'});
    });
  
    //update fileupload
  app.post('/api/fileuploadupdate1', (req,res)=>{
      let files = req.files
      let person = req.body.Id
      let givenName = req.body.givenName
      let surName = req.body.surName
      for(const fileitems in files){
        const file = files[fileitems];
        file.mv(`${__dirname}/public/uploads/${person}${givenName}${surName}/Coapplicant1/${file.name}`, err=>{
        console.log(err)
      })
      }
        return res.json({status:'success'});
    });
    //update fileupload
  app.post('/api/fileuploadupdate2', (req,res)=>{
      let files = req.files
      let person = req.body.Id
      let givenName = req.body.givenName
      let surName = req.body.surName
      for(const fileitems in files){
        const file = files[fileitems];
        file.mv(`${__dirname}/public/uploads/${person}${givenName}${surName}/Coapplicant2/${file.name}`, err=>{
          console.log(err)
      })
      }
        return res.json({status:'success'});
    });
  
    app.get('/api/setcookie', (req, res) => {
        res.cookie(`UserIDGreatWay`,`28234972385351444841`, {
            maxAge:1000000,
            secure:true,
            httpOnly:true
        });
        res.send('Cookie have been saved successfully');
    });
app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`);
})








