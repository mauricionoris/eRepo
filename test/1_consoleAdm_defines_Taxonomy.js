/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';
var chai = require('chai'),
    expect = chai.expect,
    newStorage = require('./support/storageDouble'),                     //double factory
    taxonomy = require('./support/examples/taxonomyStructure'),          //example pattern
    errors = require('../lib/support/error'),                            //business errors  
    consoleAdmWith = require('../lib/consoleAdm');                       //implementation 
    
chai.use(require("sinon-chai"));
chai.use(require("chai-as-promised"));

describe('Console administrativo define arvore de taxonomias', function() {
    beforeEach(function () {
        this.taxonomyStorage = newStorage();
        this.consoleAdm = consoleAdmWith({
            taxonomyStructure: this.taxonomyStorage.dao()
        });
    }); 

    context('Dado que não exista uma estrutura definida', function(){
        beforeEach(function () {
           this.tree = this.taxonomyStorage.alreadyContains(taxonomy.empty());
           this.result = this.consoleAdm.getTree(this.tree.structure);               
        }); 
        
        it('retornará uma lista de conteúdo vazio', function() {
            return expect(this.result).to.eventually.have.deep.property('tree.nodes').that.is.empty;
        });
    });
    context('Dado que que exista uma estrutura definida e se deseja excluí-la', function(){
        beforeEach(function () {
           this.tree = this.taxonomyStorage.alreadyContains(taxonomy.empty());
           this.result = this.consoleAdm.removeTree(this.tree.structure);               
        }); 
        
        it('permitirá a exclusão da estrutura', function(){
            return expect(this.result).to.eventually.have.deep.property('tree.structure.active', false);
     
        }); 
        
    });        
    context('Dado que que exista uma estrutura definida e se deseja alterá-la', function(){
        it('permitirá a criação um item na estrutura', function() {
            this.tree = this.taxonomyStorage.alreadyContains(taxonomy.addItem());
            this.result = this.consoleAdm.appendChild(this.tree.addItem);               
            return expect(this.result).to.eventually.have.deep.property('tree.nodes[0].text',this.tree.addItem.newitem.text);
        });
        
        it('permitirá a criação um SUB-Item na estrutura', function() {
            this.tree = this.taxonomyStorage.alreadyContains(taxonomy.addSubItem());
            this.result = this.consoleAdm.appendChild(this.tree.addItem);               
            return expect(this.result).to.eventually.have.deep.property('tree.nodes[0].nodes[0].text',this.tree.addItem.newitem.text);
        });
        
        
        it('permitirá a remoção um item da estrutura', function() {
           this.tree = this.taxonomyStorage.alreadyContains(taxonomy.removeItem());
           this.result = this.consoleAdm.removeChild(this.tree.remove);               
           return expect(this.result).to.eventually.have.deep.property('tree.nodes').that.is.empty;
        });           

        it('permitirá a remoção um SUB-item da estrutura', function() {
           this.tree = this.taxonomyStorage.alreadyContains(taxonomy.removeSubItem());
           this.result = this.consoleAdm.removeChild(this.tree.remove);               
           return expect(this.result).to.eventually.have.deep.property('tree.nodes[0].nodes[0].nodes[0].nodes').that.is.empty;
        });           



    }); 
    
    //TODO
    context('Dado que que exista uma estrutura definida e se deseja criar nova versão', function(){
     //   beforeEach(function () {
      //     this.taxonomyStructure = this.taxonomyStorage.alreadyContains(taxonomy.withItems());
      //  }); 
        
        
        it('permitirá clonar a estrutura existente para uma nova versão');
        /*
        ,  function() {
            this.result = this.consoleAdm.cloneTree(this.taxonomyStructure);
            var newTree = this.taxonomyStorage.alreadyContains(taxonomy.cloned());
            return expect(this.result).to.eventually.to.deep.equal(newTree);
            
            
        });
        */
        it('permitirá criar uma nova nova versão da estrutura do zero');
        /*
        ,  function() {
            this.result = this.consoleAdm.createTree(this.taxonomyStructure);
            var newTree = this.taxonomyStorage.alreadyContains(taxonomy.newVersion());
            return expect(this.result).to.eventually.to.deep.equal(newTree);
       
        });
        */
        
    });        
});
