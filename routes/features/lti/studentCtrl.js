var express = require('express'),
    bodyParser = require('body-parser'),
    ltiService = express.Router(),
    DAO_sup = require('../../../lib/DAO/support/DAOConfig'),
    db_client = require('../../../lib/DAO/clientDao')(DAO_sup.config()),
    db_taxonomy = require('../../../lib/DAO/taxonomyDao')(DAO_sup.config()),
    db_statistic = require('../../../lib/DAO/statisticDao')(DAO_sup.config()),
    wAPItaxon = require('../../../lib/console/webAPI_taxonomy')(db_client, db_taxonomy,db_statistic),
    wAPI_student = require('../../../lib/lti/webAPI_student')(db_statistic);

var s3 = require('../../../s3')(); 

ltiService.use(bodyParser.urlencoded({ extended: false }));
ltiService.use(bodyParser.json());




/* LTI Service - main page */
ltiService.get('/',function(req, res, next) {
    studentview(req,res,false);
});
ltiService.get('/debug',function(req, res, next) {
    studentview(req,res,true);
});


ltiService.post('/',function(req, res, next) {
    var lobs = ""; 
      //statistics  
        var fmCtrl = {
          publisherid: req.session.lti.client._id, 
          launchid: JSON.parse(req.session.lti.body.lis_result_sourcedid).data.launchid,
          launchinstant: req.body.launch_instant,
          resource: {
                  lms: req.session.lti.client.lms.id,
                  context_id: req.session.lti.body.context_id,    
                  resource_link_id: req.session.lti.body.resource_link_id,   
                  student_id: req.session.lti.body.user_id
              },
          lobs: []
        };

    if (req.body.student_actions !== "") {
      lobs = JSON.parse(req.body.student_actions);

      lobs.forEach(function(item) {
          if ('interactions' in item) {
              var stat = {id:item.id,
                        rate: ('rate' in item) ? item.rate : "0" 
               ,interactions: item.interactions
                  , comments: ('comments' in item) ? item.comments : "" };
              fmCtrl.lobs.push(stat);
          }
      });
    }
    wAPI_student.lti_record_lob_interaction(fmCtrl, function(er, data) {
        if (req.session.lti.body.launch_presentation_document_target === "window") {
            res.status(200).send("<script>window.close();</script>");
        } else {
        res.status(200).redirect(req.session.lti.body.launch_presentation_return_url);
        }
        
    }); 
});


module.exports = ltiService;

function getexternalCredentials(profile) {
            var cred = {userid: profile.id,
                           key: profile.key,
                        secret: profile.secret,
                       storage: profile.storage}; 
                  
    return cred;
}

function studentview(req,res,debug) {
    //console.log(req.session.lti.client.lms);

    var fmCtrl = {
            _id: req.session.lti.client._id,
            link: getValidLink(req.session.lti.client.lms.lti_link, req.session.lti.body),
            lms: {id: req.session.lti.client.lms.id},
            student: {id: req.session.lti.body.user_id}
            };
   //console.log(fmCtrl); 
   
   wAPItaxon.lti_get_objects_list(fmCtrl, function (er, data) {
        var credential = getexternalCredentials(req.session.lti.client.profile);
        data.forEach(function(item) {
            if (item.type === 'Externo') {
                var params = {Bucket: item.object.Bucket, Key: item.object.Key};
                item.object.Location = s3.getExternalSignedURL(credential,params);
            }
        });
        //console.log(data);
        req.session.lti.client.lob = data;
        res.status(200).render('./features/lti/student', {properties: req.session.lti, showdetail:debug});        
        //res.status(200).json(req.session.lti);
   });
};
function getValidLink(links, ctx) {
     //return 0;
     var innerLinks  = links.filter(item => item.resource.resource_link_id === ctx.resource_link_id);
     var lastValue = Math.max.apply(Math,innerLinks.map(function(o) {return o.creation_date;}));
     return innerLinks.filter(item => item.creation_date === lastValue)[0];
    
}

