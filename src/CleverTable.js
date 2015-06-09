define(
    function () {
        var lib = require('esui/lib');
        var Control = require('esui/Control');
        var u = require('underscore');
        var paint = require('esui/painters');

        function CleverTable() {
            Control.apply(this, arguments);
        }

        CleverTable.prototype = {
            type: 'CleverTable',
            initOptions: function (options) {
                var options = u.extend({
                    itemDom: '<div></div>',
                    itemUpdateFn: function (itemData, itemDom) {
                        itemDom.innerText = itemData.text;
                    },
                    itemKey: 'id'
                }, options);

                this.setProperties(options);
            },
            initStructure: function () {
                var datasource = this.get('datasource') || [];
                for (var i = 0, il = datasource.length; i < il; i++) {
                    add(this, datasource[i], this.get('itemKey'));
                }
            },
            repaint: paint.createRepaint(
                Control.prototype.repaint,
                {
                    name: 'datasource',
                    paint: function (table, datasource) {
                        datasource = datasource || [];
                        for (var i = 0, il = datasource.length; i < il; i++) {
                            add(table, datasource[i], table.get('itemKey'));
                        }
                    }
                }
            )
        };

        lib.inherits(CleverTable, Control);
        require('esui/main').register(CleverTable);

        return CleverTable;

        function add(table, itemData, key) {
            var itemDom = table._itemDomCache ? table._itemDomCache[itemData[key]] : null;
            if (!itemDom) {
                itemDom = createItemDom(table);
                table._itemDomCache = table._itemDomCache || {};
                table._itemDomCache[itemData[key]] = itemDom;
                table.main.appendChild(itemDom);
            }
            table.get('itemUpdateFn')(itemData, itemDom);
        }

        function createItemDom(table) {
            var div = document.createElement('div');
            div.innerHTML = table.get('itemDom');
            return div.firstChild;
        }
    }
);