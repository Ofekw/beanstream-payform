(function(window) {
    'use strict';

    /**
     * The Model stores data and notifies the View of changes.
     */
    function InputModel() {
        this._value = '';
        this._isValid = true;
        this._cardType = '';
        this._fieldType = '';
        this._error = '';
        this._caretPos = 0;

        this.valueChanged = new beanstream.Event(this);
        this.validityChanged = new beanstream.Event(this);
        this.cardTypeChanged = new beanstream.Event(this);
    }

    InputModel.prototype = {
        getValue: function() {
            return this._value;
        },
        setValue: function(value) {
            // fires event every time to bring ui back in sync with formating
            this._value = value;
            this.valueChanged.notify();
        },
        getIsValid: function() {
            return this._isValid;
        },
        setIsValid: function(valid) {
            if (valid !== this._isValid) {
                this._isValid = valid;
                this.validityChanged.notify();
            }
        },
        getCardType: function() {
            return this._cardType;
        },
        setCardType: function(cardType) {
            if (cardType !== this._cardType) {
                this._cardType = cardType;
                this.cardTypeChanged.notify();
            }
        },
        getFieldType: function() {
            return this._fieldType;
        },
        setFieType: function(fieldType) {
            this._fieldType = fieldType;
        },
        getError: function() {
            return this._error;
        },
        setError: function(error) {
            this._error = error;
        },
        getCaretPos: function() {
            return this._caretPos;
        },
        setCaretPos: function(pos) {
            this._caretPos = pos;
        }
    };

    // Export to window
    window.beanstream = window.beanstream || {};
    window.beanstream.InputModel = InputModel;
})(window);
