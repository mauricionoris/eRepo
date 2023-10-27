/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


'use strict';


module.exports = {
  client_01: function (id) {
      return  {
           id: id,
      profile:  {
            name:"Publisher_number1",
     description: "First publisher",
             url:"www.firstpublisher.com",
           email:"admin@toomrepo.com"
                },
          lms:[
                 {
                  id:"1",
                  name: "Toomtec EAD",
                                platform: "Moodle",
              version:"3.2",

                  url:"https://ead2.toomtec.com.br/moodle",
                  key:"25B985BF1106495A885705424F0A7712",
                  secret:"0C3A286B112448719E1442AAE319239A",
                  active:true,
                  parameters:
                      {
                         adaptation_weight: { learning_style: 0.95, recommendation: 0.05}
                      }
                  ,
                  enabled_taxonomies_trees:[
                      {guid:"b45d2ac0-b71a-481c-a71b-f25e50b63d3a"}
                  ]
                 }
              ]
    };
  },
  client_02: function (id)  {
      return     {
           id: id,
      profile:  {
            name:"Publisher_number2",
     description: "Second publisher",
             url:"www.secondpublisher.com",
           email:"admin2@toomrepo.com",
             
                },
          lms:[
                 {
                  id:"2",
                 name: "Toomtec Health",
                  url:"https://ead2.toomtec.com/ava",
              platform: "Moodle",
              version:"3.2",
                  key:"EEDF640DE4654C32AAC623AA38DDCCD3",
                  secret:"DA00C169F5DE4FD88948C424372FE4A4",
                  active:true,
                  parameters:
                      {
                         adaptation_weight: { learning_style: 0.70, recommendation: 0.30 }
                      }
                  ,
                  enabled_taxonomies_trees:[
                      {guid:"a5b1e9cf-8bfe-4dbd-b5f5-ef69a30d7c0d"}
                  ]
                 }
              ]
    };
  },
  new_lms: function() {
      
      return {
                  id:"3",
                  name: "FormulaH",
                  url:"https://www.formulaH.com.br/ava",
              platform: "Moodle",
              version:"3.2",
                    key:"AD44657D161B42B58EC218C46A37E396",
                  secret:"46BAFFB6E3F64EBBAFFB7A9FCBA50FD2",
                  active:true,
                  parameters:
                      {
                         adaptation_weight: { learning_style: 0.85, recommendation: 0.15 }
                      }
                  ,
                  enabled_taxonomies_trees:[
                      {guid:"45c77c8e-4ff9-4184-a1d0-98bd64ac19b8"}
                  ]
            };

      
      
  }
};
