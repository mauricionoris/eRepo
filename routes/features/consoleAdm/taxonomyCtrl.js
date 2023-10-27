var express = require('express'),
    bodyParser = require('body-parser'),
    reqLogin = require('../../../routes/common/requiresLogin'),
    DAO_sup = require('../../../lib/DAO/support/DAOConfig'),
    db_client = require('../../../lib/DAO/clientDao')(DAO_sup.config()),
    db_taxonomy = require('../../../lib/DAO/taxonomyDao')(DAO_sup.config()),
    wAPITaxon = require('../../../lib/console/webAPI_taxonomy')(db_client, db_taxonomy);
     
 
var taxonomyRouter = express.Router();

taxonomyRouter.use(bodyParser.urlencoded({ extended: false }));
taxonomyRouter.use(bodyParser.json());




/* Console Administrativo - main page */

taxonomyRouter.route('/')
    .get(reqLogin,function(req, res, next) {
           
        wAPITaxon.list_tree(req.session.pBag.profile.id, function(data) {
            //console.log(data);
            req.session.pBag.taxonomy = data;
            req.session.pBag.expand_taxonomy = "";            
            res.status(200).render('./features/console/taxonomy', {properties: req.session.pBag});
        });        
    });


taxonomyRouter.route('/:id/:path')
    .get(reqLogin,function(req, res, next) {
           
        wAPITaxon.list_tree(req.session.pBag.profile.id, function(data) {
            //console.log(data);
            req.session.pBag.taxonomy = data;
            req.session.pBag.expand_taxonomy = {    id: req.params.id,
                                                    path: req.params.path};
       
            res.status(200).render('./features/console/taxonomy', {properties: req.session.pBag});
        });        
    });


taxonomyRouter.route('/form')
    .get(reqLogin,function(req, res, next) {
            res.status(200).render('./features/console/taxonomy_form', {properties: req.session.pBag});
        });    
  

taxonomyRouter.route('/form')
    .post(reqLogin,function(req, res, next) {
         var fmCtrl = {
                      structure: {
                          publisherid: req.session.pBag.id,
                          name: req.body.name,
                          version: req.body.version,
                          active: true
                          }, 
                      tree : {
                          id : "0",
                          path : "0",
                          text : req.body.rootname,
                          nodes : [] 
                         }
                    };
                      
        console.log(fmCtrl);
        wAPITaxon.console_taxonomy_new(fmCtrl, function(result) {
            res.redirect("/console/taxonomy/" + result._id + "/" + result.tree.path);
        });

});

taxonomyRouter.route('/appendchild/:id/:path')
    .post(reqLogin,function(req, res, next) {
         var fmCtrl = {
           id: req.params.id,
           path: req.params.path,
           add: {text: req.body.node_text,
                     description: req.body.node_description,
                     nodes:[]}
         };
         
         console.log(fmCtrl);
         wAPITaxon.console_taxonomy_update(fmCtrl, function(result){
             res.redirect("/console/taxonomy/" + fmCtrl.id + "/" + fmCtrl.path);
             
         });
});

taxonomyRouter.route('/removechild/:id/:path')
    .post(reqLogin,function(req, res, next) {
         var fmCtrl = {
            id: req.params.id,
            path: req.params.path
         };
         
         wAPITaxon.console_taxonomy_remove(fmCtrl, function(result){
             res.redirect("/console/taxonomy/" + fmCtrl.id + "/" + fmCtrl.path);
             
         });
});




module.exports = taxonomyRouter;