'use strict';

var chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon');

module.exports = function () {
  var dao = {
        getRanking: sinon.stub(),
        getTree: sinon.stub(),
        appendChild: sinon.stub(),
        removeChild: sinon.stub(),
        cloneTree: sinon.stub(),
        removeTree: sinon.stub(),
        createTree: sinon.stub(),
        addStatistic: sinon.stub()
        
      },
      storage = {};

  storage.dao = function () {
    return dao;
  };
  
  
  storage.alreadyContains = function (entity) {
    var data = entity.data;
    var tree = entity.tree;
    var lo = entity.learningObject;
   
    dao.getRanking
        .withArgs(entity.id)
        .callsArgWithAsync(1, null, data);


    dao.addStatistic    
        .withArgs(entity.id)
        .callsArgWithAsync(1, null, entity);


    dao.getTree
        .withArgs(entity.structure)
        .callsArgWithAsync(1, null, tree);

    dao.appendChild    
        .withArgs(entity.addItem)
        .callsArgWithAsync(1, null, tree);


    dao.removeChild    
        .withArgs(entity.remove)
        .callsArgWithAsync(1, null, tree);


//TODO
    dao.cloneTree    
        .withArgs(entity.id, entity.version)
        .callsArgWithAsync(1, null, data);

//TODO
    dao.removeTree    
        .withArgs(entity.structure)
        .callsArgWithAsync(1, null, tree);
    //.callsArgWithAsync(1, null);

//TODO
    dao.createTree    
        .withArgs(entity.id, entity.version)
        .callsArgWithAsync(1, null, data);

  
      return entity;
  };
  
  return storage;
};