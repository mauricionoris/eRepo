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
    DAO_sup = require('./support/DAO_TestSupport'),
    clisample = require('./support/examples/client'),
    newClientDAO = require('../lib/DAO/clientDao');
     

var client_example = [
    clisample.client_01(DAO_sup.newId()),
    clisample.client_02(DAO_sup.newId())
];

describe('Uma DAO para os clientes', function () {
    this.timeout(15000);
    var clientDAO;
    beforeEach(function () {
      clientDAO = newClientDAO(DAO_sup.config());
    });
    
    describe('Dado que não existe um cliente cadastrado', function () {
        beforeEach(function (done) {
          clientDAO.removeAll(done);
        });
        
        function updateAndFindSpec(client) {
            it('quando pedimos ao DAO para retornar um cliente "' +client.id + ' "\n\
               , um erro será retornado.', function (done) {
                 clientDAO.byId(client.id, DAO_sup.assertThatFailsWith(done, function (err) {
                        expect(err).to.exist;
                        expect(err.toString())
                            .to.match(/not found/i)
                            .and.to.contain(client.id);
                 })); 
            });
            
            it('quando pedimos ao DAO para atualizar um cliente "' +client.id + '"\n\
               , então o objeto pode ser retornado', function (done) {
                clientDAO.update(client, function (err) {
                    expect(err).not.to.exist;

                    clientDAO.byId(client.id, DAO_sup.assertThatSuccessWith(done, function (result) {
                        //console.log(result);
                        expect(result).to.be.deep.equal(client);
                  }));
                });
                
                
            });

         }
        client_example.forEach(updateAndFindSpec);

    });

    describe('Dado que nós criamos dois clientes ',function () {
        client_example.forEach(function (client) {
          beforeEach('insert client "' + client.id + '"', function (done) {
            clientDAO.update(client, done);
          });
        });
        
        client_example.forEach(function (client) {
            it('quando pedimos ao DAO para atualizar um cliente "' + client.id + '", \n\
            então o objeto "' + client.id + '" pode ser retornado com os dados atualizados', function (done) {
                var newclientData = {
                        id: client.id,
                        lms:client.lms.push(clisample.new_lms()),
                        profile: client.profile
                };

                clientDAO.update(newclientData, function (err) {
                  expect(err).not.to.exist;

                  clientDAO.byId(client.id, DAO_sup.assertThatSuccessWith(done, function (result) {
                    expect(result).to.be.deep.equal(newclientData);
                  }));
                });
              });
        });

        describe('Quando o DAO é solicitado para apagar todos os clientes',function (){
            beforeEach(function (done) {
              clientDAO.removeAll(done);
            });           
           
            function assertOrderIsRemoved(client) {
                it('quando pedimos ao DAO para retornar o cliente"' + client.id + '", um erro será retornado.', function (done){
                    clientDAO.byId(client.id, DAO_sup.assertThatFailsWith(done, function (err) {
                               expect(err).to.exist;
                               expect(err.toString())
                                   .to.match(/not found/i)
                                   .and.to.contain(client.id);
                             }));               
                });
            }
            client_example.forEach(assertOrderIsRemoved);
        });     
    });
});
