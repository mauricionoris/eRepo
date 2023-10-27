/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var ObjectID = require('mongodb').ObjectID;

function newId() {
  return new ObjectID().toHexString();
}

var tree = [{
    id: "0",  
    structure: {publisherid: "1", version:"1.0", active: true},
    text: "client name ",
    description: "Raiz da árvore de taxonomias, selecione o assunto",
    nodes: [
      {
        id:"1",   
        text: "Revolução Francesa",
        description:" A revolução aconteceu em bdldfjafja",
        nodes: [
          {
            id:"2",   
            text: "Política",
            description: "aspectos políticos e sociais"
          },
          {
            id:"2",   
            text: "Arte",
            description: "aspectos políticos e sociais"

          }
        ]
      },
      { 
       id:"2",   
        text: "Revolução Industrial",
        description: "aspectos políticos e sociais",
        nodes: [
          {
                          id:"2",   
            text: "Livre Comercio",
            description: "aspectos políticos e sociais"
          },
          {
                          id:"2",   
            text: "Protecionismo",
            description: "aspectos políticos e sociais"
          }
        ]
      }
    ]
  }];

module.exports = {
    
  empty: function () {
    return  {
        structure: {publisherid: "1", version:"1.0", active: true},
        tree: [{
            id: null,  
            structure: {publisherid: "1", version:"1.0", active: true},
            text: "client name ",
            nodes: []
            }]
        };
  },
  
  addItem: function (){
    return {
        addItem: { parent: "",
                    newitem: { text: "Revolução Cultural", nodes:[]},
                    structure: {publisherid: "1", version:"1.0", active: true}
                 },  
        tree: [{
          id: null,  
          structure: {publisherid: "1", version:"1.0", active: true},
          text: "client name ",
          nodes: []
          }]
        };  
  },

  addSubItem: function (){
    return {
        addItem: { parent: "item1",
                    newitem: { text: "Revolução Cultural", nodes:[]},
                    structure: {publisherid: "1", version:"1.0", active: true}
                 },  
        tree: [{
          id: null,  
          structure: {publisherid: "1", version:"1.0", active: true},
          text: "client name ",
          nodes: [{text: "item1"
                , nodes:[]
            }]
          }]
        };  
  },
    
removeItem: function (){
    return {
        remove: { parent: "",
                  item: { text: "Revolução Cultural", nodes:[]},
                  structure: {publisherid: "1", version:"1.0", active: true}
                 },  
        tree: [{
          id: null,  
          structure: {publisherid: "1", version:"1.0", active: true},
          text: "client name ",
          nodes: [
                    { text: "Revolução Cultural", 
                     nodes:[]}
                 ]
          }]
        };  
  },

 removeSubItem: function (){
    return {
        remove: { parent: "Raiz.PrimeiroNivel.SegundoNivel",
                  item: { text: "TerceiroNivel", nodes:[]},
                  structure: {publisherid: "1", version:"1.0", active: true}
                 },  
        tree: [{
          id: null,  
          structure: {publisherid: "1", version:"1.0", active: true},
          text: "client name ",
          nodes: [{text: "Raiz"
                , nodes:[
                    { text: "PrimeiroNivel", 
                     nodes:[
                          { text: "SegundoNivel"
                         , nodes:[
                                   { text: "TerceiroNivel"
                                  , nodes:[
                                          { text: "QuartoNivel"
                                         , nodes:[]}
                                   ]}
                          ]},
                          { text: "subitem2", nodes:[
                                   { text: "subsubitem222", nodes:[]}
                          ]}   
                     ]
                    },
                    { text: "item2" , 
                     nodes:[ { text: "subitem2", nodes:[]}]
                    }
                ]}
            ]
          }]
        };  
  },
    
  withItems: function() {
    return {structure: {publisherid: "1", version:"1.0", active: true},
            tree: tree
           };  
  },
  desativated: function() {
      var desTree = tree;
      desTree.structure.active = false;
      
    return desTree;   
  },
  cloned: function() {
      var desTree = tree;
      desTree.structure.version = "1.1";
      
    return desTree;   
  },
  newVersion: function() {
      return {
        id: null,  
        structure: {publisherid: "1", version:"2.0", active: true},
        text: "client name ",
        nodes: []
    };
  }
};