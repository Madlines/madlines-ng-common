(function (angular, Object) {

    'use strict';

    function NotificationItem (notifications, type, message, closable, timeout) {

        this.close = function () {
            notifications.close(this);
        };

        Object.defineProperties(this, {
            message: {
                value: message
            },
            type: {
                value: type
            },
            closable: {
                value: closable
            },
            timeout: {
                value: timeout
            }
        });
    }

    function NotificationsQueue ($timeout) {
        var queue = [];
        var defaults = {
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
        };

        var binding;

        var triggerBinding = function () {
            if (binding) {
                binding(queue);
            }
        };

        var close = function (notification) {
            var index = queue.indexOf(notification);

            if (-1 === index) {
                return;
            }

            queue.splice(index, 1);
            triggerBinding();
        };

        this.setDefaults = function (options) {
            defaults = angular.extend(defaults, options);
        };

        this.close = close;

        this.add = function (type, message, options) {
            var notification;
            var settings = angular.extend((defaults[type] || {}), options);

            if (!settings) {
                settings = {
                    closable: true,
                    timeout: 10000
                }
            }

            notification = new NotificationItem(this, type, message, settings.closable, settings.timeout);

            queue.push(notification);
            triggerBinding();

            if (settings.timeout) {
                $timeout(function () {
                    close(notification);
                }, settings.timeout)
            }

            return notification;
        };

        this.bind = function (fn) {
            binding = fn;
        };

        this.notify = function (message, options) {
            return this.add('notify', message, options)
        };

        this.success = function (message, options) {
            return this.add('success', message, options)
        };

        this.alert = function (message, options) {
            return this.add('alert', message, options)
        };

        this.progress = function (message, options) {
            return this.add('progress', message, options)
        };

        this.warning = function (message, options) {
            return this.add('warning', message, options)
        };
    }

    angular.module('madlines.common')
        .service('MadlinesCommonNotificationsQueue', ['$timeout', NotificationsQueue]);

}(window.angular, window.Object));
