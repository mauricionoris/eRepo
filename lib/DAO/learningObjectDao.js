/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


'use strict';

var DAOLib = require('./support/DAOLib');


function newDAO(withLearningObjects) {
  return {
    byId: function (id, cb) {
      withLearningObjects(function (learningObjects, cb) {
        learningObjects.findOne({
          _id: new DAOLib.ObjectID(id)
        }, function (err, learningObjectDoc) {
          if (err) {
            console.log(err);
            return cb(err);
          }
          if (!learningObjectDoc)
            return cb(new Error('LearningObject [' + id + '] not found'));
          cb(null, {
            id: id,
            data: learningObjectDoc.data,
            metadata: learningObjectDoc.metadata
          });
        });
      }, cb);
    },
    //todo
    byTaxonomyId:function (id, cb) {
      withLearningObjects(function (learningObjects, cb) {
        learningObjects.findOne({
          _id: new DAOLib.ObjectID(id)
        }, function (err, learningObjectDoc) {
          if (err) {
            console.log(err);
            return cb(err);
          }
          if (!learningObjectDoc)
            return cb(new Error('LearningObject [' + id + '] not found'));
          cb(null, {
            id: id,
            data: learningObjectDoc.data,
            metadata: learningObjectDoc.metadata
          });
        });
      }, cb);
    },
    
    update: function (entity, cb) {
      withLearningObjects(function (learningObjects, cb) {
        learningObjects.save({
          _id: new DAOLib.ObjectID(entity.id),
          data: entity.data,
          metadata: entity.metadata
        }, cb);
      }, cb);
    },
    
    removeAll: function (cb) {
      withLearningObjects(function (learningObjects, cb) {
        learningObjects.deleteMany({}, cb);
      }, cb);
    }
  };
}

module.exports = function (config) {
  return newDAO(DAOLib.initialize(config, 'learningObjects'));
};