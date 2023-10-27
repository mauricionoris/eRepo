/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var mongodb = require('mongodb'),
    MongoClient = mongodb.MongoClient,
    ObjectID = mongodb.ObjectID;

function withCollection(config, collectionName) {
  return function (command, cb) {
    MongoClient.connect('mongodb://' 
                                    + config.user + ':' 
                                    + config.pass +  '@' 
                                    + config.server + '/' 
                                    + config.name + '?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin',
        function (err, db) {
          if (err) {
            console.log(err);
            return cb(err);
          }

          try {
            command(db.collection(collectionName), function (err, result) {
              db.close(function () {
                cb(err, result);
              });
            });
          } catch (e) {
            console.log(e);
            cb(e);
            db.close(cb);
          }
        }
    );
  };
}

function withCollectionPromise(config, collectionName) {
  return null; 
  //todo
  
}

module.exports = {
    initialize: function(config, collection) {
        return withCollection(config,collection);
    },
    initialize2: function(config, collection) {
        return withCollectionPromise(config,collection);
    },
    mongodb: function(){
       return mongodb;
    },
    ObjectID: function(id) {
        return new ObjectID(id);
    },
    newId: function() {
      return ObjectID(ObjectID().toHexString());
    }
};
