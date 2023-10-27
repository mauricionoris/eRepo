/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

'use strict';
var chai = require('chai'),
    expect = chai.expect,
    newStatisticDAO = require('../lib/DAO/statisticDao'),
    DAO_sup = require('./support/DAO_TestSupport'),
    recom = require('./support/examples/recommendation') ;            //example pattern
    


describe('Uma DAO para Estatísticas de visualização e recomendação de objetos de aprendizagem', function () {
    this.timeout(15000);
    var statisticDAO; //setup
    beforeEach(function () {
      statisticDAO = newStatisticDAO(DAO_sup.config());
    });
    
    describe('Dado que o estudante visualiza o objeto de aprendizagem', function () {
        beforeEach(function (done) {
          statisticDAO.removeAll(done);
        });
        
        function updateAndFindSpec(st) {
            it('quando pedimos ao DAO para inserir a nova interação(' +st.id +')', function (done) {
                statisticDAO.update(st, function (err) {
                    expect(err).not.to.exist;

                    statisticDAO.byId(st.id, DAO_sup.assertThatSuccessWith(done, function (result) {
                        expect(result).to.be.deep.equal(st);
                    }));
                });
            });
           

         }
        recom.getRecommendationList().forEach(updateAndFindSpec);

    });

   
});
