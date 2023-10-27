/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

'use strict';
var chai = require('chai'),
    expect = chai.expect,
    newLearningObjectDAO = require('../lib/DAO/learningObjectDao'),
    DAO_sup = require('./support/DAO_TestSupport'),
    loSamples = require('./support/examples/learningObject');
    

var learningObjects  = [loSamples.lo_07(),loSamples.lo_08() ,loSamples.lo_09()];
            

describe('Uma DAO para Objetos de Aprendizagem', function () {
    this.timeout(15000);
    var learningObjectDAO;
    beforeEach(function () {
      learningObjectDAO = newLearningObjectDAO(DAO_sup.config());
    });
    
    describe('Dado que não existe objeto de aprendizagem', function () {
        beforeEach(function (done) {
          learningObjectDAO.removeAll(done);
        });
        
        function updateAndFindSpec(lo) {
            it('quando pedimos ao DAO para retornar o objeto de aprendizagem "' +lo.id + ' "\n\
               , um erro será retornado.', function (done) {
                 learningObjectDAO.byId(lo.id, DAO_sup.assertThatFailsWith(done, function (err) {
                        expect(err).to.exist;
                        expect(err.toString())
                            .to.match(/not found/i)
                            .and.to.contain(lo.id);
                 })); 
            });
            
            it('quando pedimos ao DAO para atualizar o objeto de aprendizagem "' +lo.id + '"\n\
               , então o objeto pode ser retornado', function (done) {
                learningObjectDAO.update(lo, function (err) {
                    expect(err).not.to.exist;

                    learningObjectDAO.byId(lo.id, DAO_sup.assertThatSuccessWith(done, function (result) {
                        //console.log(result);
                        expect(result).to.be.deep.equal(lo);
                  }));
                });
                
                
            });

         }
        learningObjects.forEach(updateAndFindSpec);

    });

    describe('Dado que nós criamos três objetos de aprendizagem ',function () {
        learningObjects.forEach(function (lo) {
          beforeEach('insert loearningObject "' + lo.id + '"', function (done) {
            learningObjectDAO.update(lo, done);
          });
        });
        
        learningObjects.forEach(function (lo) {
            it('quando pedimos ao DAO para atualizar o objeto de aprendizagem "' + lo.id + '", \n\
            então o objeto "' + lo.id + '" pode ser retornado com os dados atualizados', function (done) {
                var newloData = {
                  id: lo.id,
                  data: {
                        storage_id: "2ff32498-afc0-4eff-b767-b2529eb8eaeb",
                        name: "lo 11",
                        initial_ranking: 12,
                        recommendation: {points: 2, number_of_records:1, average:2},
                        learning_style: 1,
                        number_of_visualizations:0
                  },
                  metadata:{}
                };

                learningObjectDAO.update(newloData, function (err) {
                  expect(err).not.to.exist;

                  learningObjectDAO.byId(lo.id, DAO_sup.assertThatSuccessWith(done, function (result) {
                    expect(result).to.be.deep.equal(newloData);
                  }));
                });
              });
        });

        describe('Quando o DAO é solicitado para apagar todos os objetos de aprendizagem',function (){
            beforeEach(function (done) {
              learningObjectDAO.removeAll(done);
            });           
           
            function assertOrderIsRemoved(lo) {
                it('quando pedimos ao DAO para retornar o objeto de aprendizagem "' + lo.id + '", um erro será retornado.', function (done){
                    learningObjectDAO.byId(lo.id, DAO_sup.assertThatFailsWith(done, function (err) {
                               expect(err).to.exist;
                               expect(err.toString())
                                   .to.match(/not found/i)
                                   .and.to.contain(lo.id);
                             }));               
                });
            }
            learningObjects.forEach(assertOrderIsRemoved);
        });     
    });
});
