const advEditorContext = {
    data: {},
    modified: false,
};

const LANGUAGE = {
    ZH: "0",
    EN: "1",
};

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
    const tabs = ["plot", "character", "background", "audio", "item", "property"];
    for (let i = 0; i < tabs.length; i++) {
        const tabCategory = tabs[i];
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
    const idEntry = document.createElement("a");
    idEntry.className = "item id-entry";
    setIDEntryView(idEntry, id);
    idList.appendChild(idEntry);
}

function setIDEntryView(idEntry, id) {
    idEntry.innerHTML = "";
    const span = document.createElement("div");
    span.style.width = "100%";
    span.innerHTML = id;
    span.onmouseup = (event) => {
        showData(id);
        event.stopPropagation();
    };
    span.oncontextmenu = (event) => {
        advEditorContext["id-pop-menu-args"] = [ idEntry, id ];
        popMenu("id-pop-menu", event.clientX, event.clientY);
        event.stopPropagation();
    };
    idEntry.appendChild(span);
}

class DataViewSegment {

    constructor() {
        this.segmentDiv = this._createElement("div", "ui vertical segment");
    }

    _createElement(elemName, className, parent) {
        if (!elemName) {
            return null;
        }
        const elem = document.createElement(elemName);
        elem.className = (!className ? "" : className);
        if (parent) {
            parent.appendChild(elem);
        }
        return elem;
    }

    _createRow(name) {
        const gridDiv = this._createElement("div", "ui grid", this.segmentDiv);
        const nameDiv = this._createElement("div", "one wide column", gridDiv);
        nameDiv.innerHTML = name;
        return this._createElement("div", "twelve wide column", gridDiv);
    }

    addDropdownList(name, options) {
        const valueDiv = this._createRow(name);
        for (let i = 0; i < options.length; i++) {
            
        }
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

    } catch (e) {
        console.error(`showCharacterDataView: ${e}`);
    }
}

function showBackgroundDataView(dataDiv, dataEntry) {
    try {

    } catch (e) {
        console.error(`showBackgroundDataView: ${e}`);
    }
}

function showAudioDataView(dataDiv, dataEntry) {
    try {

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
        const dataView = new DataViewSegment();

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
        const input = document.createElement("input");
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

        const inputDiv = document.createElement("div");
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

    onInitEditor();
}

main();
