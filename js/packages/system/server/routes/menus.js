'use strict';

var mean = require('meanio'),
  lodash = require('lodash');

module.exports = function(System, app, auth, database) {

  app.route('/admin/menu/:name')
    .get(function(req, res) {
      var roles = req.user ? req.user.roles : ['anonymous'];
      var menu = req.params.name || 'main';
      //var defaultMenu = req.query.defaultMenu || [];

      //if (!Array.isArray(defaultMenu)) defaultMenu = [defaultMenu];


    var items      = [{"name":"contacts",
                      "title":"Contacts",
                      "link":"contacts",
                      "roles":["authenticated"],
                      "icon":null,"submenus":[]
                      },
                      {"name":"import",
                      "title":"Import",
                      "link":"import",
                      "roles":["authenticated"],
                      "icon":null,"submenus":[]
                      },
                      {"name":"templates",
                      "title":"Templates",
                      "link":"templates",
                      "roles":["authenticated"],
                      "icon":null,"submenus":[]
                      }
                      ];

      console.log("MENUS",roles);

      if(lodash.indexOf(roles,'anonymous') > -1) {
        items = [];
      }

    /*
      var items = mean.menus.get({
        roles: roles,
        menu: menu,
        defaultMenu: defaultMenu.map(function(item) {
          return JSON.parse(item);
        })
      });
      */

      res.json(items);
    });
};
