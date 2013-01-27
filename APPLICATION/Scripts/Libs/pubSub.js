define(function () {
    var cache = {};

    return {
        pub: function (eventName) {
            /// <summary>
            /// Trigger some event.
            /// Event Args can be passed after eventName parameter
            /// </summary>
            /// <param name="eventName" type="String">Name of event to trigger</param>            

            var args = Array.prototype.slice.call(arguments, 1);

            if (!cache[eventName]) {
                cache[eventName] = [];
            }

            var subscribersAmount = cache[eventName].length;
            for (var i = 0; i < subscribersAmount; i++) {
                cache[eventName][i].apply(null, args);
            }
        },
        sub: function (eventName, callback) {
            if (!cache[eventName]) {
                cache[eventName] = [callback];
            } else {
                cache[eventName].push(callback);
            }
        },
        unsub: function (eventName, callback) {
            if (!eventName) return;

            if (!callback) {
                cache[eventName] = [];
            } else {
                var index = $.inArray(callback, cache[eventName]);
                if (index > -1) {
                    cache[eventName].splice(index, 1);
                }
            }
        }
    };
});