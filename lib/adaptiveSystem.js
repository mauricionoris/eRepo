/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var Q = require('q'),
    liberror = require('./support/error');


function ranks(v) {
    
    function cmp_rnum(a,b) {
        // comparison function: reverse numeric order
        return b-a;
    }
    function index_map(acc, item, index) {
        // reduction function to produce a map of array items to their index
        acc[item] = index;
        return acc;
    }
    
    var rankindex;
    rankindex = v.slice().sort(cmp_rnum).reduceRight(index_map, Object.create(null));
    return v.map(function(item){ return rankindex[item]+1; });
}

function asRanking(taxonomyId) {
    
    var _err = [];
    
    if (taxonomyId === null) {
        _err.push(liberror.taxonomyUndefined());
    }
    
    
    function checkParam(param) {
        var p = 0;

        if (param === undefined || param === null) {
            return p;
        }
        else {
            return param;
        }
    }
    function calcRanking(items) {
        var _params = {learning_style: [], recommendation: []}; 
        var _ranks = {learning_style: [], recommendation: [], ranking: []}; 
        
        var _weight = {
                  learning_style: 0
                , recommendation: 1
            };
        
        items.forEach(function (item) {
            _params.learning_style.push(checkParam(item.learningObject.data.learning_style));
            _params.recommendation.push(checkParam(item.learningObject.data.recommendation.average));
        });
         
        _ranks.learning_style = ranks(_params.learning_style);
        _ranks.recommendation = ranks(_params.recommendation);
        
        for (var i=0; i < items.length; i++) {
            _ranks.ranking[i] = -1*(_ranks.learning_style[i]*_weight.learning_style 
                              + _ranks.recommendation[i]*_weight.recommendation 
                              + items[i].learningObject.data.initial_ranking/1000);
        }
        
        _ranks.ranking = ranks(_ranks.ranking);
         
        for (var i=0; i < items.length; i++) {
            items[i].ranking = _ranks.ranking[i];
        }
        
        return items.sort(function (a,b) {
            return a.ranking - b.ranking;
        });
    }
    
    return function (items) {
        
        return {
            items: calcRanking(items.slice()),
            errors: _err.slice()
       };
    };
}

 function ranking(items) {
            var _ranks = { ranking: []}; 
     
        var _weight = {
                  learning_style: 0
                , recommendation: 1
            };
         

        for (var i=0; i < items.length; i++) {
      
            _ranks.ranking[i] = 1*(items[i].style*_weight.learning_style 
                              + items[i].recommendation*_weight.recommendation 
                              + items[i].initial_ranking/1000);
        }
         _ranks.ranking = ranks(_ranks.ranking);
         
        for (var i=0; i < items.length; i++) {
            items[i].ranking = _ranks.ranking[i];
        }
        
        return items.sort(function (a,b) {
            return a.ranking - b.ranking;
        });
    }


function asStatistic(id) {
    //console.log(id);
    
    function updateLearningObject(st) {
      
        st.learningObject.data.number_of_visualizations++;
        st.learningObject.data.recommendation = addRecommendation(st.learningObject.data.recommendation, st.data);
        
        
        return st.learningObject;
    }
    
    
    function addRecommendation(r, data) { 

      //  console.log(r);
      //  console.log(data.recommendation);
            

        if (data.recommendation !== null) {
            r.points += data.recommendation;
            r.number_of_records++;
            r.average = r.points/r.number_of_records;
        }
      // console.log(r);
        return r;
    }

    return function (st) {
      return {
         learningObject: updateLearningObject(st)
        };
    };
}


module.exports = function (daos) {
    
    return {
    addStatistic: function(statisticId){
           var statistic = Q.denodeify(daos.statistic.addStatistic);
 
           return statistic(statisticId)
                   .then(asStatistic(statisticId));
        },
        
    getRanking: function (taxonomyId) {
           var ranking = Q.denodeify(daos.taxonomy.getRanking);
   
           return ranking(taxonomyId)
                   .then(asRanking(taxonomyId));
       },

    
    generateRanking: function (lobs, cb) {
        var lobids = lobs.map(function(p){return p.id.toString();});
        daos.getStatistics(lobids, function(er, data) {
            var result = data.reduce(function (p,c) {
                Array.prototype.push.apply(p, c.lobs);
                return p;
            },[]);
            
             
            var rate = [];
            lobids.forEach(function(el) {
                rate.push({
                   id: el,
                 rate: result.map(function(item) {
                     //console.log(item);
                        if (item.id === el) {
                          return  (isNaN(Number(item.rate)) ? 0 : Number(item.rate));
                        } else {
                            return 0;
                        }
                    }).reduce(function (p,c) {
                        return p += c;
                    },0),
                 count: result.map(function(item) {
                        if (item.id === el) {
                          return  1;
                        } else {
                            return 0;
                        }
                    }).reduce(function (p,c) {
                        return p += c;
                    },0)
                });
            });  
            rate.forEach(function(el) {
                     el.recommendation =  (isNaN(el.rate / el.count) ? 0 : el.rate / el.count);
            });
            
            //console.log(rate);
            var i = 1;
            lobs.forEach(function(el) {
                var item = rate.filter(x => x.id.toString() === el.id.toString())[0];
                //console.log(item);
                el.recommendation = item.recommendation;
                el.initial_ranking = i++;   
                el.ranking = 0;
                }
            );

            var rankedlobs = ranking(lobs);
            //console.log(rankedlobs);
            return cb(null,rankedlobs);
            }); 
           
       }

    };
 };






