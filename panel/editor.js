const advEditorContext = {};

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

function onSwitchDataCategory(category) {
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

function main() {
    $('.ui.dropdown').dropdown();
}

main();
