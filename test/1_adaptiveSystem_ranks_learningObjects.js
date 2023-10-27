/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


'use strict';
var chai = require('chai'),
    expect = chai.expect,
    newStorage = require('./support/storageDouble'),        //double factory
    taxonomy = require('./support/examples/taxonomy'),      //example pattern
    errors = require('../lib/support/error'),                //business errors  
    adaptiveSystemWith = require('../lib/adaptiveSystem');  //implementation 
    
chai.use(require("sinon-chai"));
chai.use(require("chai-as-promised"));

describe('Sistema Adaptativo rankeia dos objetos de aprendizagem', function () {
    beforeEach(function () {
        this.adaptiveStorage = newStorage();
        this.adaptiveSystem = adaptiveSystemWith({
            taxonomy: this.adaptiveStorage.dao()
        });
    }); 
    
    context('Dado que a taxonomia seja indefinida, ', function() {
        beforeEach(function () {
           this.taxonomy = this.adaptiveStorage.alreadyContains(taxonomy.empty());
           this.taxonomy.errors = [errors.taxonomyUndefined()];
           this.result = this.adaptiveSystem.getRanking(this.taxonomy.id);               
        }); 
        
        it('retornará uma lista de conteúdo vazio', function() {
            return expect(this.result).to.eventually.have.property('items').that.is.empty;
        });
        
        it('retornará um erro de taxonomia indefinida', function() {
            return expect(this.result).to.eventually.have.property('errors').that.is.deep.equal(this.taxonomy.errors);
        });
    });
    
    context('Dado que não existe objeto de aprendizagem para a taxonomia selecionada, ', function() {
        beforeEach(function () {
           this.taxonomy = this.adaptiveStorage.alreadyContains(taxonomy.withoutItems());
           this.taxonomy.errors = [];
           this.result = this.adaptiveSystem.getRanking(this.taxonomy.id);               
        }); 
        
        
        it('retornará uma lista de conteúdo vazio', function() {
            return expect(this.result).to.eventually.have.property('items').that.is.empty;
        });
        
        it('lista de errors vazia', function() {
            return expect(this.result).to.eventually.have.property('errors').that.is.deep.equal([]);
        });
        
    });
    
    context('Dado que não existe recomendação a um objeto de aprendizagem e nem se identificou o estilo de aprendizagem, ', function() {
        beforeEach(function () {
           this.taxonomy = this.adaptiveStorage.alreadyContains(taxonomy.withItems([
                   {
                        learningObject: 'lo_01',
                        ranking: null
                   },
                   {
                        learningObject: 'lo_02',
                        ranking: null                    
                   }
                ]));
           this.taxonomy.errors = [];
           this.result = this.adaptiveSystem.getRanking(this.taxonomy.id);               
        }); 
        it('retornará a lista todos os objetos de aprendizagem rankeados apenas pela ordenação original', function() {
            return  expect(this.result).to.eventually
                       .have.deep.property('items.[0].learningObject.initial_ranking')
                       .that.is.equal(1) && 
                    expect(this.result).to.eventually
                       .have.deep.property('items.[0].ranking')
                       .that.is.equal(1);
        });
   });
    
    context('Dado que uma recomendação a um objeto de aprendizagem foi feita', function() {
        beforeEach(function () {
           this.taxonomy = this.adaptiveStorage.alreadyContains(taxonomy.withItems([
                   {
                        learningObject: 'lo_03',
                        ranking: null
                   },
                   {
                        learningObject: 'lo_04',
                        ranking: null                    
                   }
                ]));
           this.taxonomy.errors = [];
           this.result = this.adaptiveSystem.getRanking(this.taxonomy.id);               
        }); 
        
        it('listará os objetos de aprendizagem ordenados pela recomendação média', function() {
            return  expect(this.result).to.eventually
                       .have.deep.property('items.[0].learningObject.initial_ranking')
                       .that.is.equal(3) && 
                    expect(this.result).to.eventually
                       .have.deep.property('items.[0].ranking')
                       .that.is.equal(1);
        });

        

        
    });

    context('Dado que se identificou o estilo de aprendizagem', function() {
        beforeEach(function () {
           this.taxonomy = this.adaptiveStorage.alreadyContains(taxonomy.withItems([
                   {
                        learningObject: 'lo_06',
                        ranking: null
                   },
                   {
                        learningObject: 'lo_05',
                        ranking: null                    
                   }
                ]));
           this.taxonomy.errors = [];
           this.result = this.adaptiveSystem.getRanking(this.taxonomy.id);               
        }); 
        
        it('listará os objetos de aprendizagem ordenados pelo estilo de aprendizagem', function() {
           return  expect(this.result).to.eventually
                       .have.deep.property('items.[0].learningObject.data.name')
                       .that.is.equal('lo 05');
        });

        
    
        
    });

    context('Dado que tanto recomendações a objetos foram feitos e o estilo de aprendizagem foi identificado ', function() {
        beforeEach(function () {
           this.taxonomy = this.adaptiveStorage.alreadyContains(taxonomy.withItems([
                   {
                        learningObject: 'lo_08',
                        ranking: null
                   },
                   {
                        learningObject: 'lo_05',
                        ranking: null                    
                   },
                   {
                        learningObject: 'lo_06',
                        ranking: null                    
                   },
                   {
                        learningObject: 'lo_03',
                        ranking: null                    
                   },
                   {
                        learningObject: 'lo_04',
                        ranking: null                    
                   },
                   {
                        learningObject: 'lo_01',
                        ranking: null                    
                   },
                   
                   {
                        learningObject: 'lo_02',
                        ranking: null                    
                   },
                   {
                        learningObject: 'lo_07',
                        ranking: null                    
                   },
                   {
                        learningObject: 'lo_09',
                        ranking: null                    
                   },
                   {
                        learningObject: 'lo_10',
                        ranking: null                    
                   }
                ]));
           this.taxonomy.errors = [];
           this.result = this.adaptiveSystem.getRanking(this.taxonomy.id);               
        }); 
  
       it('listará os objetos de aprendizagem ordenados por ambos os critérios', function() {
           return  expect(this.result).to.eventually
                       .have.deep.property('items.[2].learningObject.data.name')
                       .that.is.equal('lo 05');
        });

        
    });

    //TODO
    context('Dado que o serviço de ordenação não respondeu à requisição', function() {
       it('retornará erro');

        
    
        
    });
    //TODO
    context('Dado que o serviço de ordenação respondeu erro', function() {
       it('retornará erro');

        
    
        
    });

    
});
