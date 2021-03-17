/// <reference path="strings.d.ts" />
interface Catalog {
    catalogs: any[];
    languages: Language[];
}
interface Language {
    language: string;
    title: string;
    direction: string;
    subjects: {
        [key: string]: Subject;
    };
}
interface Subject {
    subject: string;
    resources: Resource[];
}
interface Resource {
    identifier: string;
    projects: Project[];
    version: string;
    issued: string;
    modified: string;
    title: string;
    subject: string;
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
    static subject_h3: string;
    static chapters_h3: string;
    static res_type_desc: string;
    static res_li: string;
    static res_ul: string;
    static description: string;
    static size_span: string;
    testString: string;
    loadResult: string;
    languages: {
        [key: string]: Language;
    };
    constructor(urls: string[], callback?: Function);
    extractOBS(data: Object[]): void;
    buildDiv(callback?: Function): void;
    static getResources(subject: Subject): ResourceTypes;
    private static getUrlExt;
    private static getFormatFromFields;
    private static getDescription;
    private static getSize;
    private static getList;
}
