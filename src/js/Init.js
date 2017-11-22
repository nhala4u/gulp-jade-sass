"use strict"

var Mercedes = {} || "";

(function() {
    Mercedes.Init = function() {
        Mercedes.PageLoad();
        Mercedes.Contact();
    }
    Mercedes.PageLoad = function() {
        console.warn('||--> Task Pageload .!');
        var gaID = 'UA-53471595-XX';

        // Init Components
        Mercedes.i18n();
        Mercedes.Message();
        Mercedes.GoogleAnalytics(gaID);
        Mercedes.Devices();
    }
    Mercedes.Message = function() {
        console.log('|/--> Task 2 ...');
    }
    Mercedes.GoogleAnalytics = function(id) {
        console.log('|/--> Task Google Analytics ...');
        (function(i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r;
            i[r] = i[r] || function() {
                (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * new Date();
            a = s.createElement(o),
                m = s.getElementsByTagName(o)[0];
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m)
        })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
        ga('create', id, 'auto');
        ga('send', 'pageview');
    }
    Mercedes.i18n = function() {
        console.log('|/--> Task i18n ...');
    }
    Mercedes.Devices = function() {
        console.log('|/--> Task Devices ...');

    }
    Mercedes.Contact = function() {
        jQuery(document).off('change.checkbox').on('change.checkbox', '[type="checkbox"]', function(event) {
            console.log('this', this);
        });
        // jQuery(document).off('change.selectItem').on('change.selectItem', '[type="checkbox"]', function() {
        //     console.log('this', this);
        // });
    };
})(jQuery)

$(document).ready(function() {
    Mercedes.Init();
});