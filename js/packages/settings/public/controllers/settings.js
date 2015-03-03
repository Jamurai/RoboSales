'use strict';

angular.module('mean.settings').controller('SettingsController', ['$scope', '$location','$stateParams','Global', 'Settings',
    function($scope, $location,$stateParams, Global, Settings) {


        $scope.global = Global;
        $scope.package = {
            name: 'settings'
        };



        $scope.hasAuthorization = function(setting) {
            if (!setting || !setting.user) return false;
            return $scope.global.isAdmin || setting.user._id === $scope.global.user._id;
        };

        $scope.bcc = $scope.global.user.username || '';

        $scope.create = function(isValid) {
            if (isValid) {
                var setting = new Settings({
                  name: this.name,
                  subject: this.subject,
                  body: this.body,
                  bcc:this.bcc

                });
                setting.$save(function(response) {
                  //$location.path('settings/' + response._id);
                  $location.path('settings');
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
          Settings.query(function(settings) {
            $scope.setting = settings[0];

          });
        };

        $scope.findOne = function() {

          Settings.get({
            settingId: $stateParams.settingId
          }, function(setting) {
            $scope.setting = setting;
          });
        };

        $scope.remove = function(setting) {
          if (setting) {
            setting.$remove(function(response) {
              for (var i in $scope.settings) {
                if ($scope.settings[i] === setting) {
                  $scope.settings.splice(i,1);
                }
              }
              $location.path('settings');
            });
          } else {
            $scope.setting.$remove(function(response) {
              $location.path('settings');
            });
          }
        };



      $scope.update = function(isValid) {
        if (isValid) {
          var setting = $scope.setting;
          if(!setting.updated) {
            setting.updated = [];
          }
          setting.updated.push(new Date().getTime());

          setting.$update(function() {
            //$location.path('settings/' + setting._id);
            $location.path('settings');
            $scope.saved=true;
          });
        } else {
          $scope.submitted = true;
        }
      };



    }
]);
