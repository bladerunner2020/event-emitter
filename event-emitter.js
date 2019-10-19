// EventEmitter for iRidium Mobile
// requires js-ext

function EventEmitter() {
    this._listeners = {};

    this.on = function(eventName, listener) {
        if (typeof eventName !== 'string') {
            throw new Error('event name must be string');
        }
        if (typeof listener !== 'function') {
            throw new TypeError('TypeError [ERR_INVALID_ARG_TYPE]: The "listener" argument must be of type Function. Received type ' + typeof listener);
        }

        var listeners = this._listeners[eventName];
        if (!listeners) {
            listeners = [];          
            this._listeners[eventName] = listeners;
        }
        listeners.push(listener);

        return this;
    };

    this.once = function(eventName, listener) {
        var that = this;

        function onceListener() {
            listener.apply(this, arguments); 
            that.removeListener(eventName, onceListener);
            that._removed = true;
        }
        this.on(eventName, onceListener);
    };

    this.addListener = this.on;

    this.emit = function(eventName /* arg1, arg2 ...*/) {
        if (eventName === 'error' && this.listenerCount('error') === 0) {
            var err = arguments[1] instanceof Error ? arguments[1] : 
                new Error('Error [ERR_UNHANDLED_ERROR]: Unhandled error. (\'' + arguments[1] + '\')');
            throw err;
        }

        this._removed = false;
        var listeners = this._listeners[eventName];
        if (!listeners) { return; }
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0; i < listeners.length; i++) {
            var listener = listeners[i];
            listener.apply(this, args);
            if (this._removed) {
                this._removed = false;
                i--;
            }
        }
    };

    this.eventNames = function() {   
        var names = [];
        for (var name in this._listeners) {
            names.push(name);
        }     
        return names;
        // return Object.keys(this._listeners);
    };

    this.listenerCount = function(eventName) {
        return this._listeners[eventName] ? this._listeners[eventName].length : 0;
    };

    this.listeners = function(eventName) {
        return this._listeners[eventName] ? this._listeners[eventName] : [];
    };

    this.removeListener = function(eventName, listener) {
        var listeners = this._listeners[eventName];
        if (!listeners) {
            return this;
        }
        var index = listeners.indexOf(listener);
        if (index === -1) {
            return this;
        } 

        listeners.splice(index, 1);
        return this;
    };

    this.off = this.removeListener;

    this.prependListener = function(eventName, listener) {
        if (typeof eventName !== 'string') {
            throw new Error('event name must be string');
        }
        if (typeof listener !== 'function') {
            throw new TypeError('TypeError [ERR_INVALID_ARG_TYPE]: The "listener" argument must be of type Function. Received type ' + typeof listener);
        }

        var listeners = this._listeners[eventName];
        if (!listeners) {
            listeners = [];          
            this._listeners[eventName] = listeners;
        }
        listeners.unshift(listener);

        return this;
    };

    this.prependOnceListener = function(eventName, listener) {
        var that = this;

        function onceListener() {
            listener.apply(this, arguments); 
            that.removeListener(eventName, onceListener);
            that._removed = true;
        }
        this.prependListener(eventName, onceListener);
    };

    this.removeAllListeners = function(eventName) {
        this._listeners[eventName] = [];
    };
}

if (typeof IR === 'undefined') {
    module.exports = {
        EventEmitter: EventEmitter
    };
}
