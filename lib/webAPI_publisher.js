
function resetBag() {

    var pr_bag = {
            title: "ToomRepo",
            view: "",
            user: false,
           
            console:{ main:null
                     ,profile:null
                     ,lms:[]
                     ,taxonomy:[]
                     ,lob: []
                     ,report:null }
        };
        pu_bag = pr_bag;
        return pu_bag;
}

function get_console_main_info() {
    
    var info = {
        num_objects: 22,
        num_environments: 1,
        num_access: 34,
        num_taxonomies: 2
    };
    return info;
}

function get_console_report_info() {}

function set_console_user(user) {
    var item =  { id: user.id,
                user: true,
             profile: {
                    id: user.id,
                  name: user.name,
           description: "",
                   url: "",
                 email: user.name},
             console: { main: null, lms: [], taxonomy: [], lob: [], report: null } 
                };
    
    return item;
}

  
module.exports = function(daos) {
      
    
     return {
     all: function(){
         return resetBag();
         
     },
    
    index: function() {
        return resetBag();
    },
    
    get_publisher_profile: function(user, cb) {
        daos.byPublisherId(user.id,function(er, data){
            if (er !== null) {
                //clientnotfound
                console.log(er.name + "- " + er.message);
                if (er.name === 'clientnotfound') {   
                    var u = set_console_user(user);
                    daos.addUser(u, function(er , result) {
                        return cb(u);  
                    });
                }
            } else {       
                return cb(data);
            }
        });
    } ,
    
    update_publisher_profile: function(user, cb) {
        daos.updateUser(user,function(er, data){
            if (er !== null) {
                console.log(er.name + "- " + er.message);
                return(er);
            } else {       
                return cb(data);
            }
        });
    } ,
    
    console_main: function(cb) {

        return cb(get_console_main_info());
    },
    

    
    console_report: function(pu_bag) {
        pu_bag.console.report = get_console_report_info(); 
        return pu_bag;
    }


    
  };  
};


    
 
    
    
    
    




