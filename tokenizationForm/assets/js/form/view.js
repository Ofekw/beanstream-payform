
(function(window) {
    'use strict';

    /**
     * The View presents the model and notifies the Controller of UI events.
     */
    function FormView(model, template) {
        var self = this;
        self._model = model;
        this._template = template;

        this.nextPanel = new beanstream.Event(this);
        this.syncAddresses = new beanstream.Event(this);
        this.submit = new beanstream.Event(this);
    }

    FormView.prototype = {
        init: function(config, panels) {
            var self = this;

            self.render('elements', { config: config, panels: panels });
            self.attachPayfieldsListeners();
            self.render('script');
            self.cacheDom(panels);
            self.attachListeners(panels);

            if (panels.shipping && panels.billing) {
                self.render('navigationRelativeToAddressSync', { sync: true, panels: panels });
            }

        },
        render: function(viewCmd, parameter) {

            var self = this;
            var viewCommands = {
                elements: function() {
                    // parameter.config, parameter.panels
                    if (!self.body) {
                        self.body = document.getElementsByTagName('body')[0];
                    }
                    var template = self._template.show(parameter.config, parameter.panels);
                    var frag = self.createDocFrag(template);
                    self.body.appendChild(frag);
                },
                script: function() {
                    var script = document.createElement('script');
                    script.src = 'https://s3-us-west-2.amazonaws.com/payform-staging/payForm/payFields/beanstream_payfields.js';
                    script.setAttribute('data-submit-form', 'false');
                    var form = document.getElementsByTagName('form')[0];
                    form.appendChild(script);
                },
                currentPanel: function() {
                    // parameter.panels, parameter.old, arameter.new

                    self._domPanels[parameter.new].className = self._domPanels[parameter.new].className.replace(' hidden', '');
                    if (parameter.old) {
                        self._domPanels[parameter.old].className += ' hidden';
                    }
                },
                navigationRelativeToAddressSync: function() {
                    // parameter.panels, parameter.sync

                    var button = self._domPanels.shipping.getElementsByTagName('button')[0];
                    if (parameter.sync) {
                        button.innerHTML = parameter.panels.billing.next + ' &gt;';
                    } else {
                        button.innerHTML = parameter.panels.shipping.next + ' &gt;';
                    }

                    // toDo: update previous button on card panel

                }
            };

            viewCommands[viewCmd]();
        },
        cacheDom(panels) {
            var self = this;
            self._domPanels = {};
            for (var key in panels) {
                self._domPanels[key] = document.getElementById(key + '_panel');
            }
        },
        attachListeners: function(panels) {
            var self = this;

            if (panels.shipping) {
                var button = self._domPanels.shipping.getElementsByTagName('button')[0];
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    e = e || window.event;
                    self.nextPanel.notify(panels.shipping.name);
                }.bind(self), false);
            }
            if (panels.billing) {
                var button = self._domPanels.billing.getElementsByTagName('button')[0];
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    e = e || window.event;
                    self.nextPanel.notify(panels.billing.name);
                }.bind(self), false);
            }

            if (panels.shipping && panels.billing) {
                var checkbox = self._domPanels.shipping.querySelectorAll('input[type=checkbox]')[0];
                checkbox.addEventListener('click', function(e) {
                    self.syncAddresses.notify(e.target.checked);
                }, false);
            }

            var closeButton = document.getElementsByTagName('a')[0];
            closeButton.addEventListener('click', function(e) {
                var self = this;
                e.preventDefault();
                e = e || window.event;
                self.closeIframe();
            }.bind(self), false);

            // Add listeners to all inputs on shipping and billing panels
            var shippingInputs = [];
            var billingInputs = [];

            if (self._domPanels.shipping) {
                // shippingInputs = self._domPanels.shipping.getElementsByTagName('input');
                shippingInputs = self._domPanels.shipping.querySelectorAll('input[type=text]');
                shippingInputs = Array.prototype.slice.call(shippingInputs);
            }
            if (self._domPanels.billing) {
                billingInputs = self._domPanels.billing.querySelectorAll('input[type=text]');
                billingInputs = Array.prototype.slice.call(billingInputs);
            }

            var inputs = shippingInputs.concat(billingInputs);

            for (var i = 0; i < inputs.length; i++) {
                inputs[i].addEventListener('keyup', self.updateAddresses.bind(self), false);
            }

        },
        updateAddresses: function(e) {
            var self = this;
            e = e || window.event;
            var blob = {};

            // get all address fields in panel
            if (self.isDescendant(self._domPanels.shipping, e.target)) {
                var inputs = self._domPanels.shipping.querySelectorAll('input[type=text]');
                for (var i = 0; i < inputs.length; i++) {
                    var key = inputs[i].getAttribute('data-id');
                    blob[key] = inputs[i].value;
                }
                self._model.setShippingAddress(blob);

                if (self._model.getAddressSync()) {
                    self._model.setBillingAddress(blob);
                }

            } else {
                var inputs = self._domPanels.billing.querySelectorAll('input[type=text]');
                for (var i = 0; i < inputs.length; i++) {
                    var key = inputs[i].getAttribute('data-id');
                    blob[key] = inputs[i].value;
                }
                self._model.setBillingAddress(blob);
            }
        },
        closeIframe: function() {
            var self = this;
            console.log('closeIframe');
            self.fireEvent('beanstream_closePayform');
        },
        fireEvent: function(title, eventDetail) {
            var event = new CustomEvent(title);
            event.eventDetail = eventDetail;
            document.dispatchEvent(event);
        },
        attachPayfieldsListeners: function() {
            var self = this;
            document.addEventListener('beanstream_loaded', this.addStylingToPayfields);
            document.addEventListener('beanstream_tokenUpdated', this.onSubmit.bind(self));
        },
        isDescendant: function(parent, child) {
            var node = child.parentNode;
            while (node != null) {
                if (node == parent) {
                    return true;
                }
                node = node.parentNode;
            }

            return false;
        },
        onSubmit: function() {
            console.log('onSubmit: ' + document.getElementsByName('singleUseToken')[0].value);

            var self = this;
            var token = document.getElementsByName('singleUseToken')[0].value;
            self._model.setToken(token);

            self.submit.notify();
        },

        addStylingToPayfields: function() {
            console.log('addStylingToPayfields');

            var cardPanel = document.getElementById('card_panel');
            var inputs = cardPanel.getElementsByTagName('input');
            for (var i = 0; i < inputs.length; i++) {
                inputs[i].className += ' u-full-width';
                inputs[i].type = 'text';
            }
        },
        createDocFrag: function(htmlStr) {
            // http://stackoverflow.com/questions/814564/inserting-html-elements-with-javascript
            var frag = document.createDocumentFragment();
            var temp = document.createElement('div');
            temp.innerHTML = htmlStr;
            while (temp.firstChild) {
                frag.appendChild(temp.firstChild);
            }
            return frag;
        }

    };

    // Export to window
    window.beanstream = window.beanstream || {};
    window.beanstream.payform = window.beanstream.payform || {};
    window.beanstream.payform.FormView = FormView;
})(window);