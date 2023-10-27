/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



var ObjectID = require('mongodb').ObjectID;

//var uri = "mongodb://kay:myRealPassword\n\
//                @mycluster0-shard-00-00-wpeiv.mongodb.net:27017\n\
//            ,mycluster0-shard-00-01-wpeiv.mongodb.net:27017
//            ,mycluster0-shard-00-02-wpeiv.mongodb.net:27017\n\
//admin?ssl=true&replicaSet=Mycluster0-shard-0&authSource=admin";

//mongodb://toomtec:<PASSWORD>
//@cluster0-shard-00-00-zpf0u.mongodb.net:27017
//,cluster0-shard-00-01-zpf0u.mongodb.net:27017
//,cluster0-shard-00-02-zpf0u.mongodb.net:27017
///<DATABASE>?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin
module.exports = {

    newId: function() {
      return new ObjectID().toHexString();
    },
    
    config: function() {
       return {
        port: 27017,
      server: "cluster0-shard-00-00-zpf0u.mongodb.net:27017,cluster0-shard-00-01-zpf0u.mongodb.net:27017,cluster0-shard-00-02-zpf0u.mongodb.net:27017", 
        name: 'toomrepo',
        user: 'toomrepo_dbuser',
        pass: 'p0o9i8P)O(I*'
      };
    }
};