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
    size: number;
    url: string;
}
declare const lang_h2 = "<h2><strong>+ {0} ({1})</strong></h2>\n";
declare const res_type_desc = "<p><strong><em>{0}</em></strong></p>\n";
declare const res_li = "<li><a href=\"{0}\">{1}</a></li>\n";
declare class OBS {
    testString: string;
    loadResult: string;
    languages: Language[];
    constructor(url: string, callback?: Function);
    extractOBS(data: Catalog): void;
    buildDiv(): void;
}
