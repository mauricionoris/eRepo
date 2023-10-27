/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


    
    
 module.exports = function(dao_stat) {

 return {
    lti_record_lob_interaction: function(entity, cb) {
        
        dao_stat.create_statistic(entity, function (er, r) {
            //console.log(result);
            return cb(null,true);
        });

    }
    
  };  
};
