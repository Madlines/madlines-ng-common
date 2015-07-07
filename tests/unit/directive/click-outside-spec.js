describe('Directive mlClickOutside', function () {
    var $compile;
    var $rootScope;

    var html = '<section class="body" ng-click="lorem = \'ipsum\';"><section class="sub"><div ml-click-outside="foo=\'bar\';"><span>Click me</span></div></section></section>';
    var dockumentMock;
    var compiled;

    beforeEach(function () {
        module('madlines.common', function ($provide) {
            dockumentMock = [
            { body: angular.element(html) }
            ];

            $provide.service('$document', function () {
                return dockumentMock;
            });
        });
    });

    beforeEach(inject(function(_$compile_, _$rootScope_){
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    })); 

    beforeEach(function () {
        compiled = $compile(dockumentMock[0].body)($rootScope);
        $rootScope.$digest();
    });

    describe('when clicked on body outside the element', function () {
        it('should $eval expression connected to attribute', function () {
            expect($rootScope.foo).not.toBeDefined();
            expect($rootScope.lorem).not.toBeDefined();

            compiled.triggerHandler('click');
            $rootScope.$digest();

            expect($rootScope.foo).toBe('bar');
            expect($rootScope.lorem).toBe('ipsum');
        });
    });

    describe('when clicked on element', function () {
        it('should not $eval expression connected to attribute', function () {
            var div;

            expect($rootScope.foo).not.toBeDefined();
            expect($rootScope.lorem).not.toBeDefined();

            div = compiled.find('section').find('div')

            div.triggerHandler('click');
            $rootScope.$digest();

            expect($rootScope.foo).not.toBeDefined();
            expect($rootScope.lorem).not.toBeDefined();
        });
    });

    describe('when clicked inside element', function () {
        it('should not $eval expression connected to attribute', function () {
            var div;

            expect($rootScope.foo).not.toBeDefined();
            expect($rootScope.lorem).not.toBeDefined();

            div = compiled.find('section').find('div').find('span');

            div.triggerHandler('click');
            $rootScope.$digest();

            expect($rootScope.foo).not.toBeDefined();
            expect($rootScope.lorem).not.toBeDefined();
        });
    });
});
