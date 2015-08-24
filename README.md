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

### MadlinesCommonNotificationsQueue

Service MadlinesCommonNotificationsQueue provides you with an easy way to create notifications area.
Each notification can
 - have a different type
 - different timeout after which it will be automatically closed
 - have a `closable` flag set to `true` or `false` which can be used in UI to display closing button or not.

MadlinesCommonNotificationsQueue is just a service so it doesn't provide you with any html or styles. That's your job.
Yet connecting it is really easy, see [demo](demo/notifications-queue.html).

#### Usage

In your html you need to write code which will display your notifications. It can look like this:

```html
<div class="notification"
     ng-repeat="notification in notifications"
     ng-class="notification.type">
    {{ notification.message }}
    <a ng-if="notification.closable"
       class="close" ng-click="notification.close()">&times;</a>
</div>
```

In controller which controls this part of html you need to inject MadlinesCommonNotificationsQueue service
and bind callback to it's changes. This will update `notifications` every time you add something.

```js
app.controller('DemoController', ['$scope', 'MadlinesCommonNotificationsQueue', function ($scope, Notifications) {
    // notice that we use Notifications as shorthand for MadlinesCommonNotificationsQueue
    Notifications.bind(function (queue) {
        $scope.notifications = queue;
    });

    // rest of your controller
}]);
```

Finally add some notifications (anywhere in your app)

```js
Notifications.add(type, message, options); // third parameter is optional
```

In options you can specify `timeout` and `closable` flag


```js
Notifications.add('myType', 'Contents of message', {
    closable: true,
    timeout: 10000
});
```

MadlinesCommonNotificationsQueue comes preconfigured with few types:
 - success
 - alert
 - warning
 - notify
 - progress

For those types there is a set of handy shorthand functions:

```js
// second parameter is optional for all of those
Notifications.success(message, options);
Notifications.alert(message, options);
Notifications.warning(message, options);
Notifications.notify(message, options);
Notifications.progress(message, options);
```

You can easily override those default settings and also add you own defaults if you need to:

```js
Notifications.setDefaults({
    notify: {
        closable: true,
        timeout: 10000
    },
    success: {
        closable: true,
        timeout: 10000
    },
    alert: {
        closable: true,
        timeout: 10000
    },
    warning: {
        closable: true,
        timeout: 10000
    },
    progress: {
        closable: false,
        timeout: false
    }
});
```

To close items with `closable` flag set to `true` you can use `close` method of notification
(the same method is used in html).

```js
var progress = Notifications.progress('Loading data');

// when data is loaded
progress.close();
```
