const advEditorContext = {};

const LANGUAGE = {
    ZH: "chinese",
    EN: "english",
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
}

function switchLanguage(language) {
    advEditorContext["cur-language"] = language;
}

function onInitEditor() {

}

function main() {
    $('.ui.dropdown').dropdown({
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
