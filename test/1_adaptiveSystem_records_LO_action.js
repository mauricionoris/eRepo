/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

'use strict';
var chai = require('chai'),
    expect = chai.expect,
    newStorage = require('./support/storageDouble'),                //double factory
    recom = require('./support/examples/recommendation'),              //example pattern
    errors = require('../lib/support/error'),                       //business errors  
    adaptiveSystemWith = require('../lib/adaptiveSystem');          //implementation 


chai.use(require("sinon-chai"));
chai.use(require("chai-as-promised"));

describe('Sistema Adaptativo registra a visulização e avaliação dos estudantes aos objetos de aprendizagem', function () {
    beforeEach(function () {
        this.adaptiveStorage = newStorage();
        this.adaptiveSystem = adaptiveSystemWith({
            statistic: this.adaptiveStorage.dao()
        });
    }); 
 
    context('Dado que o estudante visualiza um objeto de aprendizagem e recomenda', function () {
        beforeEach(function () {
           this.statistic = this.adaptiveStorage.alreadyContains( recom.getRecommendation(0));
           this.result = this.adaptiveSystem.addStatistic(this.statistic.id );               
        });         
        
      
        it('Adicionará 1 ao número de visualizações do item (LO-01)', function(){
           return expect(this.result).to.eventually.have.deep.property('learningObject.data.number_of_visualizations').that.is.equal(1);
         });
        it('Recalculará a média de L0_01 em função da nova avaliação',function(){
            return expect(this.result).to.eventually.have.deep.property('learningObject.data.recommendation.average').that.is.equal(2);
        });
        it('Adicionará 1 ao número de recomendações de L0_01 ',function(){
            return expect(this.result).to.eventually.have.deep.property('learningObject.data.recommendation.number_of_records').that.is.equal(1);
        });
        it('Adicionará +2 ao número de pontos de L0_01 ',function(){
            return expect(this.result).to.eventually.have.deep.property('learningObject.data.recommendation.points').that.is.equal(2);
        });
    }); 
    
    context('Dado que o estudante insere visualiza um objeto de aprendizagem e não recomenda', function () {
        beforeEach(function () {
           this.statistic = this.adaptiveStorage.alreadyContains( recom.getRecommendation(1));
           this.result = this.adaptiveSystem.addStatistic(this.statistic.id );               
        
        });            
        

        it('Adicionará 1 ao número de visualizações do item (LO-03)', function(){
           return expect(this.result).to.eventually.have.deep.property('learningObject.data.number_of_visualizations').that.is.equal(2);
        });
        
        it('Manterá a média de L0_03 inalterada em função da nova avaliação não ter sido feita',function(){
            return expect(this.result).to.eventually.have.deep.property('learningObject.data.recommendation.average').that.is.equal(-1);
        });
        it('Manterá o número de recomendações de L0_03 ',function(){
            return expect(this.result).to.eventually.have.deep.property('learningObject.data.recommendation.number_of_records').that.is.equal(1);
        });
        it('Manterá o número de pontos de L0_03 inalterado',function(){
            return expect(this.result).to.eventually.have.deep.property('learningObject.data.recommendation.points').that.is.equal(-1);
        });
        
    });
 
   

});
