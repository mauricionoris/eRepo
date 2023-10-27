/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var Q = require('q'),
    liberror = require('./support/error'),
    idGen;

Object.compare = function (obj1, obj2) {
	//Loop through properties in object 1
	for (var p in obj1) {
		//Check property exists on both objects
		if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;
 
		switch (typeof (obj1[p])) {
			//Deep compare objects
			case 'object':
				if (!Object.compare(obj1[p], obj2[p])) return false;
				break;
			//Compare function code
			case 'function':
				if (typeof (obj2[p]) == 'undefined' || (p != 'compare' && obj1[p].toString() != obj2[p].toString())) return false;
				break;
			//Compare values
			default:
				if (obj1[p] != obj2[p]) return false;
		}
	}
 
	//Check object 2 for any extra properties
	for (var p in obj2) {
		if (typeof (obj1[p]) == 'undefined') return false;
	}
	return true;
};
function generateFunction(args, body) {
   //console.log(args);
   //console.log(body);
    var F = new Function(args,body);
    return F;
}

function searchTree(element, path){
    //console.log(path);
    var indexes = new Array();
    var arrPath = path.split('.');
    if (arrPath.length === 1) { return; }
    
    function recSearch(nodes, item) {
        console.log('recSearch.nodes->'+ JSON.stringify( nodes));
        console.log('recSearch.item->'+ JSON.stringify(item));
        
        for (var i=0;i< nodes.length;i++){
            if (nodes[i].id === item) {
                return i;
            }
        }
    }
    
    if (arrPath.length > 1) {
        var level = element.nodes;
        for (var i=1;i< arrPath.length;i++){
           //console.log('level ->'+ JSON.stringify( level));
           //console.log('path[i]->'+ JSON.stringify(arrPath[i]));

           var r = recSearch(level, arrPath[i]);
           //console.log('r>'+ r);

           indexes.push(r);

           level = level[r].nodes;
        }
        return indexes;
    }
}

function asTree(st) {
  
    function filterByStructure(el) {
        return Object.compare(el.structure, st);
   }   
  
    
    return function (tree) {
        //console.log(tree);
        return  {
            tree: tree.filter(filterByStructure)[0]
        };
    };
}
function asRemoveTree() {
    
    return function (t) {
        
        t.tree.structure.active = false;
        return t;
    };
} 

function asRemoveChild(obj, item) {
   
        var idx = searchTree(obj.tree, item.path);
        
        if (idx === undefined) {
           // obj.tree.nodes = obj.tree.nodes.filter(el => el.text !== rm.item.text);
            return obj;
        }
        
        var body = "";
        idx.forEach(function (el) { body += "nodes[" + el + "]."; }); 
        body = body.substring(0,body.lastIndexOf("["));
        body = "t.tree." + body + " = t.tree." + body + ".filter(el => el.path !== item.path); return t; ";
        
        console.log(body);
        return generateFunction(['t','item'],body)(obj,item);
   
    
}

function asAppendChild(obj, item) {
    
        //console.log('obj-->'+ JSON.stringify(obj));
        //console.log('item-->'+ JSON.stringify(item));
        
    
        var idx = searchTree(obj.tree, item.path);
        
        if (idx === undefined) {
            obj.tree.nodes.push(item.add); 
            return obj;
        }    
        var body = "";
        
        //console.log('idx>'+idx); 
        
        idx.forEach(function (el) { body += "nodes[" + el + "]."; }); 
        body = "t.tree." + body + "nodes.push(item.add); return t;";
        console.log("body:->"+body);
    
        return generateFunction(['t','item'],body)(obj,item);
   };


module.exports = function(daos) {
    idGen = function() { return daos.newId();};

    return {
        getSpecificTree: function(id,cb) {
            daos.byTreeId(id, function(er,data){
                 return cb(data);
            });
        },
        getlistbyId: function(id,cb) {
            daos.listbyId(id, function(er,data){
                 return cb(er,data);
            });
        },
        
        getTrees: function(id,cb) {
            daos.byPublisherId(id, function(er,data){
                //console.log(er);
                //console.log(data);
                return cb(data);
            });
        },
        removeTree: function(structure) {
            return _removeTree(structure)
                    .then(asTree(structure))
                    .then(asRemoveTree())
            ;
        },
        
        appendChild: function(entity,cb) {
            //console.log(entity);
            daos.byTreeId( entity.id, function(er, obj){
                console.log('obj-->' + obj);
                entity.add.id = daos.newId().toHexString();
                entity.add.path = entity.path + "." + entity.add.id;
                daos.update(asAppendChild(obj, entity), function (er, result) {
                    return cb(null,result);
                });
            }); 
        },
        removeChild: function(entity,cb) {
            daos.byTreeId(entity.id, function(er, obj){
                daos.update(asRemoveChild(obj, entity), function (er, result) {
                    return cb(result);
                });
            }); 
        }
    };
};
    
