'use strict';

const fs = require("fs");

const RES_DIR = "assets/resources";

const DATA_DIR = `${RES_DIR}/data`;

const DATA_FILES = [
    `${DATA_DIR}/background.json`,
    `${DATA_DIR}/audio.json`,
    `${DATA_DIR}/item.json`,
    `${DATA_DIR}/property.json`,
    `${DATA_DIR}/character.json`,
    `${DATA_DIR}/plot.json`,
];

const BOILERPLATE_DIRS = [
    `${RES_DIR}/audio`,
    `${RES_DIR}/audio/bgm`,
    `${RES_DIR}/audio/soundeffect`,
    `${RES_DIR}/image`,
    `${RES_DIR}/image/background`,
    `${RES_DIR}/image/character`,
    `${RES_DIR}/image/item`,
    `${RES_DIR}/image/ui`,
    `${RES_DIR}/scripts`,
    `${RES_DIR}/page`,
    `${RES_DIR}/audio`,
    DATA_DIR,
];

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

    load: function() {
        try {
            for (let i = 0; i < BOILERPLATE_DIRS.length; i++) {
                const dir = `${Editor.Project.path}/${BOILERPLATE_DIRS[i]}`;
                if (fs.existsSync(dir) === false) {
                    fs.mkdirSync(dir, {
                        recursive: true,
                    });
                }
            }

            for (let i = 0; i < DATA_FILES.length; i++) {
                const file = `${Editor.Project.path}/${DATA_FILES[i]}`;
                if (fs.existsSync(file) === false) {
                    fs.writeFileSync(file, JSON.stringify({}), {
                        encoding: "utf-8",
                    });
                }
            }
        } catch (e) {
            Editor.error(e);
        }
    },

    unload: function() {},

    messages: {
        "cccadv:check-plot": checkPlot,
        "cccadv:check-item": checkItem,
        "cccadv:check-property": checkProperty,
        "cccadv:check-all": checkAll,
    },

};