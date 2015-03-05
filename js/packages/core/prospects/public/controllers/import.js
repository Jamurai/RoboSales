'use strict';

angular.module('mean.prospects').controller('ImportController', ['$scope', '$upload','$state','$stateParams', '$location', 'Global', 'Prospects', 'ImportHistory','ImportFields',
  function($scope, $upload, $state, $stateParams, $location,Global, Prospects, ImportHistory,ImportFields) {
    $scope.global = Global;

    $scope.imported=[];
    $scope.status = '';
    $scope.hasAuthorization = function(prospect) {
      if (!prospect || !prospect.user) return false;
      return $scope.global.isAdmin || prospect.user._id === $scope.global.user._id;
    };


    $scope.columns = [

            {field: 'created', displayName: 'Imported Date'},
            {field: 'status', displayName: '# of Contacts'}

    ];
    $scope.gridOptions = {
      data: 'imported',
      columnDefs: $scope.columns,
      rowHeight:50,
      enableHorizontalScrollbar:0,
      enableVerticalScrollbar:0


    };


    $scope.$watch('files', function () {
        //$scope.upload($scope.files);
        $scope.readFile($scope.files);
    });


    $scope.readFile = function(files) {
      ImportFields.setFiles(files);
      if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          var reader = new FileReader();
          reader.onload = function(progressEvent){
            // Entire file
                      // By lines
                      console.log(this.result);
            this.result = this.result.replace(/\r/g, '\n');

            var lines = this.result.split('\n');

            if(lines && lines.length > 1) {
              var result = {
                'header':lines[0] || '',
                'sample':lines[1] || ''
              }

              ImportFields.setFields(result);

              $state.go('importfields');


            } else {
              alert("Invalid File - Number of Lines are less than 1");
            }
            /*
            for(var line = 0; line < lines.length; line++){
              console.log(lines[line]);
            }*/
          };
          reader.readAsBinaryString(file);
        }
      }

    };



    $scope.find = function() {
      ImportHistory.query(function(imported) {
        $scope.imported = imported;
      });
    };
    $scope.getTableHeight = function() {
      var rowHeight = 50; // your row height
      var headerHeight = 25; // your header height
      return {
         height: ($scope.imported.length * rowHeight + headerHeight) + "px"
      };
   };


  }
]);
