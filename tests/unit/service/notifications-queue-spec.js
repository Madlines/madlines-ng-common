describe('Service MadlinesCommonNotificationsQueue', function () {
    var Notifications;
    var $timeout;

    beforeEach(function () {
        module('madlines.common', function ($provide) {
            $provide.service('$timeout', function () {
                return setTimeout; // we do not use standard mock for $timeout here for a reason
            });
        });

        inject(function (_MadlinesCommonNotificationsQueue_) {
            Notifications = _MadlinesCommonNotificationsQueue_;
        });
    });

    describe('has method bind which', function () {
        it('should set a callback to be executed every time notification list is changed', function () {
            var notifications = null;
            var controlList = [];
            var calls = 0;

            Notifications.bind(function (queue) {
                notifications = queue;
                calls++;
            });

            expect(notifications).toBe(null);

            // add notification
            controlList.push(Notifications.add('foo', 'bar'));

            expect(notifications.length).toBe(1);
            expect(notifications[0]).toBe(controlList[0]);

            // add notification
            controlList.push(Notifications.add('lorem', 'ipsum'));

            expect(notifications.length).toBe(2);
            expect(notifications[0]).toBe(controlList[0]);
            expect(notifications[1]).toBe(controlList[1]);

            // remove notification
            controlList[0].close();

            expect(notifications.length).toBe(1);
            expect(notifications[0]).toBe(controlList[1]);

            expect(calls).toBe(3);
        });
    });

    describe('has method add which', function () {
        it('should create notification with specified type, message and options', function () {
            var notification = Notifications.add('foo', 'bar', {closable: false, timeout: 5000});

            expect(notification.type).toBe('foo');
            expect(notification.message).toBe('bar');
            expect(notification.closable).toBe(false);
            expect(notification.timeout).toBe(5000);
        });

        it('should close itself after specified timeout', function (done) {
            var notifications = [];
            var n1, n2, n3;

            Notifications.bind(function (queue) {
                notifications = queue;
            });

            n1 = Notifications.add('lorem', 'ipsum', {timeout: 5});
            n2 = Notifications.add('foo', 'bar', {timeout: 1});
            n3 = Notifications.add('foo', 'bar2', {timeout: 5});
            expect(notifications.length).toBe(3);

            setTimeout(function () {
                expect(notifications.length).toBe(2);

                expect(notifications.indexOf(n1)).toBe(0);
                expect(notifications.indexOf(n2)).toBe(-1);
                expect(notifications.indexOf(n3)).toBe(1);
            }, 2);

            setTimeout(function () {
                expect(notifications.length).toBe(0);
                done();
            }, 6);
        });
    });

    describe('has a set of default types which', function () {
        it('should use the default settings for a type when one of those types is used and no overrides are provided', function () {
            var notify = Notifications.add('notify', 'Notify');
            var success = Notifications.add('success', 'Success notification');
            var alert = Notifications.add('alert', 'Alert notification');
            var warning = Notifications.add('warning', 'Warning notification');
            var progress = Notifications.add('progress', 'Progress notification');

            expect(notify.type).toBe('notify');
            expect(notify.timeout).toBe(10000);
            expect(notify.closable).toBe(true);

            expect(success.type).toBe('success');
            expect(success.timeout).toBe(10000);
            expect(success.closable).toBe(true);

            expect(alert.type).toBe('alert');
            expect(alert.timeout).toBe(10000);
            expect(alert.closable).toBe(true);

            expect(warning.type).toBe('warning');
            expect(warning.timeout).toBe(10000);
            expect(warning.closable).toBe(true);

            expect(progress.type).toBe('progress');
            expect(progress.timeout).toBe(false);
            expect(progress.closable).toBe(false);
        });

        it('should use overrides if provided', function () {
            var alert = Notifications.add('alert', 'Alert notification', {closable: false, timeout: false});

            expect(alert.timeout).toBe(false);
            expect(alert.closable).toBe(false);
        });

        it('should be available via shorthand methods', function () {
            var notify = Notifications.notify('Notify', {timeout: 500, closable: false});
            var success = Notifications.success('Success notification', {timeout: 500, closable: false});
            var alert = Notifications.alert('Alert notification', {timeout: 500, closable: false});
            var warning = Notifications.warning('Warning notification', {timeout: 500, closable: false});
            var progress = Notifications.progress('Progress notification', {timeout: 500, closable: true});

            expect(notify.type).toBe('notify');
            expect(notify.timeout).toBe(500);
            expect(notify.closable).toBe(false);

            expect(success.type).toBe('success');
            expect(success.timeout).toBe(500);
            expect(success.closable).toBe(false);

            expect(alert.type).toBe('alert');
            expect(alert.timeout).toBe(500);
            expect(alert.closable).toBe(false);

            expect(warning.type).toBe('warning');
            expect(warning.timeout).toBe(500);
            expect(warning.closable).toBe(false);

            expect(progress.type).toBe('progress');
            expect(progress.timeout).toBe(500);
            expect(progress.closable).toBe(true);
        });
    });

    describe('has method setDefaults', function () {
        it('should override existing settings', function () {
            var success;

            Notifications.setDefaults({
                success: {
                    timeout: 5000,
                    closable: false
                }
            });

            success = Notifications.success('Foo bar');

            expect(success.timeout).toBe(5000);
            expect(success.closable).toBe(false);
        });

        it('should be able to add more types', function () {
            var notification;

            Notifications.setDefaults({
                foobar: {
                    timeout: 5000,
                    closable: false
                }
            });

            notification = Notifications.add('foobar', 'Lorem ipsum');

            expect(notification.timeout).toBe(5000);
            expect(notification.closable).toBe(false);
        });
    });
});
