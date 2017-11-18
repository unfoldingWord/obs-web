/// <reference path="jquery.d.ts" />
declare class OBS {
    testString: string;
    loadResult: string;
    constructor(url: string, callback?: Function);
    extractOBS(data: any): void;
}
