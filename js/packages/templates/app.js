'use strict';

/*
 * Defining the Package
 */

var Module = require('meanio').Module;

var Templates = new Module('templates');



/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Templates.register(function(app, auth, database) {

    //We enable routing. By default the Package Object is passed to the routes
    Templates.routes(app, auth, database);

    //We are adding a link to the main menu for all authenticated users
    Templates.menus.add({
        title: 'Templates',
        link: 'templates',
        roles: ['authenticated']

    });

/*
    Templates.menus.add({
        title: 'List Templates',
        link: 'listtemplate',
        roles: ['authenticated'],
        menu: 'main'
    });
*/

    /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Templates.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Templates.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Templates.settings(function(err, settings) {
        //you now have the settings object
    });
    */
    Templates.aggregateAsset('css', 'templates.css');
    Templates.angularDependencies(['ui.grid','ui.grid.resizeColumns','ui.grid.moveColumns','ui.grid.autoResize']);

    return Templates;
});
