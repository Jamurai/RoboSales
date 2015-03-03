

angular.module('mean.settings').directive("handlebars", function() {
    return {
        restrict: "A",

        require: "ngModel",

        link: function(scope, element, attributes, ngModel) {
            ngModel.$validators.handlebars = function(modelValue) {


                //var pattern = /\{\{([^}]+)\}\}/g;
                var pattern = /\{\{(.*?)\}\}/g;


                var matches;
                if(modelValue) {
                   matches = modelValue.match(pattern);
                   if(!matches) return true;

                   //{{User_FirstName}} {{User_LastName}} {{User_Email}} and {{User_Phone}}
                   if(matches && ((matches.indexOf("{{User_FirstName}}") >= 0)
                      || (matches.indexOf("{{User_LastName}}") >= 0)
                      || (matches.indexOf("{{User_Email}}") >= 0)
                      || (matches.indexOf("{{User_Phone}}") >= 0)
                    ))
                     return true;
                   else
                     return false;

                }



                return true;


            }
        }
    };
});
