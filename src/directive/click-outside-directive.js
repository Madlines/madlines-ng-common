(function (angular) {

    'use strict';

    function ClickOutsideDirective ($document) {
        var postLink = function (scope, element, attr) {
            var body = angular.element($document[0].body);

            var bodyClicked = function (event) {
                if (!element[0].contains(event.target)) {
                    scope.$evalAsync(attr.mlClickOutside, {
                        $event: event
                    });
                }
            };

            body.bind('click', bodyClicked);

            element.on('$destroy', function () {
                body.unbind('click', bodyClicked);
            });
        };

        return {
            restrict: 'A',
            scope: false,
            link: postLink
        };
    }

    angular.module('madlines.common')
        .directive('mlClickOutside', ['$document', ClickOutsideDirective]);

}(window.angular)); 
