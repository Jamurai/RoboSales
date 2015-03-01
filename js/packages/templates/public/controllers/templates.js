'use strict';

angular.module('mean.templates').controller('TemplatesController', ['$scope', '$location','$stateParams','Global', 'Templates',
    function($scope, $location,$stateParams, Global, Templates) {

      
        $scope.global = Global;
        $scope.package = {
            name: 'templates'
        };

      //  $scope.actionTemplate ='<button ng-click="grid.appScope.remove(row.entity)">Click Here</button>'


        $scope.actionTemplate ='<span>' +
                  '<a href="/#!/templates/{{row.entity._id}}/edit" class="btn">' +
                  '<i class="glyphicon glyphicon-edit"></i> </a>' +
                  '<a href="" class="btn" data-ng-click="grid.appScope.remove(row.entity)">' +
                  '<i class="glyphicon glyphicon-trash"></i></a>' +
                  '</span>';


        $scope.columns = [
                {field: 'name', displayName: 'Name'},
                {field: 'subject', displayName: 'Subject'},
                {field: 'user.name', displayName: 'Created By'},
                {field: 'sent', displayName: 'Sent'},
                {field: 'opened', displayName: 'Opened'},
                {field: 'replied', displayName: 'Replied'},
                {field: 'actions', displayName: 'Actions',
                            cellTemplate: $scope.actionTemplate}
        ];
        $scope.gridOptions = {
          enableSorting: true,
          data: 'templates',
          columnDefs: $scope.columns

        };

        $scope.hasAuthorization = function(template) {
            if (!template || !template.user) return false;
            return $scope.global.isAdmin || template.user._id === $scope.global.user._id;
        };

        $scope.bcc = $scope.global.user.username || '';

        $scope.create = function(isValid) {
            if (isValid) {
                var template = new Templates({
                  name: this.name,
                  subject: this.subject,
                  body: this.body,
                  bcc:this.bcc

                });
                template.$save(function(response) {
                  //$location.path('templates/' + response._id);
                  $location.path('templates');
                });

                this.name = '';
                this.subject = '';
                this.bcc = '';
                this.body = '';
              } else {
                $scope.submitted = true;
              }
        };

        $scope.find = function() {
          Templates.query(function(templates) {
            $scope.templates = templates;

          });
        };

        $scope.findOne = function() {

          Templates.get({
            templateId: $stateParams.templateId
          }, function(template) {
            $scope.template = template;
          });
        };

        $scope.remove = function(template) {
          if (template) {
            template.$remove(function(response) {
              for (var i in $scope.templates) {
                if ($scope.templates[i] === template) {
                  $scope.templates.splice(i,1);
                }
              }
              $location.path('templates');
            });
          } else {
            $scope.template.$remove(function(response) {
              $location.path('templates');
            });
          }
        };



      $scope.update = function(isValid) {
        if (isValid) {
          var template = $scope.template;
          if(!template.updated) {
            template.updated = [];
          }
          template.updated.push(new Date().getTime());

          template.$update(function() {
            //$location.path('templates/' + template._id);
            $location.path('templates');
          });
        } else {
          $scope.submitted = true;
        }
      };



    }
]);
