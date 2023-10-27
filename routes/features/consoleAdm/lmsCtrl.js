var express = require('express'),
    bodyParser = require('body-parser'),
    reqLogin = require('../../../routes/common/requiresLogin'),
    DAO_sup = require('../../../lib/DAO/support/DAOConfig'),
    db_client = require('../../../lib/DAO/clientDao')(DAO_sup.config()),
    db_taxonomy = require('../../../lib/DAO/taxonomyDao')(DAO_sup.config()),
    wAPIlms = require('../../../lib/console/webAPI_lms')(db_client, db_taxonomy);
     
 
var lmsRouter = express.Router();


lmsRouter.use(bodyParser.urlencoded({ extended: false }));
lmsRouter.use(bodyParser.json());




/* Console Administrativo - main page */


lmsRouter.route('/')
    .get(reqLogin,function(req, res, next) {
        wAPIlms.console_lms(req.session.pBag.id, function( data) {
            req.session.pBag.console.lms = data.lms;
            res.status(200).render('./features/console/lms', {properties: req.session.pBag});
        });
    });

lmsRouter.route('/form')
    .get(reqLogin,function(req, res, next) {
        wAPIlms.console_lms_edit(req.session.pBag.id, req.session.pBag.console.lms,null, function(data) {
            req.session.pBag.console.lms_edit = data;
            res.status(200).render('./features/console/lms_form', {properties: req.session.pBag});
        });
    });

lmsRouter.route('/form/:id')
    .get(reqLogin,function(req, res, next) {
        wAPIlms.console_lms_edit(req.session.pBag.id, req.session.pBag.console.lms,req.params.id, function(data) {
            req.session.pBag.console.lms_edit = data;
            res.status(200).render('./features/console/lms_form', {properties: req.session.pBag});
        });
    });

lmsRouter.route('/form')
    .post(reqLogin,function(req, res, next) {
         var fmCtrl = {
           id: req.body.lms_id,
           name: req.body.lms_name,
           platform: req.body.lms_platform,
           version: req.body.lms_version,
           url: req.body.lms_url,
           key: req.body.lms_key,
           secret: req.body.lms_secret,
           active: req.body.lms_active ? true: false,
           parameters:{
            adaptation_weight: { learning_style:  Number(req.body.lms_param_style), recommendation: Number(req.body.lms_param_reco)}
        },
           enabled_taxonomies: JSON.parse(req.body.lms_enabledtaxonomies)
        };
        console.log(fmCtrl);
        wAPIlms.console_lms_update(req.session.pBag.id, fmCtrl, function(result) {
            req.session.pBag.console.lms_edit = null;
            res.status(200).redirect("/console/lms");
        });

});

lmsRouter.route('/remove')
    .post(reqLogin,function(req, res, next) {
        
         var fmCtrl = {
           id: req.body.lms_id_remove
         };
        wAPIlms.console_lms_remove(req.session.pBag.id, fmCtrl, function(result) {
            req.session.pBag.console.lms_edit = null;
            res.status(200).redirect("/console/lms");
        });
});

module.exports = lmsRouter;