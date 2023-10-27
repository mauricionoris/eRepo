/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var lti = require('ims-lti');
var model = require('../models/model.js');

// MemoryStore probably shouldn't be used in production
var nonceStore = new lti.Stores.MemoryStore();

var secrets = {};

/* GET home page. */
router.get('/launch', function(req, res, next) {
  res.render('./features/lti/lti_launch_tc_1', { title: 'ToomRepo - A web semantic repository'});
});

router.post('/launch/tp', bodyParser.urlencoded({ extended: false }), handleLaunch);
router.post('/launch/srls', bodyParser.urlencoded({ extended: false }), setResourseLinkSubject);


function getSecret (consumerKey, cb) {

        var secret = secrets[consumerKey];
        //console.log(secret);
        
        if (secret) {
		cb(null, secret);
		return;
	}

	var err = new Error('Unknown consumer "' + consumerKey + '"');
	err.status = 403;

	cb(err);
}

function handleLaunch (req, res, next) {

	if (!req.body) {
		var err = new Error('Expected a body');
		err.status = 400;

		return next(err);
	}
        var consumerKey = req.body.oauth_consumer_key;
        //console.log(req.body);
        if (!consumerKey) {
		var err = new Error('Expected a consumer');
		err.status = 422;
            	return next(err);
	}
       
        model.clients.findOne({key: consumerKey, guid: req.body.tool_consumer_instance_guid} , function(e, c) {
            //console.log(c);
            if (e) throw e;
            secrets[consumerKey] = c.secret;
            secrets.user_id = c.user_id;
            secrets.client_id = c.client_id;
            
            getSecret(consumerKey, function (err, consumerSecret) {
		if (err) {
			return next(err);
		}
		var provider = new lti.Provider(consumerKey, consumerSecret, nonceStore);

		provider.valid_request(req, function (err, isValid) {
			if (err || !isValid) {
				return next(err || new Error('invalid lti'));
			}

			var body = {};
			[
				'roles', 'admin', 'alumni', 'content_developer', 'guest', 'instructor',
				'manager', 'member', 'mentor', 'none', 'observer', 'other', 'prospective_student',
				'student', 'ta', 'launch_request', 'username', 'userId', 'mentor_user_ids',
				'context_id', 'context_label', 'context_title', 'body'
			].forEach(function (key) {
				body[key] = provider[key];
			});

                        model.users.findOne({user_id: secrets.user_id}, function(e, u) {
                            if (e) throw e;
                            global.mykeys = u;      
                        });

                        //course designer                
                        if (!provider['student']) {
                            var inf = {
                                	 client_id: secrets.client_id
                                    ,    resource_link_id: body.body.resource_link_id
                                    ,    resource_link_title: body.body.resource_link_title
                                    ,    launch_presentation_return_url: body.body.launch_presentation_return_url
                                    ,    selected_subject_id:0
                                    ,    subjects: []
                                    ,    show_modal: false
                                    ,    username: body.username
                            };
                            
                                //console.log(secrets);
                            model.subjects.find({user_id: secrets.user_id} , function(e, s) {
                                model.client_resource_links.findOne({client_id: secrets.client_id, resource_link_id: inf.resource_link_id } , function(e, r) {
                                    if (r ===null) {r = {subject_id: '0'};}
                                    inf.subjects = s;
                                    inf.selected_subject_id = r.subject_id;
                                    notStudentView(inf, res);      
                                });
                            });  
                        }            

                        // student view
                        if (provider['student']) {
                            
                            var inf = {
                                	 client_id: secrets.client_id
                                    ,    resource_link_id: body.body.resource_link_id
                                    ,    resource_link_title: body.body.resource_link_title
                                    ,    launch_presentation_return_url: body.body.launch_presentation_return_url
                                    ,    selected_subject_id:0
                                    ,    selected_subject:'t'
                                    ,    objects: []
                                    ,    show_modal: true
                                    ,    username: body.username
                            };
                            
                            model.client_resource_links.findOne({client_id: secrets.client_id, resource_link_id: inf.resource_link_id } , function(e, crl) {
                                model.user_objects.find({user_id: secrets.user_id, subject_id: crl.subject_id} , function(ee, ubs) {
                                    model.subjects.findOne({user_id: secrets.user_id, subject_id: crl.subject_id} , function(eee, s) {
                                        var s3 = require('../s3')(global.mykeys);
                                        var obj = [];
                                        var i = 0;   //TODO Order criteria 
                                        for (var key in ubs) {
                                            var ub = ubs[key];

                                            var o = {
                                                object_key: ub.object_key,
                                                subject_id: ub.subject_id,
                                                user_id: ub.user_id,
                                                bucket: ub.bucket,
                                                order: i++,
                                                url: s3.getSignedUrl('getObject', {Bucket: ub.bucket
                                                                                    , Key: ub.object_key
                                                                                , Expires:60*24}) //valid only for one day
                                            }; 
                                            obj.push(o);        
                                        }

    //                                    console.log(obj);
                                        inf.selected_subject = s.title;
                                        inf.objects = obj;
                                        studentView(inf, res);    
                                    });
                                });
                            });  
                            
                        }            
		});
            });
        });
}


function notStudentView(inf, res){
   // console.log(inf);
    res.render('./features/lti/lms_coursedesigner', {inf: inf});
};

function studentView(inf, res){
   // console.log(inf);
    res.render('./features/lti/lms_student', { inf: inf });
};

function setResourseLinkSubject(req, res, next) {
    var inf = JSON.parse(req.body.inf);
    
    model.client_resource_links.findOneAndUpdate({
                client_id: inf.client_id
       , resource_link_id: inf.resource_link_id 
    }, {
        $set: {
                client_id: inf.client_id
       , resource_link_id: inf.resource_link_id         
             , subject_id: req.body.listSubjects 
        }
    }
    , {upsert: true, 'new': true}, function(err, r) {
            inf.show_modal = true;
            notStudentView(inf, res);
    });
 }


module.exports  = router;