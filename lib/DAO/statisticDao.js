/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



'use strict';

var DAOLib = require('./support/DAOLib');


function newDAO(withItems) {
    
  return {
    create_statistic: function(entity, cb) {
      entity._id = DAOLib.newId();
      withItems(function (item, cb) {
        item.save(entity, cb);
      }, cb);
    },  
    
  getStatistics: function (entity, cb) {
      
      withItems(function (item, cb) {
        item.find({
          'lobs.id': { $in: entity }
        }).toArray(function (err, statisticDoc) {
          if (err) {
            console.log(err);
            return cb(err);
          }
          if (!statisticDoc)
            return cb(new Error('statisticDoc structure [' + entity + '] not found'));
          cb(null, statisticDoc);
        });
      }, cb);
    },      
       
      
    byId: function (id, cb) {
      withItems(function (item, cb) {
        item.findOne({
          _id: new DAOLib.ObjectID(id)
        }, function (err, itemDoc) {
          if (err) {
            console.log(err);
            return cb(err);
          }
          if (!itemDoc)
            return cb(new Error('Statistic document [' + id + '] not found'));
          cb(null, {
            id: id,
            date: itemDoc.date,
            time_spent: itemDoc.time_spent,
            learningObject:itemDoc.learningObject,
            data: itemDoc.data

          });
        });
      }, cb);
    },
     
    update: function (entity, cb) {
      withItems(function (item, cb) {
        //console.log(JSON.stringify(entity));
        item.save({
             _id: new DAOLib.ObjectID(entity.id),
            date: entity.date,
            time_spent: entity.time_spent,
            learningObject:entity.learningObject,
            data: entity.data
        }, cb);
      }, cb);
    },
    removeAll: function (cb) {
      withItems(function (item, cb) {
        item.deleteMany({}, cb);
      }, cb);
    }
  };
}

module.exports = function (config) {
  return newDAO(DAOLib.initialize(config, 'statistics'));
};