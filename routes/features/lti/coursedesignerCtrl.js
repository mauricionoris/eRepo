var express = require('express'),
    bodyParser = require('body-parser'),
    ltiService = express.Router();
    DAO_sup = require('../../../lib/DAO/support/DAOConfig'),
    db_client = require('../../../lib/DAO/clientDao')(DAO_sup.config()),
    db_taxonomy = require('../../../lib/DAO/taxonomyDao')(DAO_sup.config()),
    wAPItaxon = require('../../../lib/console/webAPI_taxonomy')(db_client, db_taxonomy);


ltiService.use(bodyParser.urlencoded({ extended: false }));
ltiService.use(bodyParser.json());


/* LTI Service - main page */
ltiService.get('/:debug?',function(req, res, next) {
   wAPItaxon.lti_get_enabled_nodes(req.session.lti.client.lms.enabled_taxonomies, function (er, data) {
        req.session.lti.client.lms.taxonlist = data;
        res.status(200).render('./features/lti/coursedesigner', {properties: req.session.lti, showdetail:req.params.debug});        
        //res.status(200).json(req.session.lti);
   });
});

ltiService.post('/',function(req, res, next) {
   var taxon = {tree:"", node:{id:"", text:"", path:""}}; 
   if (req.body.lms_enabledtaxonomies !== "") {
        taxon = JSON.parse(req.body.lms_enabledtaxonomies);
   }     
   
   var fmCtrl = {
       _id: req.session.lti.client._id,
       lms: {id: req.session.lti.client.lms.id},
       creator: {user_id: req.session.lti.body.user_id,
                 username: req.session.lti.body.ext_user_username,
                 email: req.session.lti.body.lis_person_contact_email_primary},
       resource: {context_id:req.session.lti.body.context_id,
                  resource_link_id: req.session.lti.body.resource_link_id,
                  resource_link_title:req.session.lti.body.resource_link_title
        },
        taxonomy: {tree: taxon.tree, node:{ id: taxon.node.id, text: taxon.node.text, path: taxon.node.path}}
   };
   wAPItaxon.lti_set_resource(fmCtrl, function (er, data) {
       
        if (req.session.lti.body.launch_presentation_document_target === "window") {
            res.status(200).send("<script>window.close();</script>");
        } else {
        res.status(200).redirect(req.session.lti.body.launch_presentation_return_url);
        }
   });
});

module.exports = ltiService;


