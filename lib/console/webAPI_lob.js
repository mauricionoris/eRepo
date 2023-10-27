


module.exports = function(dao_client, dao_taxon) {
      
    
     return {
    
    console_lob: function(id,cb) {
        dao_client.getLobbyPublisherId(id, function(er,data){
            return cb(data);
        });
    },
    console_lob_edit: function(publisher_id, lob, id, cb) {
            
        var item = {
           id: null,
           name: "",
           type: "",
           style: "",
           vigency_start: null,
           vigency_end: null,
           active: true, 
           taxonomies:[],
           object: ""
        };
         
        if (id !== null) {
            item = lob.filter(l => l.id === id)[0];
        }
        //console.log(item);
        dao_taxon.byPublisherId(publisher_id, function(er,data){
            //console.log(er);
            //console.log(data);
            item.taxonomylist = data;
            return cb(item);
        });
    },
    console_lob_update: function(id, lob, cb) {
        if (lob.id === '') {
            dao_client.addLob(id, lob, function(er, result){
                return cb(true);
            });
        }
        else {
            dao_client.updateLob(id, lob, function(er, result){
                return cb(true);
            });
        }
    },    
    console_lob_remove: function(id, lob, cb) {
 
        dao_client.removeLob(id, lob, function(er, result){
            return cb(true);
        });
    }
    


    
  };  
};


    
 
    
    
    
    




