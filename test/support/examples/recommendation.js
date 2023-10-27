/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


'use strict';
var DAO_sup = require('../DAO_TestSupport'),
    lo = require('./learningObject');
  
function get(item) {
    

   var recom = [
    {
      id: DAO_sup.newId(),
      date: new Date(),
      time_spent: 600, //ten minutes
      learningObject:lo.lo_01(),
      data: {
          lms: {guid:"1223534"},
          course:{id:"324242"},
          student:{id:"2",name:"fulano"},
          resource: {id:1},
          recommendation: 2
      }
    },
    {
      id: DAO_sup.newId(),
      date: new Date(),
      time_spent:1200, //20 minutes
      learningObject:lo.lo_03(),
      data: {
          lms: {guid:"1223424"},
          course:{id:"34242"},
          student:{id:"2",name:"fulano"},
          resource: {id:1},
          recommendation: null

      } 
    } 
];

    return recom[item];
}


module.exports = {
  getRecommendation: function (item) {
      return  get(item);
      
      
  },
  getRecommendationList: function () {
      return [get(0),get(1)];
  }
};