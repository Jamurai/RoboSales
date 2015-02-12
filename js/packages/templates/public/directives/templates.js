

angular.module('mean.templates').directive("handlebars", function() {
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

                   if(matches && ((matches.indexOf("{{first_name}}") >= 0)
                      || (matches.indexOf("{{last_name}}") >= 0)))
                     return true;
                   else
                     return false;

                }



                return true;


            }
        }
    };
});
