/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var ObjectID = require('mongodb').ObjectID;



module.exports = {
    assertThatSuccessWith: function(done, assertion) {
      return function (err, result) {
        if (err)
          return done(err);
        try {
          assertion(result);
          done();
        } catch (e) {
          done(e);
        }
    };
  },

  assertThatFailsWith:  function(done, assertion) {
      return function (err) {
        try {
          assertion(err);
          done();
        } catch (e) {
          done(e);
        }
      };
    },

    newId: function() {
      return new ObjectID().toHexString();
    },
    
    config: function() {
       return {
        port: 27017,
        name: 'toomrepo',
        user: 'toomrepo_dbuser',
        pass: 'p0o9i8P)O(I*'
      };
    }
};