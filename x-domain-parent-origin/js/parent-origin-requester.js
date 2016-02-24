/* global ParentOriginRequester */
ParentOriginRequester = (function (window, undefined) {
    'use strict';

    var parentOriginRequestCallback;
    var messageHandler = function (event) {
        try {
            var message = JSON.parse(event.data);
            if (message.hasOwnProperty('type') && message.type === 'parentOriginResponse'
                && parentOriginRequestCallback !== null) {
                disposeWindowSubscription();
                parentOriginRequestCallback(message.origin);
            }
        } catch (e) {}
    }

    function subscribeToWindowMessages() {
        if (window.addEventListener) {
            window.removeEventListener('message', messageHandler, false);
            window.addEventListener('message', messageHandler, false);
        }
        else if (window.attachEvent) {
            window.detachEvent('onmessage', messageHandler, false);
            window.attachEvent('onmessage', messageHandler, false);
        }
    }

    function disposeWindowSubscription() {
        if (window.removeEventListener) {
            window.removeEventListener('message', messageHandler, false);
        }
        else if (window.detachEvent) {
            window.detachEvent('onmessage', messageHandler, false);
        }
    }


    function requestParentOrigin() {
        if (parent) {
            subscribeToWindowMessages();
            parent.postMessage(JSON.stringify({ type: 'parentOriginRequest' }), '*');
        }
    }


    return {

        getParentOrigin: function (callback) {

            if (callback !== undefined && typeof callback === 'function') {
                parentOriginRequestCallback = callback;
                requestParentOrigin();
            }
        }
    };

} (window));
