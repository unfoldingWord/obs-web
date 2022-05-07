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
    owners: Owner[];
}
interface Owner {
    name: string;
    entries: CatalogEntry[];
}
interface CatalogEntry {
    id: number;
    branch_or_tag_name: string;
    full_name: string;
    name: string;
    language: string;
    language_title: string;
    language_direction: string;
    metadata_url: string;
    owner: string;
    release: Release;
    subject: string;
    title: string;
}
interface Release {
    id: string;
    tag_name: string;
    assets: Asset[];
}
interface Asset {
    id: number;
    name: string;
    size: number;
    browser_download_url: string;
    download_count: number;
    created_at: Date;
}
declare class Format {
    name: string;
    ext: string;
    format: string;
    quality: string;
    prefix: string;
    version: string;
    asset: Asset;
    chapters: Chapter[];
}
declare class Chapter extends Format {
    identifier: string;
}
declare class DownloadableTypes {
    text: Format[];
    audio: Format[];
    video: Format[];
    other: Format[];
}
declare class OBS {
    static lang_h2: string;
    static owner_h3: string;
    static chapters_h3: string;
    static downloadable_type_desc: string;
    static downloadable_li: string;
    static downloadable_url: string;
    static description: string;
    static size_span: string;
    testString: string;
    loadResult: string;
    languages: {
        [key: string]: Language;
    };
    langnames: {
        [key: string]: any;
    };
    constructor(v5_url: string, callback?: Function);
    populateLangnames(): void;
    extractOBS(data: Object[]): void;
    static addLinkToDownloadableTypes(downloadable_types: DownloadableTypes, asset: Asset, version: string): DownloadableTypes;
    static addAssetToDownloadableTypes(downloadable_types: DownloadableTypes, asset: Asset, release_version: string): DownloadableTypes;
    buildDiv(callback?: Function): void;
    static getDownloadableTypes(entries: CatalogEntry[]): DownloadableTypes;
    private static getUrlExt;
    private static getFileExt;
    private static getFormatFromName;
    private static getDescription;
    private static getSize;
    private static getList;
}
