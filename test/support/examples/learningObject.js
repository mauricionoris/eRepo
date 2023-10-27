/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

'use strict';
var DAO_sup = require('../DAO_TestSupport');
  


module.exports = {
  lo_01: function () {
    return {
      id: DAO_sup.newId(),
      data:{
        storage_id: "35aa5125-ac1b-46c9-950e-a6704da74f46",
        name: "lo 01",
        initial_ranking: 2,
        recommendation: {points: 0, number_of_records:0, average:null},
        learning_style: null,
        number_of_visualizations:0
      },
      metadata: {}
    };
  },
  lo_02: function () {
    return {
      id:DAO_sup.newId(),
      data:{
      storage_id: "2ff32498-afc0-4eff-b767-b2529eb8eaeb",
      name: "lo 02",
      initial_ranking: 1,
      recommendation: {points: 0, number_of_records:0, average:null},
      learning_style: null,
      number_of_visualizations:0},
      metadata:{}
     
    };
  },
  lo_03: function () {
    return {
      id:DAO_sup.newId(),
      data:{
      storage_id: "2ff32498-afc0-4eff-b767-b2529eb8eaeb",
      name: "lo 03",
      initial_ranking: 4,
      recommendation: {points: -1, number_of_records:1, average:-1},
      learning_style: null,
      number_of_visualizations:1},
      metadata:{}
     
    };
  },
  lo_04: function () {
    return {
      id:DAO_sup.newId(),
      data:{
      storage_id: "2ff32498-afc0-4eff-b767-b2529eb8eaeb",
      name: "lo 04",
      initial_ranking: 3,
      recommendation: {points: 2, number_of_records:1, average:2},
      learning_style: null,
      number_of_visualizations:0},
      metadata:{}
     
    };
  },
  lo_05: function () {
    return {
      id:DAO_sup.newId(),
      data:{
      storage_id: "2ff32498-afc0-4eff-b767-b2529eb8eaeb",
      name: "lo 05",
      initial_ranking: 6,
      recommendation: {points: 0, number_of_records:0, average:null},
      learning_style: 1,
      number_of_visualizations:0},
      metadata:{}
     
    };
  },
  lo_06: function () {
    return {
      id:DAO_sup.newId(),
      data:{
      storage_id: "2ff32498-afc0-4eff-b767-b2529eb8eaeb",
      name: "lo 06",
      initial_ranking: 5,
      recommendation: {points: 0, number_of_records:0, average:null},
      learning_style: 0,
      number_of_visualizations:0},
      metadata:{}
     
    };
  },
  lo_07: function () {
    return {
      
      id:DAO_sup.newId(),
      data:{
      storage_id: "2ff32498-afc0-4eff-b767-b2529eb8eaeb",
      name: "lo 07",
      initial_ranking: 7,
      recommendation: {points: 2, number_of_records:1, average:2},
      learning_style: 1,
      number_of_visualizations:0},
      metadata:{}
     
    };
  },
  lo_08: function () {
    return {
      id:DAO_sup.newId(),
      data:{
      storage_id: "2ff32498-afc0-4eff-b767-b2529eb8eaeb",
      name: "lo 08",
      initial_ranking: 8,
      recommendation: {points: -1, number_of_records:1, average:-1},
      learning_style: 1,
      number_of_visualizations:0},
      metadata:{}
     
    };
  },
  lo_09: function () {
    return {
      id:DAO_sup.newId(),
      data:{
      storage_id: "2ff32498-afc0-4eff-b767-b2529eb8eaeb",
      name: "lo 09",
      initial_ranking: 9,
      recommendation: {points: -1, number_of_records:1, average:-1},
      learning_style: 1,
      number_of_visualizations:0},
      metadata:{}
     
    };
  },
  lo_10: function () {
    return {
      id:DAO_sup.newId(),
      data:{
      storage_id: "2ff32498-afc0-4eff-b767-b2529eb8eaeb",
      name: "lo 10",
      initial_ranking: 10,
      recommendation: {points: 2, number_of_records:1, average:2},
      learning_style: 1,
      number_of_visualizations:0},
      metadata:{}
     
    };
  }
 

};

