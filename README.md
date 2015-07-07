# madlines-ng-common

The goal of this project is to provide a set of generic directives and/or services
to be used across multiple angular-based projects.

## Current state:

### mlClickOutside directive

That directive $evals attached expression whenever user will click outside the element on which directive is applied.
Expression is executed using `scope.$evalAsync`. It's similar to ngBlur however ngBlur works only for elements like `input`, `select`, `textarea` or `a`. Also ngBlur
didn't always work properly with `a` for me.

Example usage:
```html
<a class="menu-opener" ng-click="toggleMenu();" ml-click-outside="closeMenu();"></a>
```
