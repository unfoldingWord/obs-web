/// <reference path="jquery.d.ts" />
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
}
declare class OBS {
    testString: string;
    loadResult: string;
    languages: Language[];
    constructor(url: string, callback?: Function);
    extractOBS(data: Catalog): void;
}
