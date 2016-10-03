(function(window) {
    'use strict';

    /**
    * Entry point for the Payfields app
    * Functionality:
    * 1. Injects card fields into DOM
    * 2. OnSubmit tokenises field content, clears them and appends hidden field to form
    * 3. Fires 'beanstream_tokenUpdated' event to document if 'data-submitForm' attribute is set to false
    */

    console.log('Starting Beanstream Payfields...');

    var form = {};
    form.model = new beanstream.FormModel();
    form.view = new beanstream.FormView(form.model);
    form.controller = new beanstream.FormController(form.model, form.view);

    if (document.currentScript.hasAttribute('async')) {
        form.controller.init();
    } else {
        document.addEventListener('DOMContentLoaded', function(event) {
            form.controller.init();
        });
    }

})(window);
