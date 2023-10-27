/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


'use strict';

var DAOLib = require('./support/DAOLib');

function business_error(name, msg) {
    this.name = name;
    this.message = msg;
}



function newDAO(withClients) {
  return {
      
    byId: function (id, cb) {
      withClients(function (clients, cb) {
        clients.findOne({
          _id: new DAOLib.ObjectID(id)
        }, function (err, clientDoc) {
          if (err) {
            console.log(err);
            return cb(err);
          }
          if (!clientDoc)
            return cb(new Error('Client structure [' + id + '] not found'));
          cb(null, {
            id: id,
            profile: clientDoc.profile,
            console: clientDoc.console
          });
        });
      }, cb);
    },
    
    byPublisherId: function (id, cb) {
      withClients(function (clients, cb) {
        clients.findOne({
          'profile.id': id
        }, function (err, clientDoc) {
          if (err) {
            console.log(err);
            return cb(err);
          }
          if (!clientDoc)
            return cb(new business_error('clientnotfound'
                        , 'Cliente [' + id + '] não cadastrado '), null);

         cb(null, {
            id: id,
            user: true,
            profile: clientDoc.profile,
            console: {main:null, lms:[], taxonomy:[], lob:[],report:null}
          });
        });
      }, cb);
    },
    
    getLmsbyPublisherId: function(id, cb) {
      withClients(function (clients, cb) {
        clients.findOne({
          _id: id
        }, function (err, clientDoc) {
          if (err) {
            console.log(err);
            return cb(err);
          }
          if (!clientDoc)
            return cb(new business_error('clientnotfound'
                        , 'Cliente [' + id + '] não cadastrado '), null);

         cb(null, {
            lms: clientDoc.console.lms
          });
        });
      }, cb);
    },
/*    
    getLmsbyCtx: function(ctx, cb) {
      withClients(function (clients, cb) {
        clients.findOne({
          'console.lms' : {$elemMatch: {key: ctx.key }}
      
        }, function (err, clientDoc) {
          if (err) {
            console.log(err);
            return cb(err);
          }
          if (!clientDoc)
            return cb(new business_error('lmsnotfound'
                        , 'Ambiente LMS [' + ctx.url + '] não cadastrado '), null);

         console.log(clientDoc);               
         cb(null, {
            lms: clientDoc.console.lms
          });
        });
      }, cb);
    },
*/
    getLmsbyCtx: function(ctx, cb) {
      withClients(function (clients, cb) {
        clients.aggregate([ {$match: {'console.lms.key':ctx.key}},
                            {
                               $project: {
                                  items: {
                                     $filter: {
                                        input: "$console.lms",
                                        as: "item",
                                        cond: { $eq: [ "$$item.key", ctx.key ] }
                                     }
                                  }
                               }
                            }
                         ], 
        function (err, clientDoc) {
          if (err) {
            console.log(err);
            return cb(err);
          }
          if (!clientDoc)
            return cb(new business_error('lmsnotfound'
                        , 'Ambiente LMS [' + ctx.url + '] não cadastrado '), null);

         //console.log(JSON.stringify(clientDoc));               
         cb(null, {
            _id: clientDoc[0]._id,
            lms: clientDoc[0].items[0]
          });
        });
      }, cb);
    },
        
        
    getLobbyPublisherId: function(id, cb) {
              withClients(function (clients, cb) {
        clients.findOne({
          _id: id
        }, function (err, clientDoc) {
          if (err) {
            console.log(err);
            return cb(err);
          }
          if (!clientDoc)
            return cb(new business_error('clientnotfound'
                        , 'Cliente [' + id + '] não cadastrado '), null);

         cb(null, {
            lob: clientDoc.console.lob
          });
        });
      }, cb);
    },
    
    
    addUser: function(user, cb) {
      withClients(function (clients, cb) {
        clients.insert({
          _id: user.id,
          user: true,
          profile: user.profile,
          console: user.console
        }, cb);
      }, cb);
    },
    
    updateUser: function (entity, cb) {
     //console.log(entity);
      withClients(function (clients, cb) {
        clients.update({ _id: entity.id},
             {$set: {profile: entity}
        }, cb);
      }, cb);
    },
      
    addLms: function (id, entity, cb) {
        entity.id = DAOLib.newId();
        withClients(function (clients, cb) {
            clients.update({ _id: id},
                 {$push: {'console.lms': entity}
            }, cb);
        }, cb);
        
    },
        
    updateLms: function (id, entity, cb) {
        entity.id = DAOLib.ObjectID(entity.id);
        withClients(function (clients, cb) {
            clients.update(
                { _id: id, 'console.lms.id': entity.id},
                {$set: { 'console.lms.$': entity }}
            , cb);
        },cb);
    },
    
    addLmsLink: function (entity, cb) {
        withClients(function (clients, cb) {
            clients.update(
                  { _id: entity._id, 'console.lms.id': DAOLib.ObjectID(entity.lms.id)},
                  {$push: { 'console.lms.$.lti_link': {link_id: entity.link_id,
                                                       creation_date: entity.creation_date, 
                                                       creator: entity.creator,
                                                       resource: entity.resource
                                                     , taxonomy: entity.taxonomy }}
                }, cb);
        },cb);
    },
    
    removeLms: function (id, entity, cb) {
        withClients(function (clients, cb) {
            clients.update(
                { _id: id },
                { $pull: {'console.lms': {id: entity.id} } } 
            , cb);
        },cb);
        
    },    
    
    addLob: function (id, entity, cb) {
        entity.id = DAOLib.newId();
        withClients(function (clients, cb) {
            clients.update({ _id: id},
                 {$push: {'console.lob': entity}
            }, cb);
        }, cb);
        
    },
        
    updateLob: function (id, entity, cb) {
        withClients(function (clients, cb) {
            clients.update(
                { _id: id, 'console.lob.id': entity.id},
                {$set: { 'console.lob.$': entity }}
            , cb);
        },cb);
    },
    
    removeLob: function (id, entity, cb) {
        withClients(function (clients, cb) {
            clients.update(
                { _id: id },
                { $pull: {'console.lob': {id: entity.id} } } 
            , cb);
        },cb);
        
    },  
    
    update: function (entity, cb) {
      withClients(function (clients, cb) {
        clients.save({
          _id: new DAOLib.ObjectID(entity.id),
          profile: entity.profile,
          lms: entity.lms
        }, cb);
      }, cb);
    },
    
    removeAll: function (cb) {
      withClients(function (clients, cb) {
        clients.deleteMany({}, cb);
      }, cb);
    }
  };
}

module.exports = function (config) {
  return newDAO(DAOLib.initialize(config, 'publishers'));
};