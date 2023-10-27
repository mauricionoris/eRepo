/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



var mongoose = require('mongoose');


module.exports.users = mongoose.model('users', {
    user_id: String,
    AKey: String,
    ASecret: String
});

module.exports.clients = mongoose.model('clients', {
    client_id: String,
    guid: String,
    key: String,
    secret: String,
    user_id: String
});

module.exports.subjects = mongoose.model('subjects', {
    subject_id: String,
    user_id: String,
    title: String,
    description: String
});

module.exports.client_resource_links = mongoose.model('client_resource_links', {
    client_id: String,
    resource_link_id: String,
    subject_id: String
});

module.exports.user_objects = mongoose.model('user_objects', {
    user_id: String,
    bucket: String,
    subject_id: String,
    object_key: String
});

