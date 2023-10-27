var express = require('express');
var bodyParser = require('body-parser');
var requiresLogin = require('./requiresLogin');

var bucketRouter = express.Router();

bucketRouter.use('/:bucketId/objects', require('./objects'));

bucketRouter.use(bodyParser.urlencoded({ extended: true }));
bucketRouter.use(bodyParser.json());

/* Bucket's list */
bucketRouter.route('/')
    .get(requiresLogin, function(req, res, next) {
    var s3 = require('../s3')(req.session.mykeys);
    s3.listBuckets(function(err, data) {
        if (err) { res.render("error", err); }
        else {
            res.render('bucket_list', { 
                title: global.Title,
                subtitle: global.Subtitle,
                bucket_list: data.Buckets,
                user: req.user
                });
        }
    });
});

bucketRouter.route('/:bucketId')
    .get(requiresLogin, function(req, res, next) {
        var id = req.params.bucketId;
        if (id == -1) {//create new bucket
            res.render('bucket_new', { 
                    title: global.Title, 
                    subtitle: global.Subtitle,
                    user: req.user
                  });
        } else {
            res.render('bucket_form', { title: global.Title, subtitle: global.Subtitle, bucketId: id });
        }
    });

bucketRouter.route('/createbucket')
    .post(requiresLogin, function(req, res, next){
        
        var params = {
                Bucket: req.body.bucketId
                /*
                ACL: 'private | public-read | public-read-write | authenticated-read',
                GrantFullControl: 'STRING_VALUE'
                GrantRead: 'STRING_VALUE'
                GrantReadACP: 'STRING_VALUE'
                GrantWrite: 'STRING_VALUE'
                GrantWriteACP: 'STRING_VALUE'
                */
              };
        var s3 = require('../s3')(req.session.mykeys);
        s3.createBucket(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else  {
                console.log(data);
                // successful response
                res.render('bucket_form',{
                    title: global.Title,
                    subtitle: global.Subtitle,
                    bucketId: params.Bucket,
                    user: req.user

                })
            }        
             
        });
        
    });



module.exports = bucketRouter;


