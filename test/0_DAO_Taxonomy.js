/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

'use strict';
var chai = require('chai'),
    expect = chai.expect,
    newTaxonomyDAO = require('../lib/DAO/taxonomyDao'),
    DAO_sup = require('./support/DAO_TestSupport'),
    taxonomiesSamples = require('./support/examples/taxonomyStructure');

var tree = taxonomiesSamples.withItems().tree;

describe('Uma DAO para taxonomias', function () {
    this.timeout(15000);
    var taxonomyDAO; //setup
    beforeEach(function () {
      taxonomyDAO = newTaxonomyDAO(DAO_sup.config());
    });
    
    describe('Dado que não existe a estrutura taxonomica', function () {
        beforeEach(function (done) {
          taxonomyDAO.removeAll(done);
        });
        
        function updateAndFindSpec(et) {
            it('quando pedimos ao DAO para retornar a estrutura taxonomica "' +et.id + ' "\n\
               , um erro será retornado.', function (done) {
                 taxonomyDAO.byId(et.id, DAO_sup.assertThatFailsWith(done, function (err) {
                        expect(err).to.exist;
                        expect(err.toString())
                            .to.match(/not found/i)
                            .and.to.contain(et.id);
                 })); 
            });
            
            it('quando pedimos ao DAO para atualizar a estrutura taxonomica "' +et.id + '"\n\
               , então a estrutura pode ser apresentada', function (done) {
                taxonomyDAO.update(et, function (err) {
                    expect(err).not.to.exist;

                    taxonomyDAO.byId(et.id, DAO_sup.assertThatSuccessWith(done, function (result) {
                        //console.log(result);
                        expect(result).to.be.deep.equal(et);
                  }));
                });
                
                
            });

         }
        tree.forEach(updateAndFindSpec);

    });

    describe('Dado que existe uma estrutura taxonomica ',function () {
        tree.forEach(function (et) {
          beforeEach('insert taxonomy structure "' + et.id + '"', function (done) {
            taxonomyDAO.update(et, done);
          });
        }); //setup
        
        tree.forEach(function (et) {
            it('quando pedimos ao DAO para atualizar a estrutura taxonomica "' + et.id + '", \n\
            então a estrutura "' + et.id + '" pode ser retornada com os dados atualizados', function (done) {
                var newetData = 
                                    {
                                      id: et.id,
                                      structure: {clientid: "1", version:"1.0"},
                                      text: "client name ",
                                      nodes: [
                                        {
                                          text: "Revolução Chinesa",
                                          nodes: [
                                            {
                                              text: "Política"
                                            },
                                            {
                                              text: "Arte"
                                            }
                                          ]
                                        },
                                        {
                                          text: "Revolução Cubana",
                                          nodes: [
                                            {
                                              text: "Livre Comerciao"
                                            },
                                            {
                                              text: "Protecionismo"
                                            }
                                          ]
                                        }
                                      ]
                                    };
       
                taxonomyDAO.update(newetData, function (err) {
                  expect(err).not.to.exist;

                  taxonomyDAO.byId(et.id, DAO_sup.assertThatSuccessWith(done, function (result) {
                    //  console.log(JSON.stringify(result));
                    expect(result).to.be.deep.equal(newetData);
                  }));
                });
              });
        });

        describe('Quando o DAO é solicitado para apagar todos as estruturas taxonomicas existentes',function (){
            beforeEach(function (done) {
              taxonomyDAO.removeAll(done);
            });           
           
            function assertOrderIsRemoved(et) {
                it('quando pedimos ao DAO para retornar o objeto de aprendizagem "' + et.id + '", um erro será retornado.', function (done){
                    taxonomyDAO.byId(et.id, DAO_sup.assertThatFailsWith(done, function (err) {
                               expect(err).to.exist;
                               expect(err.toString())
                                   .to.match(/not found/i)
                                   .and.to.contain(et.id);
                             }));               
                });
            }
            tree.forEach(assertOrderIsRemoved);
        });     
    });
});
