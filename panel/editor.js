const advEditorContext = {
    data: {},
    modified: false,
};

const LANGUAGE = {
    ZH: "0",
    EN: "1",
};

const DEFAULT_TITLE = "ADV编辑器";

const DATA_CATEGORY_TABS = ["plot", "character", "background", "audio", "item", "property"];

const DATA_CATEGORY_NAMES = {
    "plot": "剧情",
    "character": "立绘",
    "background": "背景",
    "audio": "声音",
    "item": "物品",
    "property": "属性",
};

const DOM_TYPE = {
    A: "a",
    ICON: "i",
    BUTTON: "button",
    DIV: "div",
    FORM: "form",
    INPUT: "input",
    IMAGE: "image",
};

function setWindowTitle(title) {
    if (!title) {
        return;
    }
    const titleNode = document.getElementById("title");
    if (undefined === titleNode || null === titleNode) {
        return;
    }
    titleNode.innerHTML = (!title ? DEFAULT_TITLE : title);
}

function updateContentPanelSize() {
    const w = document.body.offsetWidth;
    const h = document.body.offsetHeight;
    const headerPanel = document.getElementById("header-panel");
    const contentPanel = document.getElementById("content-panel");
    contentPanel.style.height = `${h - headerPanel.offsetHeight}px`;
}

window.onresize = function() {
    updateContentPanelSize();
}

function switchDataCategory(category) {
    if (advEditorContext["cur-data-category"] === category) {
        return;
    }
    for (let i = 0; i < DATA_CATEGORY_TABS.length; i++) {
        const tabCategory = DATA_CATEGORY_TABS[i];
        const tabID = `${tabCategory}-tab`;
        const a = document.getElementById(tabID);
        if (tabCategory === category) {
            a.className = "item active";
        } else {
            a.className = "item";
        }
    }
    advEditorContext["cur-data-category"] = category
    localStorage.setItem("data-category", category);
    loadData(category);
}

function switchLanguage(language) {
    advEditorContext["cur-language"] = language;
    localStorage.setItem("language", language);
}

function loadData(category) {
    try {
        Editor.Ipc.sendToMain("cccadv:load-data-to-editor", category, (err, answer) => {
            if (err) {
                console.error(`loadData: ${err}`);
                return;
            }
            onLoadDataEnd(answer, category);
        });
    } catch (e) {
        console.error(`loadData: ${e}`);
    }
}

function onLoadDataEnd(data, category) {
    advEditorContext.data[category] = data;
    refreshIDEntryViewList(null);
}

function refreshIDEntryViewList(reg) {
    const category = advEditorContext["cur-data-category"];
    const dataSet = advEditorContext.data[category];
    const idList = document.getElementById("id-list");
    idList.innerHTML = "";
    for (let id in dataSet) {
        if (!reg || reg.test(id)) {
            addIDEntryView(idList, id);
        }
    }
}

function addIDEntryView(idList, id) {
    const idEntry = document.createElement(DOM_TYPE.A);
    idEntry.className = "item id-entry";
    setIDEntryView(idEntry, id);
    idList.appendChild(idEntry);
}

function setIDEntryView(idEntry, id) {
    idEntry.innerHTML = "";
    const span = document.createElement(DOM_TYPE.DIV);
    span.style.width = "100%";
    span.innerHTML = id;
    span.onmouseup = (event) => {
        showData(id);
        event.stopPropagation();
    };
    span.oncontextmenu = (event) => {
        advEditorContext["id-pop-menu-args"] = [idEntry, id];
        popMenu("id-pop-menu", event.clientX, event.clientY);
        event.stopPropagation();
    };
    idEntry.appendChild(span);
}

class DataForm {

    constructor() {
        this.segmentDiv = this._createElement(DOM_TYPE.DIV, "ui vertical segment");
        this.form = this._createElement(DOM_TYPE.FORM, "ui form", this.segmentDiv);
    }

    _createElement(elemName, className, parent) {
        if (!elemName) {
            return null;
        }
        const elem = document.createElement(elemName);
        if (undefined !== className && null !== className) {
            elem.className = className;
        }
        if (parent) {
            parent.appendChild(elem);
        }
        return elem;
    }

    _createFieldGroup() {
        return this._createElement(DOM_TYPE.DIV, "equal width fields", this.form);
    }

    _createField(name, fieldGroup, sizeClass) {
        const field = this._createElement(DOM_TYPE.DIV, `field ${!sizeClass ? "" : sizeClass}`, (!fieldGroup ? this.form : fieldGroup));
        const nameDiv = this._createElement("label", null, field);
        nameDiv.innerHTML = name;
        return field;
    }

    addDropdownList(name, options, defaultOpt) {
        const field = this._createField(name);
        const dropdownDiv = this._createElement(DOM_TYPE.DIV, "ui selection dropdown", field);
        this._createElement(DOM_TYPE.DIV, "text", dropdownDiv).innerHTML = (undefined === defaultOpt ? options[0] : defaultOpt);
        this._createElement(DOM_TYPE.ICON, "dropdown icon", dropdownDiv);
        const menu = this._createElement(DOM_TYPE.DIV, "menu", dropdownDiv);
        for (let i = 0; i < options.length; i++) {
            const item = this._createElement(DOM_TYPE.DIV, "item", menu);
            item["data-value"] = `${i}`;
            item.innerHTML = options[i];
        }
        return dropdownDiv;
    }

    addLocaleTextEdit(name) {
        const field = this._createField(name);
        const input = this._createElement(DOM_TYPE.INPUT, null, field);
        input.type = "text";
        input.placeholder = "请输入文本";
        return input;
    }

    addAudioRef(name) {
        const field = this._createField(name);
        const inputDiv = this._createElement(DOM_TYPE.DIV, "ui action input", field);
        const input = this._createElement(DOM_TYPE.INPUT, null, inputDiv);
        input.type = "text";
        input.placeholder = "未选择资源";
        input.readonly = true;
        const button = this._createElement(DOM_TYPE.BUTTON, "ui teal right labeled icon button", inputDiv);
        button.innerHTML = "浏览";
        this._createElement(DOM_TYPE.ICON, "folder open icon", button);
        return inputDiv;
    }

    addImageRef(name) {
        const fieldGroup = this._createFieldGroup();

        const resField = this._createField(name, fieldGroup, "eight wide");
        const inputDiv = this._createElement(DOM_TYPE.DIV, "ui action input", resField);
        const input = this._createElement(DOM_TYPE.INPUT, null, inputDiv);
        input.type = "text";
        input.placeholder = "未选择资源";
        input.readonly = true;
        const button = this._createElement(DOM_TYPE.BUTTON, "ui teal right labeled icon button", inputDiv);
        button.innerHTML = "浏览";
        this._createElement(DOM_TYPE.ICON, "folder open icon", button);

        const posXField = this._createField("位置x", fieldGroup, "one wide");
        const posXInput = this._createElement(DOM_TYPE.INPUT, null, posXField);
        posXInput.value = "0";

        const posYField = this._createField("位置y", fieldGroup, "one wide");
        const posYInput = this._createElement(DOM_TYPE.INPUT, null, posYField);
        posYInput.value = "0";

        const scaleXField = this._createField("缩放x", fieldGroup, "one wide");
        const scaleXInput = this._createElement(DOM_TYPE.INPUT, null, scaleXField);
        scaleXInput.value = "1";

        const scaleYField = this._createField("缩放y", fieldGroup, "one wide");
        const scaleYInput = this._createElement(DOM_TYPE.INPUT, null, scaleYField);
        scaleYInput.value = "1";

        // const previewField = this._createField("图片预览");
        // const image = this._createElement(DOM_TYPE.IMAGE, "ui big image", previewField);

        return inputDiv;
    }

    show() {
        const dataDiv = document.getElementById("data-segment");
        dataDiv.appendChild(this.segmentDiv);
    }

}

function showData(id) {
    const category = advEditorContext["cur-data-category"];
    if (undefined === category || null === category) {
        return;
    }
    const dataEntry = advEditorContext.data[category][id];
    if (undefined === dataEntry || null === dataEntry) {
        return;
    }
    const dataDiv = document.getElementById("data-segment");
    dataDiv.innerHTML = "";

    setWindowTitle(`${DEFAULT_TITLE} - ${DATA_CATEGORY_NAMES[category]}(${id})`);

    switch (category) {
    case "plot":
        showPlotDataView(dataDiv, dataEntry);
        break;
    case "character":
        showCharacterDataView(dataDiv, dataEntry);
        break;
    case "background":
        showBackgroundDataView(dataDiv, dataEntry);
        break;
    case "audio":
        showAudioDataView(dataDiv, dataEntry);
        break;
    case "item":
        showItemDataView(dataDiv, dataEntry);
        break;
    case "property":
        showPropertyDataView(dataDiv, dataEntry);
        break;
    default:
        console.error(`onLoadDataEnd: unknown data category "${category}".`);
        break;
    }
}

function showPlotDataView(dataDiv, dataEntry) {
    try {

    } catch (e) {
        console.error(`showPlotDataView: ${e}`);
    }
}

function showCharacterDataView(dataDiv, dataEntry) {
    try {
        const dataForm = new DataForm();
        dataForm.addLocaleTextEdit("名字");
        dataForm.addImageRef("图片");
        dataForm.show();
    } catch (e) {
        console.error(`showCharacterDataView: ${e}`);
    }
}

function showBackgroundDataView(dataDiv, dataEntry) {
    try {
        const dataForm = new DataForm();
        dataForm.addLocaleTextEdit("背景名");
        dataForm.addImageRef("图片");
        dataForm.show();
    } catch (e) {
        console.error(`showBackgroundDataView: ${e}`);
    }
}

function showAudioDataView(dataDiv, dataEntry) {
    try {
        const dataForm = new DataForm();
        dataForm.addAudioRef("音频");
        dataForm.show();
    } catch (e) {
        console.error(`showAudioDataView: ${e}`);
    }
}

function showItemDataView(dataDiv, dataEntry) {
    try {

    } catch (e) {
        console.error(`showItemDataView: ${e}`);
    }
}

function showPropertyDataView(dataDiv, dataEntry) {
    try {
        const dataForm = new DataForm();
        const dropdown = dataForm.addDropdownList("类型", [ "数字", "文本", "布尔" ], "数字");
        dataForm.show();
        $(dropdown).dropdown();
    } catch (e) {
        console.error(`showPropertyDataView: ${e}`);
    }
}

function saveData() {
    try {
        Editor.Ipc.sendToMain("cccadv:save-data-by-editor", advEditorContext.data, (err, answer) => {
            if (err) {
                console.error(`saveData: ${err}`);
                return;
            }
            if (answer === "ok") {
                advEditorContext.modified = false;
                alert("保存完毕");
            }
        });
    } catch (e) {
        console.error(`saveData: ${e}`);
    }
}

function hideAllPopMenus() {
    const popLayer = document.getElementById("pop-layer");
    for (let i = 0; i < popLayer.children.length; i++) {
        popLayer.children[i].style.visibility = "hidden";
    }
}

function popMenu(menuID, x, y) {
    try {
        hideAllPopMenus();

        const popMenu = document.getElementById(menuID);
        popMenu.style.visibility = "visible";
        popMenu.style.left = `${x}px`;
        popMenu.style.top = `${y}px`;

        const popLayer = document.getElementById("pop-layer");
        popLayer.style.visibility = "visible";
    } catch (e) {
        console.error(e);
    }
}

function popMenuByDataCategory(x, y) {
    try {
        const category = advEditorContext["cur-data-category"];
        if ("plot" === category) {
            popMenu("plot-segment-pop-menu", x, y);
        }
    } catch (e) {
        console.error(e);
    }
}

function popNewDataEntryDialog() {
    
}

function popNewPlotEntryDialog() {

}

function renameID() {
    try {
        const args = advEditorContext["id-pop-menu-args"];
        if (!args || args.length <= 0) {
            throw `invalid id entry.`;
        }

        const [ idEntry, id ] = args;
        const input = document.createElement(DOM_TYPE.INPUT);
        input.type = "text";
        input.value = args[1];

        input.onkeyup = (event) => {
            if (event.key === "Enter") {
                input.onblur = null;
                onChangeEntryID(idEntry, id, input.value);
            }
        };

        input.onblur = () => {
            input.onkeyup = null;
            onChangeEntryID(idEntry, id, input.value);
        };

        const inputDiv = document.createElement(DOM_TYPE.DIV);
        inputDiv.className = "ui transparent input";
        inputDiv.append(input);

        idEntry.innerHTML = "";
        idEntry.appendChild(inputDiv);
    } catch (e) {
        console.error(`renameID: ${e}`);
    }
}

function onChangeEntryID(idEntry, oldID, newID) {
    const category = advEditorContext["cur-data-category"];
    const dataSet = advEditorContext.data[category];
    const data = dataSet[oldID];
    delete dataSet[oldID];
    dataSet[newID] = data;
    setIDEntryView(idEntry, newID.length <= 0 ? oldID : newID);
}

function closePopLayer() {
    try {
        hideAllPopMenus();
        const popLayer = document.getElementById("pop-layer");
        popLayer.style.visibility = "hidden";
    } catch (e) {
        console.error(`closePopLayer: ${e}`);
    }
}

function onSearchBarChange(icon) {
    try {
        const searchInput = document.getElementById("id-search-input");
        if (icon && icon.className === "close link icon") {
            searchInput.value = "";
        }
        const pattern = searchInput.value;
        if (pattern.length > 0) {
            const reg = new RegExp(pattern, "i");
            refreshIDEntryViewList(reg);
            $("#id-search-icon")[0].className = "close link icon";
        } else {
            refreshIDEntryViewList(null);
            $("#id-search-icon")[0].className = "search link icon";
        }
    } catch (e) {
        console.error(`onSearchBarChange: ${e}`);
    }
}

function popDimmer(id) {
    $("#dimmer-layer").dimmer("show");
}

function closeDimmer() {
    $("#dimmer-layer").dimmer("hide");
}

function onInitEditor() {
    try {
        const dataCategory = localStorage.getItem("data-category");
        switchDataCategory(!dataCategory ? "plot" : dataCategory);

        const language = localStorage.getItem("language");
        $("#language-option").dropdown("set selected", language);
    } catch (e) {
        console.error(`onInitEditor: ${e}`);
    }
}

function main() {
    $("#language-option").dropdown({
        onChange: function(value, text, items) {
            switch (items[0].id) {
            case "language-zh":
                switchLanguage(LANGUAGE.ZH);
                break;
            case "language-en":
                switchLanguage(LANGUAGE.EN);
                break;
            }
        },
    });

    $("#plot-tab")[0].onclick = (event) => {
        switchDataCategory("plot");
        event.stopPropagation();
    };

    $("#character-tab")[0].onclick = (event) => {
        switchDataCategory("character");
        event.stopPropagation();
    };

    $("#background-tab")[0].onclick = (event) => {
        switchDataCategory("background");
        event.stopPropagation();
    };

    $("#audio-tab")[0].onclick = (event) => {
        switchDataCategory("audio");
        event.stopPropagation();
    };

    $("#item-tab")[0].onclick = (event) => {
        switchDataCategory("item");
        event.stopPropagation();
    };

    $("#property-tab")[0].onclick = (event) => {
        switchDataCategory("property");
        event.stopPropagation();
    };

    $("#id-segment")[0].oncontextmenu = (event) => {
        popMenu("id-segment-pop-menu", event.clientX, event.clientY);
        event.stopPropagation();
    };

    $("#data-segment")[0].oncontextmenu = (event) => {
        popMenuByDataCategory(event.clientX, event.clientY);
        event.stopPropagation();
    };

    $("#id-search-input")[0].onkeyup = (event) => {
        if (event.key === "Enter") {
            onSearchBarChange();
        }
        event.stopPropagation();
    };

    const searchIcon = $("#id-search-icon")[0];
    searchIcon.onclick = (event) => {
        onSearchBarChange(searchIcon);
        event.stopPropagation();
    };

    $("#dimmer-layer")[0].onclick = (event) => {
        closeDimmer();
        event.stopPropagation();
    };

    $("#plot-action-type-dropdown").dropdown();

    onInitEditor();
}

main();
