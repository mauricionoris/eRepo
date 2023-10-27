var express = require('express'),
    bodyParser = require('body-parser'),
    lti = require('ims-lti'),
    ltiService = express.Router(),
    DAO_sup = require('../../lib/DAO/support/DAOConfig'),
    db_client = require('../../lib/DAO/clientDao')(DAO_sup.config()),
    db_taxonomy = require('../../lib/DAO/taxonomyDao')(DAO_sup.config()),
    wAPIlms = require('../../lib/console/webAPI_lms')(db_client, db_taxonomy),
    wAPIPublisher = require('../../lib/webAPI_publisher')(db_client);

var secrets = {};

// MemoryStore probably shouldn't be used in production
var nonceStore = new lti.Stores.MemoryStore();

ltiService.use(bodyParser.urlencoded({ extended: false }));
ltiService.use(bodyParser.json());

ltiService.use('/student',require('./lti/studentCtrl'));
ltiService.use('/cd'    ,require('./lti/coursedesignerCtrl'));

/* LTI Service - main page */
ltiService.get('/',function(req, res, next) {
  res.status(200).json('Erro: não foi identificado o contexto correto para este acesso. Por favor, contate o administrador do sistema ');
  
});

ltiService.get('/admin',function(req, res, next) {
  res.status(200).json('ok');
  
});


ltiService.get('/admin/report',function(req, res, next) {
  res.status(200).json('ok');
  
});

ltiService.post('/', bodyParser.urlencoded({ extended: false }), handleLaunch);

module.exports = ltiService;

function getRole(roles) {
    
    if (roles[0] === 'Learner') {
        return '/lms/student';
    }
    if (roles[0] === 'Instructor') {
        return '/lms/cd';
    }
    
    var err = new Error('Unknown role "' + roles[0] + '"');
    err.status = 403;

}

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
        if (!consumerKey) {
		var err = new Error('Expected a consumer');
		err.status = 422;
            	return next(err);
	}

        
        //console.log(req.body);
        wAPIlms.lti_lms_get({key: consumerKey}, function (er,data){
            wAPIPublisher.get_publisher_profile({id: data._id} , function(ret) {
                data.profile = ret.profile;
                //console.log(data);
                if (er) throw er;

                secrets[consumerKey] = data.lms.secret;

                getSecret(consumerKey, function (err, consumerSecret) {
                    if (err) {
                            return next(err);
                    }
                    var provider = new lti.Provider(consumerKey, consumerSecret, nonceStore);

                    provider.valid_request(req, function (err, isValid) {
                            if (err || !isValid) {
                                    return next(err || new Error('invalid lti'));
                            }

                            //console.log(provider);
                            req.session.lti = provider;
                            req.session.lti.client = data;
                            res.status(200).redirect(getRole(provider.body.roles));

                    });
                });
            });
        });

}

