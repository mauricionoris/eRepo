//AWS Account ID: xxxxxxxxxxxxxxx
//Canonical User ID: xxxxxxxxxxxxxxxxxxxx


var     aws = require('aws-sdk'), 
        multer = require('multer');

function getbucketname(userid) {
    console.log(userid.substring(userid.lastIndexOf('|')+1));        
    return userid.substring(userid.lastIndexOf('|')+1);
}        

function createbucket(params, cb) {
    var trEndpoint = new aws.Endpoint('s3-sa-east-1.amazonaws.com');
    var s3 = new aws.S3({endpoint: trEndpoint, s3ForcePathStyle: true});  
    s3.createBucket(params, function(err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else  {
                    console.log(data);
                    
              }
              return cb(err, data);
    });   
}


function storage(userid) {
    var trEndpoint = new aws.Endpoint('s3-sa-east-1.amazonaws.com');
    var s3 = new aws.S3({Bucket: getbucketname(userid), endpoint: trEndpoint, s3ForcePathStyle: true});  
    return s3;
}

function external_storage(profile) {
//    var credentials = new aws.SharedIniFileCredentials({profile: profile.userid});
//    aws.config.credentials = credentials;
//    var trEndpoint = new aws.Endpoint(profile.storage);
//    var s3 = new aws.S3({endpoint: trEndpoint, s3ForcePathStyle: true});  
//    return s3;
//  var credentials = new aws.SharedIniFileCredentials({profile: profile.userid});
    
    var trEndpoint = new aws.Endpoint(profile.storage);
    var s3 = new aws.S3({endpoint: trEndpoint, 
                      accessKeyId: profile.key,
                  secretAccessKey: profile.secret, 
                 s3ForcePathStyle: true});  
    return s3;
}

module.exports = function() {

    return {
        createBucket: function(userid, cb) {
            var params = {
                Bucket: getbucketname(userid)
            };
            createbucket(params, cb);
        },
        
        //max size 50Mb    
        prepareUpload: function(file) {
            var storage = multer.memoryStorage();
            return  multer({storage: storage, limits: {fileSize: 50*1024*1024}}).single(file);
        },

        list: function(params, cb) {
            //console.log(s3);
            storage(params.Bucket).listObjects({Bucket: getbucketname(params.Bucket)}, function(err, data) {
                    if (err) console.log(err, err.stack); // an error occurred
                    return cb(data);           // successful response
                  });
        },
        getURL: function(params, cb) {
            params.Bucket = params.Bucket.substring(6);
            var url = storage(params.Bucket).getSignedUrl('getObject',params);
            return cb(url);
        },     
        getFile: function() {},
        removeFile: function() {},
        shareFile: function() {},

        listExternalBuckets: function(credential, cb) {

            external_storage(credential).listBuckets({}, function(err, data) {
                    if (err) console.log(err, err.stack); // an error occurred
                    return cb(err,data);           // successful response
            });
            
        },
        
        listExternalObjects: function(credential, bucket, cb) {
            external_storage(credential).listObjects(bucket, function(err, data) {
                    if (err) console.log(err, err.stack); // an error occurred
                    return cb(err,data);                  // successful response
            });
                
        },

        getExternalSignedURL: function(credential, params) {
            //console.log(credential);
            //console.log(params);
            return external_storage(credential).getSignedUrl('getObject',params);
        },

        upload: function(params, file, cb) {
            console.log(file);
            if (file === undefined) {
                return cb(null, '');
            }
            var bucket = storage(params.Bucket); 
                bucket
                    .upload({
                        Bucket: getbucketname(params.Bucket),
                        ACL: 'public-read', 
                        Body: file.buffer, 
                        Key: file.originalname,
                        ContentType: file.mimetype 
                    })
                    .send(cb);
            
        }

    };
    



};

    
    
    
    
