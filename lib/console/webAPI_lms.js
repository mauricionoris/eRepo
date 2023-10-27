  
module.exports = function(dao_client, dao_taxon) {
      
    
     return {
    
    console_lms: function(id, cb) {
        dao_client.getLmsbyPublisherId(id, function(er,data){
            return cb(data);
        });
    },
    console_lms_edit: function(publisher_id, lms,id,cb) {
        var item = {
            id: null,
            name: "",
            platform: "",
            version: "",
            url: "",
            key:null,
            secret:null,
            active: true,
            parameters: {
                adaptation_weight: {recommendation:0.5, learning_style:0.5}
            },
            enabled_taxonomies: []
        };
        if (id !== null) {
            item = lms.filter(l => l.id === id)[0];
        }
        
        dao_taxon.byPublisherId(publisher_id, function(er,data){
            //console.log(er);
            //console.log(data);
            item.taxonomylist = data;
            return cb(item);
        });
    
    },
    console_lms_update: function(id, lms, cb) {
        if (lms.id === '') {
            dao_client.addLms(id, lms, function(er, result){
                return cb(true);
            });
        }
        else {
            dao_client.updateLms(id, lms, function(er, result){
                return cb(true);
            });
        }
    },    
    console_lms_remove: function(id, lms, cb)
    {
                                  
        dao_client.removeLms(id, lms, function(er, result){
            return cb(true);
        });
    },
    
    lti_lms_get: function(ctx,cb){
        dao_client.getLmsbyCtx(ctx, function(er,data){
            return cb(null, data);
        })
    }
    
  };  
};


    
 
    
    
    
    




