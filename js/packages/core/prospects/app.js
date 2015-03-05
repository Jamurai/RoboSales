'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var prospects = new Module('prospects');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
prospects.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  prospects.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  prospects.menus.add({
    'roles': ['authenticated'],
    'title': 'Contacts',
    'link': 'contacts',
    'menu': 'main'
  });



  prospects.menus.add({
    'roles': ['authenticated'],
    'title': 'Import',
    'link': 'import'
  });
/*
  prospects.menus.add({
    'roles': ['authenticated'],
    'title': 'RunCampaign',
    'link': 'runcampaign'
  });
*/
  //Articles.aggregateAsset('js','/packages/system/public/services/menus.js', {group:'footer', absolute:true, weight:-9999});
  //Articles.aggregateAsset('js', 'test.js', {group: 'footer', weight: -1});


  prospects.aggregateAsset('css', 'prospects.css');
  prospects.aggregateAsset('css','ui-grid.css');
  prospects.angularDependencies(['angularFileUpload','ngSanitize','ui.select']);

  return prospects;
});
