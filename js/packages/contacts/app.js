'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var contacts = new Module('contacts');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
contacts.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  contacts.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  contacts.menus.add({
    'roles': ['authenticated'],
    'title': 'Import Users',
    'link': 'import users'
  });
  contacts.menus.add({
    'roles': ['authenticated'],
    'title': 'Run Campaign',
    'link': 'run campaign'
  });

  //Articles.aggregateAsset('js','/packages/system/public/services/menus.js', {group:'footer', absolute:true, weight:-9999});
  //Articles.aggregateAsset('js', 'test.js', {group: 'footer', weight: -1});


  contacts.aggregateAsset('css', 'contacts.css');
  contacts.angularDependencies(['angularFileUpload']);

  return contacts;
});
