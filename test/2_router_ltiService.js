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

describe('Serviço LTI apresenta tela inicial', function() {
    beforeEach(function () {

    }); 
    /*
    describe('Visitante anônimo solicita cadastramento no sistema', function(){
        context('Dado que o visitante informa seus dados',function() {
            it('Encontrará o roteamento para a View inicial', function() {
                return chai.request(app)
                        .get('/console')
                        .set('Accept', 'application/json')
                        .then(function(res){
                            expect(res).to.have.status(200);
                            expect(res).to.have.a.property('body','ok');
                        })
                        .catch(function(err){throw err;});
            });            
        });
    });
    */
    describe('Usuário validado acessando via um LMS acessa o serviço', function(){
        context('Dado que o usuário tem perfil de estudante',function() {
            it('Encontrará o roteamento para a View de correta', function() {
                return chai.request(app)
                        .get('/lti/student')
                        .set('Accept', 'application/json')
                        .then(function(res){
                            expect(res).to.have.status(200);
                            expect(res).to.have.a.property('body','ok');

                        })
                        .catch(function(err){throw err;});
            });
        
        
        }); 
        context('Dado que o usuário tem perfil de administrador',function() {
            it('Encontrará o roteamento para a View de correta inicial', function() {
                return chai.request(app)
                        .get('/lti/admin')
                        .set('Accept', 'application/json')
                        .then(function(res){
                            expect(res).to.have.status(200);
                            expect(res).to.have.a.property('body','ok');
                    
                        })
                        .catch(function(err){throw err;});
            });
            
             it('Navegará para a View de relatórios', function() {
                return chai.request(app)
                        .get('/lti/admin/report')
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
