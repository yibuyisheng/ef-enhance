define([
    'require',
    '../Extension',
    '../main',
    '../lib'
], function (require) {
    var Extension = require('../Extension');
    function CustomData() {
        Extension.apply(this, arguments);
    }
    CustomData.prototype.type = 'CustomData';
    var dataProperty = /^data[A-Z0-9]/;
    CustomData.prototype.activate = function () {
        Extension.prototype.activate.apply(this, arguments);
        var data = this.target.data;
        if (typeof data !== 'object') {
            data = require('../main').parseAttribute(this.target.data);
        }
        for (var key in this.target) {
            if (this.target.hasOwnProperty(key) && dataProperty.test(key)) {
                var dataKey = key.charAt(4).toLowerCase() + key.slice(5);
                data[dataKey] = this.target[key];
            }
        }
        this.target.getData = function (key) {
            return data[key];
        };
        this.target.setData = function (key, value) {
            data[key] = value;
        };
    };
    CustomData.prototype.inactivate = function () {
        Extension.prototype.inactivate.apply(this, arguments);
        delete this.target.getData;
        delete this.target.setData;
    };
    require('../lib').inherits(CustomData, Extension);
    require('../main').registerExtension(CustomData);
    return CustomData;
});