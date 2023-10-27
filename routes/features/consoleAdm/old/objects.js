var bb = require('busboy');
var inspect = require('util').inspect;
var express = require('express');
var requiresLogin = require('../../common/requiresLogin');
var model = require('../models/model.js');




var objectRouter = express.Router({mergeParams: true});
var numPartsLeft = 0;
var startTime = new Date();
var maxUploadTries = 3;
var multipartMap = {Parts: []};
var multiPartParams = {Bucket: 0, Key:  1, ContentType: 2};
var inf = {};

objectRouter.route('/')
    .get(requiresLogin,function(req, res, next) {
        var params = {Bucket: req.params.bucketId};
        var s3 = require('../s3')(req.session.mykeys);
        s3.listObjects(params, function(err, data) {
            if (err) res.render("error", err); // an error occurred
            else { // successful response
                res.render('bucket_objects_list', { 
                        title: global.Title, 
                        subtitle: global.Subtitle,
                        bucketId: params.Bucket,
                        object_list: data.Contents,
                        user: req.user

                        });
            }
        });
    });

objectRouter.route('/:objectKey')
    .get(requiresLogin,function(req, res, next) {
        var params = {Bucket: req.params.bucketId, Key: req.params.objectKey};
        inf.user_id = global.mykeys.user_id; 
        if (params.Key == -1) { //upload a new file
            model.subjects.find({user_id: inf.user_id} , function(e, s) {
                res.render('object_upload', {
                            title: global.Title, 
                            subtitle: global.Subtitle,
                            bucketId: params.Bucket,
                            subjects: s,
                            user: req.user
                });
            });
            
        } else {
            var s3 = require('../s3')(req.session.mykeys);
            res.render('object_detail', { 
                  title: global.Title, 
                  subtitle: global.Subtitle,
                  bucketId: params.Bucket,
                  objectKey: params.Key,  
                  url: s3.getSignedUrl('getObject', params),
                  user: req.user
                  
                  });
        }
    });

objectRouter.route('/url/:objectKey')
    .get(requiresLogin,function(req, res, next) {
        var params = {Bucket: req.params.bucketId, Key: req.params.objectKey};
        var s3 = require('../s3')(req.session.mykeys);
        res.render('object_signed_url', { 
                        title: global.Title, 
                        subtitle: global.Subtitle,
                        bucketId: params.Bucket,
                        url: s3.getSignedUrl('getObject', params),
                        user: req.user

                        });
        
        
        
        
    });

objectRouter.route('/remove/:objectKey')
    .get(requiresLogin,function(req, res, next) {
        var params = {Bucket: req.params.bucketId, Key: req.params.objectKey};
        console.log("Params: " + params);
        var s3 = require('../s3')(req.session.mykeys);
        s3.deleteObject(params, function(err,data){
             if (err) console.log(err, err.stack); // an error occurred
             else    {
                res.send(data);
             } 
        });
    });

objectRouter.route('/uploadobject')
    .post(requiresLogin,function(req, res, next){
        var s3 = require('../s3')(req.session.mykeys);
        var busboy = new bb({headers: req.headers});

        busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
            console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
            
            multiPartParams.ContentType = mimetype;
            
            file.fileRead = [];
            file.on('data', function(data) {
                this.fileRead.push(data);     
            });
            file.on('end', function() {
                var finalBuffer = Buffer.concat(this.fileRead);

                // Upload
                startTime = new Date();
                var partNum = 0;
                var partSize = 1024 * 1024 * 5; // Minimum 5MB per chunk (except the last part) http://docs.aws.amazon.com/AmazonS3/latest/API/mpUploadComplete.html
                numPartsLeft = Math.ceil(finalBuffer.length / partSize);

                // Multipart
                console.log("Creating multipart upload for:", multiPartParams.Key);
                s3.createMultipartUpload(multiPartParams, function(mpErr, multipart){
                  if (mpErr) { console.log('Error!', mpErr); return; }
                  console.log("Got upload ID", multipart.UploadId);

                  // Grab each partSize chunk and upload it as a part
                  for (var rangeStart = 0; rangeStart < finalBuffer.length; rangeStart += partSize) {
                    partNum++;
                    var end = Math.min(rangeStart + partSize, finalBuffer.length),
                        partParams = {
                          Body: finalBuffer.slice(rangeStart, end),
                          Bucket: multiPartParams.Bucket,
                          Key: multiPartParams.Key,
                          PartNumber: String(partNum),
                          UploadId: multipart.UploadId
                        };

                    // Send a single part
                    console.log('Uploading part: #', partParams.PartNumber, ', Range start:', rangeStart);
                    uploadPart(s3, res, multipart, partParams);
                  }
                });
            });
        });
        busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
            switch(fieldname) {
                case 'objectKey':
                    multiPartParams.Key = val;
                    break;
                case 'bucketId':
                    multiPartParams.Bucket = val;
                    break;
                case 'subject_id':
                    inf.subject_id = val;
                    break;
            }
            console.log('Field [' + fieldname + ']: value: ' + inspect(val));
       });
        busboy.on('finish', function() {
            console.log('Done parsing form!');
       });

        req.pipe(busboy);
    });


function completeMultipartUpload(s3instance, res, doneParams) {
  s3instance.completeMultipartUpload(doneParams, function(err, data) {
    if (err) {
      console.log("An error occurred while completing the multipart upload");
      console.log(err);
    } else {
     
      inf.delta = (new Date() - startTime) / 1000;
      inf.data = data;
      inf.bucket = doneParams.Bucket;
      inf.object_key = doneParams.Key;
      console.log('Completed upload in', inf.delta, 'seconds');
      console.log('Final upload data:', inf.data);

      setuser_object(doneParams,res);
            
      }
  });
}

function uploadPart(s3instance, res, multipart, partParams, tryNum) {
  var tryNum = tryNum || 1;
  s3instance.uploadPart(partParams, function(multiErr, mData) {
    if (multiErr){
      console.log('multiErr, upload part error:', multiErr);
      if (tryNum < maxUploadTries) {
        console.log('Retrying upload of part: #', partParams.PartNumber)
        uploadPart(s3instance, multipart, partParams, tryNum + 1);
      } else {
        console.log('Failed uploading part: #', partParams.PartNumber)
      }
      return;
    }
    multipartMap.Parts[this.request.params.PartNumber - 1] = {
      ETag: mData.ETag,
      PartNumber: Number(this.request.params.PartNumber)
    };
    console.log("Completed part", this.request.params.PartNumber);
    console.log('mData', mData);
    if (--numPartsLeft > 0) return; // complete only when all parts uploaded

    var doneParams = {
      Bucket: partParams.Bucket,
      Key: partParams.Key,
      MultipartUpload: multipartMap,
      UploadId: multipart.UploadId
    };

    console.log("Completing upload...");
    completeMultipartUpload(s3instance, res, doneParams);
  });
}

function setuser_object(doneParams, res) {
    
    model.user_objects.findOneAndUpdate({
                user_id: inf.user_id
           , object_key: inf.object_key
           ,     bucket: inf.bucket
    }, {
        $set: {
                user_id: inf.user_id
           ,     bucket: inf.bucket
           , object_key: inf.object_key
           , subject_id: inf.subject_id
        }
    }
    , {upsert: true, 'new': true}, function(err, r) {
        
        res.render('object_upload_status', { 
            title: global.Title, 
            subtitle: global.Subtitle,
            bucketId: doneParams.Bucket,
            objectKey: doneParams.Key,
            data: inf.data,
            TimeToUpload: inf.delta
            });
        
    });
 }



function sortFunction(a, b) {
    if (a.PartNumber === b.PartNumber) {
        return 0;
    }
    else {
        return (a.PartNumber < b.PartNumber) ? -1 : 1;
    }
}

module.exports = objectRouter;

