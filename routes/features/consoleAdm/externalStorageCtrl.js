var express = require('express'),
    bodyParser = require('body-parser'),
    reqLogin = require('../../../routes/common/requiresLogin');

//to refactory
var s3 = require('../../../s3')(); 

var externalRouter = express.Router();
externalRouter.use(bodyParser.urlencoded({ extended: false }));
externalRouter.use(bodyParser.json());

function getexternalCredentials(profile) {
            var cred = {userid: profile.id,
                           key: profile.key,
                        secret: profile.secret,
                       storage: profile.storage}; 
                  
    return cred;
}

/* Console Administrativo - main page */
//Learning Objects 
externalRouter.route('/bucket')
    .get(reqLogin,function(req, res, next) {
        s3.listExternalBuckets(getexternalCredentials(req.session.pBag.profile), function(er, data) {
            res.status(200).json(data);
        });        
        
    });
externalRouter.route('/objects/:bucket')
    .get(reqLogin,function(req, res, next) {
        var params = {Bucket:req.params.bucket};
        s3.listExternalObjects(getexternalCredentials(req.session.pBag.profile), params, function(er, data) {
            res.status(200).json(data);
        });        
        
    });


module.exports = externalRouter;

