/// <reference path="jquery.d.ts" />
/// <reference path="strings.d.ts" />
interface Catalog {
    catalogs: any[];
    languages: Language[];
}
interface Language {
    title: string;
    identifier: string;
    resources: Resource[];
    obs_resource: Resource;
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
}
declare class ResourceTypes {
    text: Format[];
    audio: Format[];
    video: Format[];
    other: Format[];
}
declare class OBS {
    lang_h2: string;
    res_type_desc: string;
    static res_li: string;
    static res_ul: string;
    testString: string;
    loadResult: string;
    languages: Language[];
    constructor(url: string, callback?: Function);
    extractOBS(data: Catalog): void;
    buildDiv(): void;
    static getResources(lang: Language): ResourceTypes;
    private static getDescription(fmt);
    private static getSize(file_size);
    private static getList(res_type);
}
