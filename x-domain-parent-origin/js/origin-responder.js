/* global OriginResponder */
OriginResponder = (function (window, undefined) {
    'use strict';


    var messageHandler = function (event) {
        try {
            var message = JSON.parse(event.data);
            if (message.hasOwnProperty('type') && message.type === 'parentOriginRequest') {
                event.source.postMessage(JSON.stringify({ type: 'parentOriginResponse', origin: getOrigin(window.location) }), event.origin);
            }
        } catch (e) { }
    }

    function getOrigin(location) {
        return location.protocol + "//" + location.hostname + (location.port ? ':' + location.port : '');
    }

    function initialize() {
        if (window.addEventListener)
            window.addEventListener('message', messageHandler, false);
        else if (window.attachEvent)
            window.attachEvent('onmessage', messageHandler, false);
    }

    function dispose() {
        if (window.removeEventListener)
            window.removeEventListener('message', messageHandler, false);
        else if (window.detachhEvent)
            window.detachEvent('onmessage', messageHandler, false);
    }

    function requestParentOrigin() {
        if (parent) {
            parent.postMessage(JSON.stringify({ type: 'parentOriginRequest' }), '*');
        }
    }


    return {

        initialize: function () {
            initialize();
        },

        dispose: function () {
            dispose();
        }

    };



} (window));
