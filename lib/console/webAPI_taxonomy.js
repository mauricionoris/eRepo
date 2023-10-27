/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

 function matchTaxonomies(lob, ctx) {
     var output = [];
     
        
     lob.forEach(function (item){
         item.taxonomies.forEach(function (taxon) {
             if (taxon.tree === ctx.link.taxonomy.tree) {
                 var myTaxons = new Set(taxon.nodes);
                 if (myTaxons.has(ctx.link.taxonomy.node.id)) {
                     output.push(item);
                 }
             }
         });
     });
     
     return output;
     
     
 }
 
 
 
module.exports = function(dao_client, dao_taxon, dao_stat) {
 var CA = require('../../lib/consoleAdm')(dao_taxon);
 var adp = require('../../lib/adaptiveSystem')(dao_stat);
   
 return {

    list_tree(id, cb){
        CA.getTrees(id, function(data) {
            return cb(data);
        });
    },
    
    lti_get_enabled_nodes: function(entity, cb){
        var trees = [];
        entity.forEach(function(item) {
            trees.push(item.tree);
        });
        //console.log(trees);
        CA.getlistbyId(trees, function (er, data) {
              return cb(er,data);
        });  

    },
    
    lti_get_objects_list: function(entity, cb){
        dao_client.getLobbyPublisherId(entity._id, function(er, result) {
            var lobs = matchTaxonomies(result.lob,entity);
            console.log();
            adp.generateRanking(lobs, function (er, result) {
                return cb(er,lobs);
            });
       });
       

    },
    
    lti_set_resource: function(entity, cb){
       entity.link_id = dao_taxon.newId();
       entity.creation_date = Date.now();
       dao_client.addLmsLink(entity, function(er, result) {
            //console.log(er);
            //console.log(result);
            return cb(er,result);
       });
    },
    

    console_taxonomy_new: function(entity, cb) {
        entity._id = dao_taxon.newId();
        dao_taxon.update(entity, function(er,result){
            //console.log(entity);
            return cb(entity);
        });
    },
    console_taxonomy_update: function(entity, cb) {

        CA.appendChild(entity, function(er,result){
            return cb(result);
        });
    },
    
    console_taxonomy_remove: function(entity, cb) {
        
        CA.removeChild(entity, function(result){
            return cb(result);
        })
        
    }
    
  };  
};


    
 
    
    
    
    




