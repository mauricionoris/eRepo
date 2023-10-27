var express = require('express'),
    fileUpload = require('express-fileupload'),    
    bodyParser = require('body-parser'),
    reqLogin = require('../../../routes/common/requiresLogin'),
    DAO_sup = require('../../../lib/DAO/support/DAOConfig'),
    db_client = require('../../../lib/DAO/clientDao')(DAO_sup.config()),
    db_taxonomy = require('../../../lib/DAO/taxonomyDao')(DAO_sup.config()),
    wAPIlob = require('../../../lib/console/webAPI_lob')(db_client,db_taxonomy);



//to refactory
var s3 = require('../../../s3')(); 
var lobRouter = express.Router();



/* Console Administrativo - main page */
//Learning Objects 
lobRouter.route('/')
    .get(reqLogin,function(req, res, next) {

        wAPIlob.console_lob(req.session.pBag.id, function( data) {
            req.session.pBag.console.lob = data.lob;
            res.status(200).render('./features/console/lob', {properties: req.session.pBag});
        });        
        
    });

lobRouter.route('/form')
    .get(reqLogin,function(req, res, next) {
        wAPIlob.console_lob_edit(req.session.pBag.id, req.session.pBag.console.lob, null, function(data) {
            req.session.pBag.console.lob_edit = data;
            res.status(200).render('./features/console/lob_form', {properties: req.session.pBag});
        });
    });

lobRouter.route('/form/:id')
    .get(reqLogin,function(req, res, next) {
        wAPIlob.console_lob_edit(req.session.pBag.id, req.session.pBag.console.lob,req.params.id, function(data) {
            req.session.pBag.console.lob_edit = data;
            res.status(200).render('./features/console/lob_form', {properties: req.session.pBag});
        });
    });



lobRouter.route('/form')
    .post(reqLogin, s3.prepareUpload('lob_file'), function (req, res) {
        var fmCtrl = {
                       id: req.body.lob_id,
                       name: req.body.lob_name,
                       type: req.body.lob_type,
                       style: req.body.lob_style,
                       vigency_start: new Date(req.body.lob_vigency_start),
                       vigency_end: new Date(req.body.lob_vigency_end),
                       active: req.body.lob_active? true: false,
                       taxonomies: JSON.parse(req.body.lob_selectedtaxonomies),
                       object: null
                };   
                
        if (fmCtrl.type === 'Externo') {
            fmCtrl.object = {Bucket: req.body.lob_externalbucket, Key: req.body.lob_externalobject};
            wAPIlob.console_lob_update(req.session.pBag.id, fmCtrl, function(result) {
                //console.log(result);
                req.session.pBag.console.lob_edit = null;
                res.status(200).redirect("/console/lob");
            });  
        } 
        
        if (fmCtrl.type === 'Interno') {
            s3.upload({Bucket:req.session.pBag.profile.id}, req.file, function (err, data) {
                if (err) {
                        return res.status(500).send(err).end();
                }
                fmCtrl.object = data;
                wAPIlob.console_lob_update(req.session.pBag.id, fmCtrl, function(result) {
                    //console.log(result);
                    req.session.pBag.console.lob_edit = null;
                    res.status(200).redirect("/console/lob");
                });
            });
        }
        if (fmCtrl.type === 'Link') {
  
            fmCtrl.object = {Location:req.body.lob_link };
            wAPIlob.console_lob_update(req.session.pBag.id, fmCtrl, function(result) {
                //console.log(result);
                req.session.pBag.console.lob_edit = null;
                res.status(200).redirect("/console/lob");
            });
        }        
        
        
    });
        

lobRouter.route('/remove')
    .post(reqLogin,s3.prepareUpload(''), function(req, res, next) {
        
         var fmCtrl = {
           id: req.body.lob_id_remove
         };
        wAPIlob.console_lob_remove(req.session.pBag.id, fmCtrl, function(result) {
            req.session.pBag.console.lob_edit = null;
            res.status(200).redirect("/console/lob");
        });
    });




module.exports = lobRouter;

