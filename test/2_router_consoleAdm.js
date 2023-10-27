/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
 
'use strict';
var chai = require('chai'),
    expect = chai.expect,
    app = require('../app');      //implementation
    
chai.use(require("sinon-chai"));
chai.use(require("chai-as-promised"));
chai.use(require("chai-http"));

describe('Console administrativo apresenta tela inicial', function() {
    beforeEach(function () {

    }); 
    
    describe('Visitante anônimo solicita cadastramento no sistema', function(){
        context('Dado que o visitante informa seus dados',function() {
            it('Encontrará o roteamento para a View inicial', function() {
                return chai.request(app)
                        .get('/console')
                        .auth('user','pass')
                        .set('Accept', 'application/json')
                        .then(function(res){
                            expect(res).to.have.status(200);
                            expect(res).to.have.a.property('body','ok');
                        })
                        .catch(function(err){throw err;});
            });            
        });
    });
    
    describe('Usuário validado se autentica no sistema', function(){
        context('Dado que o usuário solicita manutenção dos ambientes virtuais',function() {
            it('Encontrará o roteamento para a View de correta', function() {
                return chai.request(app)
                        .get('/console/lms')
                        .set('Accept', 'application/json')
                        .then(function(res){
                            expect(res).to.have.status(200);
                            expect(res).to.have.a.property('body','ok');

                        })
                        .catch(function(err){throw err;});
            });
        
        
        }); 
        context('Dado que o usuário solicita manutenção dos objetos de aprendizagem',function() {
            it('Encontrará o roteamento para a View de correta', function() {
                return chai.request(app)
                        .get('/console/lob')
                        .set('Accept', 'application/json')
                        .then(function(res){
                            expect(res).to.have.status(200);
                            expect(res).to.have.a.property('body','ok');
                    
                        })
                        .catch(function(err){throw err;});
            });

        }); 
        context('Dado que o usuário solicita manutenção na árvore de taxonomias',function() {
            it('Encontrará o roteamento para a View de correta', function() {
                return chai.request(app)
                        .get('/console/taxonomy')
                        .set('Accept', 'application/json')
                        .then(function(res){
                            expect(res).to.have.status(200);
                            expect(res).to.have.a.property('body','ok');
                        })
                        .catch(function(err){throw err;});
            });


        }); 

        
    });
    
    
});
