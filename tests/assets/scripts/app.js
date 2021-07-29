import '../styles/01-settings/_vendor.scss';

import { registerBlockStyle } from '@wordpress/blocks';
import 'bootstrap/js/dist/collapse';
import 'bootstrap/js/dist/button';
import 'bootstrap/js/dist/collapse';
import 'bootstrap/js/dist/alert';
import test from './test';
import '../styles/app.scss';
import '../styles/_ie-legacy.scss';
(function($) {
    // Use this variable to set up the common and page specific functions. If you
    // rename this variable, you will also need to rename the namespace below.
    var BasePlate = {
        // All pages
        common: {
            init: function() {
                console.log('hi');
                test();

                registerBlockStyle('core/quote', {
                    name: 'fancy-quote',
                    label: 'Fancy Quote',
                });
            },
            finalize: function() {
                // JavaScript to be fired on all pages, after page specific JS is fired
            },
        },
    };

    // The routing fires all common scripts, followed by the page specific scripts.
    // Add additional events for more control over timing e.g. a finalize event
    var UTIL = {
        fire: function(func, funcname, args) {
            var fire;
            var namespace = BasePlate;
            funcname = funcname === undefined ? 'init' : funcname;
            fire = func !== '';
            fire = fire && namespace[func];
            fire = fire && typeof namespace[func][funcname] === 'function';

            if (fire) {
                namespace[func][funcname](args);
            }
        },
        loadEvents: function() {
            // Fire common init JS
            UTIL.fire('common');
            // Fire page-specific init JS, and then finalize JS
            $.each(document.body.className.replace(/-/g, '_').split(/\s+/), function(i, classnm) {
                UTIL.fire(classnm);
                UTIL.fire(classnm, 'finalize');
            });
            // Fire common finalize JS
            UTIL.fire('common', 'finalize');
        },
    };

    // Load Events
    $(document).ready(UTIL.loadEvents);
})(jQuery); // Fully reference jQuery after this point.

if (module.hot) {
    module.hot.accept();
}
