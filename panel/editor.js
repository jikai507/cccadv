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
    const idList = document.getElementById("id-list");
    idList.innerHTML = "";
    for (let id in data) {
        addIDEntryView(idList, id);
    }

    switch (category) {
    case "plot":
        break;
    case "character":
        break;
    case "background":
        break;
    case "audio":
        break;
    case "item":
        break;
    case "property":
        break;
    default:
        console.error(`onLoadDataEnd: unknown data category "${category}".`);
        break;
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

function showData(id) {
    const category = advEditorContext["cur-data-category"];
    const dataEntry = advEditorContext.data[category][id];
    // TODO: handle data entry here ...
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

function popMenuByDataCategory() {
    try {
        const category = advEditorContext["cur-data-category"];
        if ("plot" === category) {
            popMenu("plot-pop-menu");
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
        popMenu("plot-segment-pop-menu", event.clientX, event.clientY);
        event.stopPropagation();
    };

    onInitEditor();
}

main();
