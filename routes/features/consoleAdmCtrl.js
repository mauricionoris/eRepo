var express = require('express'),
    bodyParser = require('body-parser'),
    reqLogin = require('../../routes/common/requiresLogin'),
    DAO_sup = require('../../lib/DAO/support/DAOConfig'),
    db_client = require('../../lib/DAO/clientDao')(DAO_sup.config());
    wAPI = require('../../lib/webAPI_publisher')(db_client);
    

var s3 = require('../../s3')(); 
     
    
 
var consoleAdm = express.Router();

consoleAdm.use('/lms'       ,require('./consoleAdm/lmsCtrl'));
consoleAdm.use('/lob'       ,require('./consoleAdm/lobCtrl'));
consoleAdm.use('/taxonomy'  ,require('./consoleAdm/taxonomyCtrl'));
consoleAdm.use('/external'  ,require('./consoleAdm/externalStorageCtrl'));


consoleAdm.use(bodyParser.urlencoded({ extended: false }));
consoleAdm.use(bodyParser.json());




/* Console Administrativo - main page */
consoleAdm.route('/')
   .get(reqLogin, function(req, res, next) {
       wAPI.console_main(function(data){
           req.session.pBag.console.main = data;
           res.status(200).render('./features/console/index', {properties: req.session.pBag ,showdetail:false});
       });
    });

consoleAdm.route('/report')
    .get(reqLogin,function(req, res, next) {
        wAPI.console_report( function(data) {
            req.session.pBag.console.report = data;
            res.status(200).render('./features/console/report', {properties: req.session.pBag});
        });  
    });

consoleAdm.route('/user')
    .get(reqLogin,function(req, res, next) {
        res.status(200).render('./features/console/user', { properties: req.session.pBag });
});

consoleAdm.route('/user')
    .post(reqLogin,function(req, res, next) {
        var fmCtrl = {
           id: req.body.user_id,
           name: req.body.user_name,
           description: req.body.user_description,
           url: req.body.user_url,
           email: req.body.user_email,
           storage: req.body.storage_url,
           key: req.body.storage_key,
           secret: req.body.storage_secret
         };
        
        s3.createBucket(fmCtrl.id, function(er, ret) {
            wAPI.update_publisher_profile(fmCtrl, function(data) {
                req.session.pBag.profile = fmCtrl;
                res.status(200).render('./features/console/user', { properties: req.session.pBag });
            });
        });
         
    });


module.exports = consoleAdm;