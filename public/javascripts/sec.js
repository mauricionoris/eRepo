/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



$(document).ready(function(){
  $("#login").click(function(){
     signin();
  });
});

  function signin() {
    var lock = new Auth0Lock('IMGwUqZg052Hiu85UQaUyNBCAZNfSQNf', 'toomtec.auth0.com');
    lock.show({
        callbackURL: window.location + 'callback'
      , responseType: 'code'
      , authParams: {
        scope: 'openid profile'
      }
    });
  }
  
  