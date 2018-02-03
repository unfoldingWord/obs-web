/// <reference path="jquery.d.ts" />
/// <reference path="strings.d.ts" />
/// <reference path="region_data.d.ts" />
interface LanguageData {
    lc: string;
    alt: string[];
    lr: string;
    pk: number;
    gw: boolean;
    ld: string;
    cc: string[];
    ln: string;
    ang: string;
}
declare class LangNames {
    testString: string;
    loadResult: string;
    languages: LanguageData[];
    constructor(url: string, callback?: Function);
}
