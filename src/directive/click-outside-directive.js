(function (angular) {

    'use strict';

    function ClickOutsideDirective ($document) {
        var postLink = function (scope, element, attr) {
            var body = angular.element($document[0].body);

            var bodyClicked = function (event) {
                scope.$evalAsync(attr.mlClickOutside, {
                    $event: event
                });
            };

            var elementClicked = function (event) {
                event.stopPropagation();
            };

            element.bind('click', elementClicked);
            body.bind('click', bodyClicked);

            element.on('$destroy', function () {
                element.unbind('click', elementClicked);
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
