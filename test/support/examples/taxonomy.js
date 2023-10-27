/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var learningObject = require('./learningObject');

var counter = 0;

function asTaxonomyItem(itemExample) {
  return {
    learningObject: learningObject[itemExample.learningObject](),
    ranking:itemExample.ranking
  };
}

module.exports = {
  empty: function () {
    return {
      id: null,
      data: []
    };
  },
  withItems: function (itemExamples) {
    counter += 1;
    return {
      id: "<an existent taxonomy " + counter + ">",
      data: itemExamples.map(asTaxonomyItem)
    };
  },
  withoutItems: function () {
    counter += 1;
    return {
      id: "<an existent taxonomy " + counter + ">",
      data: []
    };
  }

};
