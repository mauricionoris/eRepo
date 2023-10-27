/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

'use strict';

var DAOLib = require('./support/DAOLib');
    



function newDAO(withTaxonomies) {
  return {
    newId: function() {
        return DAOLib.newId();
    },  
    byId: function (id, cb) {
      withTaxonomies(function (taxonomies, cb) {
        var o_id = DAOLib.ObjectID(id);
        console.log(o_id);
        taxonomies.findOne({
          _id: o_id
        }, function (err, taxonomyDoc) {
          if (err) {
            console.log(err);
            return cb(err);
          }
          if (!taxonomyDoc)
            return cb(new Error('Taxonomy structure [' + id + '] not found'));
          cb(null, {
            _id: id,
            structure: taxonomyDoc.structure,
            text: taxonomyDoc.text,
            nodes: taxonomyDoc.nodes
          });
        });
      }, cb);
    },
    listbyId: function (id, cb) {
      withTaxonomies(function (taxonomies, cb) {
        var o_id = [];  
        id.forEach(function(el) {o_id.push(DAOLib.ObjectID(el));});  
        //console.log(o_id);
        taxonomies.find({
          _id: { $in: o_id }
        }).toArray(function (err, taxonomyDoc) {
          if (err) {
            console.log(err);
            return cb(err);
          }
          if (!taxonomyDoc)
            return cb(new Error('Taxonomy structure [' + id + '] not found'));
          cb(null, taxonomyDoc);
        });
      }, cb);
    },      
    byTreeId: function (id, cb) {
      var o_id = DAOLib.ObjectID(id);
      console.log(o_id);   
      withTaxonomies(function (taxonomies, cb) {
         taxonomies.findOne({
          _id: o_id
        }, function (err, taxonomyDoc) {
          if (err) {
            console.log(err);
            return cb(err);
          }
          if (!taxonomyDoc)
            return cb(new Error('Taxonomy structure [' + id + '] not found'));

          //console.log(taxonomyDoc); 
          cb(null, taxonomyDoc
              
          );
        });
      }, cb);
    },
    byPublisherId: function (id, cb) {
      withTaxonomies(function (taxonomies, cb) {
        taxonomies.find({
          'structure.publisherid': id
        }).toArray(function (err, taxonomyDoc) {
          if (err) {
            console.log(err);
            return cb(err);
          }
          if (!taxonomyDoc)
            return cb(new Error('Taxonomy structure [' + id + '] not found'));
          cb(null, taxonomyDoc);
        });
      }, cb);
    },         
        
        
        
    update: function (entity, cb) {
      withTaxonomies(function (taxonomies, cb) {
        console.log(entity);
       
        taxonomies.update({_id: entity._id},
                 {'$set': {
                          structure: entity.structure,
                          tree: entity.tree
                        }
                    },
                 {upsert:true}
                        , cb);
      }, cb);
    },
    
    removeAll: function (cb) {
      withTaxonomies(function (taxonomies, cb) {
        taxonomies.deleteMany({}, cb);
      }, cb);
    }
  };
}

module.exports = function (config) {
   return newDAO(DAOLib.initialize(config, 'taxonomies'));
};