/// <reference path="d/strings.d.ts" />

interface Catalog {

    catalogs: any[];
    languages: Language[];
}

interface Language {

    language: string;   // language code
    title: string;      // localized language name
    direction: string;  // ltr or rtl
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

class ResourceTypes {

    text: Format[] = [];
    audio: Format[] = [];
    video: Format[] = [];
    other: Format[] = [];
}

class OBS {

    /**
     * {0} = language code
     * {1} = Localized language name
     * @type {string}
     */
    static lang_h2: string = '<h2 class="language-h2" data-lang-code="{0}"><strong>+ {0} ({1})</strong></h2>\n';

    static chapters_h2: string = '<h2 class="chapters-h2" style="display: inline-block; font-size: 1em; margin: 0">&ensp;<i class="fa fa-plus" aria-hidden="true" style="font-size: 1em"></i>&ensp;</h2>';

    /**
     * {0} = Resource type name (Text, Audio, Video)
     * @type {string}
     */
    static res_type_desc: string = '<p style="display: none"><strong><em>{0}</em></strong></p>\n';

    /**
     * {0} = Resource URL
     * {1} = Resource description
     * @type {string}
     */
    static res_li: string = '<li><a href=' + '"{0}" style="text-decoration: none;">{1}</a></li>\n';

    static res_ul: string = '<ul style="margin: 16px 0; display: none"></ul>';

    /**
     * {0} = font awesome class
     * {1} = description
     * @type {string}
     */
    static description: string = '<i class="fa {0}" aria-hidden="true"></i>&ensp;{1}';

    /**
     * {0} = size string, and zipped if applicable
     * @type {string}
     */
    static size_span = '&nbsp;<span style="color: #606060">({0})</span>';

    testString: string;
    loadResult: string;
    languages: Language[];

    /**
     * Class constructor
     * @param {string} url
     * @param {Function} callback An optional callback function, mainly for unit testing
     */
    constructor(url: string, callback?: Function) {

        // this is for unit testing
        if (url === 'test') {
            this.testString = 'Test success.';
            return;
        }

        // load the url now
        let me = this;
        $.ajax({
            url: url,
            dataType: 'json'
        }).done(function (data: Language[]) {

            me.extractOBS(data);
            me.loadResult = 'Successfully loaded catalog data.';

            console.log(me.loadResult);

            if (typeof callback !== 'undefined')
                callback(me.loadResult);

        }).fail(function (jqXHR, textStatus, errorThrown) {

            me.loadResult = 'Failed: status = "' + textStatus + '", message = "' + errorThrown + '".';

            console.log(me.loadResult);

            if (typeof callback !== 'undefined')
                callback(me.loadResult);
        });

    }

    /**
     * Extracts the languages with OBS resources from the catalog
     * @param data The catalog from https://api.door43.org/v3/subjects/Open_Bible_Stories.json
     */
    extractOBS(data: Language[]): void {

        // all languages in this file now have OBS resources
        this.languages = data;

        // sort the languages by id
        this.languages.sort(function (a: Language, b: Language) { return a.language.localeCompare(b.language); });
    }

    /**
     * Builds the language accordion and inserts it into the page
     * @param {Function} callback An optional callback function
     */
    buildDiv(callback?: Function): void {

        let $container = $('body').find('#published-languages');
        $container.empty();

        for (let i = 0; i < this.languages.length; i++) {

            let $div = $('<div></div>');
            let lang: Language = this.languages[i];

            if (lang.resources.length < 1) continue;

            $div.append(OBS.lang_h2.format(lang.language, lang.title));

            let res_types = OBS.getResources(lang);

            if (res_types.text.length > 0) {
                $div.append(OBS.res_type_desc.format('Text'));
                $div.append(OBS.getList(res_types.text));
            }

            if (res_types.audio.length > 0) {
                $div.append(OBS.res_type_desc.format('Audio'));
                $div.append(OBS.getList(res_types.audio));
            }

            if (res_types.video.length > 0) {
                $div.append(OBS.res_type_desc.format('Video'));
                $div.append(OBS.getList(res_types.video));
            }

            if (res_types.other.length > 0) {
                $div.append(OBS.res_type_desc.format('Other'));
                $div.append(OBS.getList(res_types.other));
            }

            $container.append($div);
        }

        // activate the accordion animation
        let $h2 = $container.find('h2');
        $h2.css('cursor', 'pointer');
        $h2.click(function () { $(this).nextUntil('h2').slideToggle(); });

        if (typeof callback !== 'undefined')
            callback();
    }

    static getResources(lang: Language): ResourceTypes {

        let res_types = new ResourceTypes();

        if (lang.resources.length < 1)
            return res_types;

        let res: Resource = lang.resources[0];
        for (let j = 0; j < res.projects.length; j++) {

            let proj: Project = res.projects[j];
            for (let k = 0; k < proj.formats.length; k++) {

                let fmt: Format = proj.formats[k];

                if (! fmt.format) {
                    fmt.format = OBS.getFormatFromFields(fmt);
                }

                // sort chapters
                if ('chapters' in fmt) {
                    fmt.chapters.sort(function (a: Chapter, b: Chapter) { return a.identifier.localeCompare(b.identifier); });
                }

                if (fmt.format.indexOf('audio') > -1) {
                    res_types.audio.push(fmt);
                }
                else if (fmt.format.indexOf('video') > -1) {
                    res_types.video.push(fmt);
                }
                else if (
                    fmt.format.indexOf('markdown') > -1 ||
                    fmt.format.indexOf('pdf') > -1 ||
                    fmt.format.indexOf('docx') > -1 ||
                    fmt.format.indexOf('odt') > -1 ||
                    fmt.format.indexOf('epub') > -1 ||
                    fmt.format.indexOf('door43') > -1
                ) {
                    res_types.text.push(fmt);
                }
                else if (
                    fmt.format.indexOf('youtube') > -1 ||
                    fmt.format.indexOf('bloom') > - 1
                ) {
                    res_types.other.push(fmt);
                }
                else {
                    res_types.other.push(fmt);
                }
            }
        }

        return res_types;
    }

    /**
     * Get the file extension of a URL (including if it has query params) without the preceeding dot
     * @param {string} url
     * @returns {string}
     */
    private static getUrlExt(url: string): string {
        return (url = url.substr(1 + url.lastIndexOf("/")).split('?')[0]).split('#')[0].substr(url.lastIndexOf(".")+1)
    }

    /**
     * Get the format from the Format fields, such based on the URL file extension or quality
     * @param {Fields} fmt 
     * @returns {string}
     */
    private static getFormatFromFields(fmt: Format): string {
        if (!fmt.url)
            return '';
        var ext = OBS.getUrlExt(fmt.url.toLowerCase());
        switch (ext) {
            case '3gp':
                return 'video/3gp';
            case 'html':
                return 'text/html';
            case 'md':
                return 'text/markdown';
            case 'mp3':
                return 'audio/mp3';
            case 'mp4':
                return 'video/mp4';
            case 'pdf':
                return 'application/pdf';
            case 'txt':
                return 'text/txt';
            case 'usfm':
                return 'text/usfm';
            case 'doc':
                return 'application/doc';
            case 'docx':
                return 'application/docx';
            case 'epub':
                return 'application/epub';
            case 'odt':
                return 'applicaiton/odt';
            case 'zip':
                if (fmt.quality) {
                    switch (fmt.quality.toLowerCase()) {
                        case '3gp':
                            return 'application/zip; content=video/3gp';
                        case 'mp4':
                            return 'application/zip; content=video/mp4';
                        case 'mp3':
                            return 'application/zip; content=audio/mp3';
                    }
                }
                return 'application/zip';
            default:
                if (fmt.url.toLowerCase().indexOf('door43.org/u/door43-catalog') > -1)
                    return 'door43';
                else if (fmt.url.toLowerCase().indexOf('youtube') > -1)
                    return 'youtube';
                else if (fmt.url.toLowerCase().indexOf('bloom') > -1)
                    return 'bloom';
                else if (ext)
                    return ext;
                else
                    return fmt.url.getHostName();
        }
    }

    /**
     * Gets a friendly description of the format
     * @param {Format|Chapter} fmt
     * @returns {string}
     */
    private static getDescription(fmt: Format | Chapter): string {

        let size_string = OBS.getSize(fmt.size);

        if (!fmt.format) {
            fmt.format = OBS.getFormatFromFields(fmt);
        }

        if (fmt.format.indexOf('application/pdf') > -1) {
            return '<i class="fa fa-file-pdf-o" aria-hidden="true"></i>&ensp;PDF&nbsp;<span style="color: #606060">(' + size_string + ')</span>';
        }
        else if (fmt.format === 'youtube') {
            return OBS.description.format('fa-youtube', 'YouTube');
        }
        else if (fmt.format === 'bloom') {
            return OBS.description.format('fa-book', 'Bloom Shell Book');
        }
        else if (fmt.format === 'door43') {
            return OBS.description.format('fa-globe', 'View on Door43.org');
        }

        let is_zipped = fmt.format.indexOf('application/zip') > -1;
        let fmt_description: string;
        let fmt_class: string;

        if (fmt.format.indexOf('docx') > -1) {
            fmt_description = 'Word Document';
            fmt_class = 'fa-file-word-o';
        }
        else if (fmt.format.indexOf('odt') > -1) {
            fmt_description = 'OpenDocument Text';
            fmt_class = 'fa-file-text-o';
        }
        else if (fmt.format.indexOf('epub') > -1) {
            fmt_description = 'ePub Book';
            fmt_class = 'fa-book';
        }
        else if (fmt.format.indexOf('markdown') > -1) {
            fmt_description = 'Markdown';
            fmt_class = 'fa-file-text-o';
        }
        else if (fmt.format.indexOf('html') > -1) {
            // we are skipping this one for now
            return null;

            // fmt_description = 'HTML';
            // fmt_class = 'fa-code';
        }
        else if (fmt.format.indexOf('usfm') > -1) {
            fmt_description = 'USFM';
            fmt_class = 'fa-file-text';
        }
        else if (fmt.format.indexOf('mp3') > -1) {
            fmt_description = 'MP3';
            fmt_class = 'fa-file-audio-o';
        }
        else if (fmt.format.indexOf('mp4') > -1) {
            fmt_description = 'MP4';
            fmt_class = 'fa-file-video-o';
        }
        else if (fmt.format.indexOf('3gp') > -1) {
            fmt_description = '3GP';
            fmt_class = 'fa-file-video-o';
        }
        else {
            fmt_description = fmt.format;
            fmt_class = 'fa-file-o';
        }

        if ('identifier' in fmt) {
            fmt_description = 'Chapter ' + parseInt((<Chapter>fmt).identifier).toLocaleString()
        }

        let return_val = OBS.description.format(fmt_class, fmt_description);

        if (fmt.quality) {
            return_val += '&nbsp;&ndash;&nbsp;' + fmt.quality;
        }

        if (is_zipped) {
            if (size_string) {
                return return_val + OBS.size_span.format(size_string + '&nbsp;zipped');
            }

            return return_val + OBS.size_span.format('zipped');
        }

        if (size_string) {
            return return_val + OBS.size_span.format(size_string);
        }

        return return_val;
    }

    private static getSize(file_size: number): string {

        if (file_size === 0) {
            return '';
        }

        if (file_size < 1000) {
            return file_size.toLocaleString() + ' Bytes';
        }

        let kb = file_size / 1024;
        if (kb < 1000) {
            return kb.toFixed(1).toLocaleString() + ' KB';
        }

        let mb = kb / 1024;
        if (mb < 1000) {
            return mb.toFixed(1).toLocaleString() + ' MB';
        }

        let gb = mb / 1024;
        if (gb < 1000) {
            return gb.toFixed(1).toLocaleString() + ' GB';
        }
    }

    private static getList(res_type: Format[]): JQuery {

        let $ul: JQuery = $(OBS.res_ul);

        for (let n = 0; n < res_type.length; n++) {

            let fmt: Format = res_type[n];

            let description = OBS.getDescription(fmt);
            if (description == null)
                continue;

            let $li = $(OBS.res_li.format(fmt.url, description));

            if (('chapters' in fmt) && (fmt.chapters.length > 0)) {
                $li.append(OBS.chapters_h2);

                let $chapter_ul: JQuery = $(OBS.res_ul);

                for (let m = 0; m < fmt.chapters.length; m++) {

                    let chap: Chapter = fmt.chapters[m];

                    let chap_description = OBS.getDescription(chap);
                    if (chap_description == null)
                        continue;

                    let $chap_li = $(OBS.res_li.format(chap.url, chap_description));
                    $chapter_ul.append($chap_li);
                }

                $li.append($chapter_ul);
            }

            $ul.append($li);
        }

        return $ul;
    }
}
