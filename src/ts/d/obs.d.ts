/// <reference path="jquery.d.ts" />
/// <reference path="strings.d.ts" />
interface Catalog {
    catalogs: any[];
    languages: Language[];
}
interface Language {
    language: string;
    title: string;
    direction: string;
    resources: Resource[];
}
interface Resource {
    identifier: string;
    projects: Project[];
    version: string;
    issued: string;
    modified: string;
}
interface Project {
    identifier: string;
    title: string;
    formats: Format[];
}
interface Format {
    format: string;
    modified: string;
    quality: string;
    size: number;
    url: string;
    chapters: Chapter[];
}
interface Chapter extends Format {
    identifier: string;
}
declare class ResourceTypes {
    text: Format[];
    audio: Format[];
    video: Format[];
    other: Format[];
}
declare class OBS {
    static lang_h2: string;
    static chapters_h2: string;
    static res_type_desc: string;
    static res_li: string;
    static res_ul: string;
    static description: string;
    static size_span: string;
    testString: string;
    loadResult: string;
    languages: Language[];
    constructor(url: string, callback?: Function);
    extractOBS(data: Language[]): void;
    buildDiv(callback?: Function): void;
    static getResources(lang: Language): ResourceTypes;
    private static getUrlExt;
    private static getFormatFromFields;
    private static getDescription;
    private static getRemoteFileSize;
    private static getSizeString;
    private static getList;
}
