import { ILocaleText } from "./Interfaces";
import { Language, Setting } from "./Setting";
import { isNone } from "./Util";

export function getTextByLanguage(localText: ILocaleText): string {
    if (isNone(localText)) {
        return "";
    }
    switch (Setting.instance.getLanguage()) {
    case Language.Chinese:
        return localText.zh;
    case Language.English:
        return localText.en;
    default:
        return "";
    }
}
