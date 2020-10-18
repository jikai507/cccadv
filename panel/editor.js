const advEditorContext = {};

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
        Editor.Ipc.sendToMain("cccadv:load-data-to-editor", category, function (err, answer) {
            if (err) {
                console.error(`loadData: ${err}`);
                return;
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
                console.error(`loadData: unknown data category "${category}".`);
                break;
            }
        });
    } catch (e) {
        console.error(`loadData: ${e}`);
    }
}


function popIDMenu() {
    try {

    } catch (e) {
        console.error(`popIDMenu: ${e}`);
    }
}

function popDataMenu() {
    try {

    } catch (e) {
        console.error(`popDataMenu: ${e}`);
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

    onInitEditor();
}

main();
