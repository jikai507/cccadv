'use strict';

function checkPlot() {
    
}

function checkItem() {

}

function checkProperty() {

}

function checkAll() {
    checkProperty();
    checkItem();
    checkPlot();
}

module.exports = {

    load: function() {},

    unload: function() {},

    messages: {
        "cccadv:check-plot": checkPlot,
        "cccadv:check-item": checkItem,
        "cccadv:check-property": checkProperty,
        "cccadv:check-all": checkAll,
    },

};