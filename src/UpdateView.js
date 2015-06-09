define(
    function (require) {
        var UIView = require('ef/UIView');
        var u = require('underscore');

        var exports = {};

        // 暂时去掉烦人的 etpl
        exports.render = function () {
            var container = this.getContainerElement();
            // 容器没有还不一定是没配置好，很可能是主Action销毁了子Action才刚加载完
            if (!container) {
                var url = this.model
                    && typeof this.model.get === 'function'
                    && this.model.get('url');
                throw new Error('Container not found when rendering ' + (url ? '"' + url + '"' : 'view'));
            }

            this.enterDocument();
        };

        exports.replaceValue = function (value) {
            if (typeof value !== 'string') {
                return value;
            }

            if (value.indexOf('$') === 0) {
                return []; // 暂时写成这样，以便 demo 不会报错（ demo 报错是因为 Table 没对 datasource 做不存在判断）
            }

            return UIView.prototype.replaceValue.apply(this, arguments);
        };

        exports.enterDocument = function () {
            this.viewContext = this.createViewContext();

            var container = this.getContainerElement();
            var options = {
                viewContext: this.viewContext,
                properties: this.getUIProperties(),
                valueReplacer: u.bind(this.replaceValue, this)
            };
            try {
                require('esui').init(container, options);
            }
            catch (ex) {
                var error = new Error(
                    'ESUI initialization error on view '
                    + 'because: ' + ex.message
                );
                error.actualError = ex;
                throw error;
            }


            this.bindEvents();

            buildUpdateMap(this);
            this.model.on('change', onModelChange, this);
        };


        var UpdateView = require('eoo').create(UIView, exports);
        return UpdateView;

        function onModelChange(event) {
            var changes = event.changes;
            for (var i = 0, il = changes.length; i < il; i++) {
                var change = changes[i];
                var controls = this.updateMap[change.name];
                if (!controls || !controls.length) {
                    continue;
                }

                for (var j = 0, jl = controls.length; j < jl; j++) {
                    controls[j].control.set(controls[j].viewProperty, change.newValue);
                }
            }
        }

        function buildUpdateMap(view) {
            var uiPrefix = require('esui/main').getConfig('uiPrefix');
            var controls = view.viewContext.getControls();
            var map = {};
            for (var id in controls) {
                if (!controls.hasOwnProperty(id)) {
                    continue;
                }

                var control = controls[id];
                var attributes = control.main.attributes;

                for (var j = 0, jl = attributes.length; j < jl; j++) {
                    var attribute = attributes[j];
                    if (attribute.name.indexOf(uiPrefix) !== 0 || attribute.value.indexOf('$') !== 0) {
                        continue;
                    }

                    var dataName = attribute.value.slice(1);
                    map[dataName] = map[dataName] || [];
                    map[dataName].push({control: control, viewProperty: attribute.name.replace(uiPrefix + '-', '')});
                }
            }

            view.updateMap = map;
        }
    }
);
