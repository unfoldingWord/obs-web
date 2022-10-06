/// <reference path="strings.d.ts" />
interface Catalog {
    catalogs: any[];
    languages: Language[];
}
interface Language {
    language: string;
    title: string;
    direction: string;
    owners: {
        [key: string]: Owner;
    };
}
interface Owner {
    name: string;
    full_name: string;
    subjects: {
        [key: string]: Subject;
    };
}
interface Subject {
    subject: string;
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
    repo: Repository;
    release: Release;
    subject: string;
    title: string;
    zipball_url: string;
}
interface Repository {
    id: string;
    name: string;
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
    entry: CatalogEntry;
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
    static obs: OBS;
    static expandable_list_header: string;
    static chapters_h3: string;
    static downloadable_type_desc: string;
    static downloadable_li: string;
    static chapters_ul: string;
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
    downloads: {
        [key: string]: Format;
    };
    dcs_domain: string;
    tracker_domain: string;
    catalog_url: string;
    log_downloads_url: string;
    callback?: Function;
    constructor(dcs_domain: string, catalog_url: string, log_downloads_url: string, callback?: Function);
    populateLangnames(): void;
    populateCatalog(): void;
    extractOBS(data: Object[]): void;
    addLinkToDownloadableTypes(downloadable_types: DownloadableTypes, asset: Asset, entry: CatalogEntry): DownloadableTypes;
    addAssetToDownloadableTypes(downloadable_types: DownloadableTypes, asset: Asset, entry: CatalogEntry): DownloadableTypes;
    displayError(message: string): void;
    buildDiv(callback?: Function): void;
    getDownloadableTypes(entries: CatalogEntry[]): DownloadableTypes;
    private static getUrlExt;
    private static getFileExt;
    private static getFormatFromName;
    private static getDescription;
    private static getSize;
    private static getList;
}
declare function log_download(anchor: any): void;
