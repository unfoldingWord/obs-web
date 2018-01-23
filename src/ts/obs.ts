/// <reference path="d/jquery.d.ts" />
/// <reference path="d/strings.d.ts" />

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
    static lang_h2: string = '<h2 class="language-h2"><strong>+ {0} ({1})</strong></h2>\n';

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
    static res_li: string = '<li><a href=' + '"{0}">{1}</a></li>\n';

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
        }).done(function(data: Catalog) {

            if (!('languages' in data)) {
                me.loadResult = 'Error loading catalog - "Languages" element not found.';
            }
            else {
                me.loadResult = 'Successfully loaded catalog data.';

                me.extractOBS(data);
            }

            console.log(me.loadResult);

            if (typeof callback !== 'undefined')
                callback(me.loadResult);

        }).fail(function(jqXHR, textStatus, errorThrown) {

            me.loadResult = 'Failed: status = "' + textStatus + '", message = "' + errorThrown + '".';

            console.log(me.loadResult);

            if (typeof callback !== 'undefined')
                callback(me.loadResult);
        });

    }

    /**
     * Extracts the languages with OBS resources from the catalog
     * @param data The catalog from https://api.door43.org/v3/catalog.json
     */
    extractOBS(data: Catalog): void {

        // get languages that have OBS resources
        this.languages = data.languages.filter(function(lang: Language) {
            let found = lang.resources.filter(function(res: Resource) {
                return res.identifier === 'obs';
            });

            return found.length > 0;
        });

        // identify the OBS resources
        for (let i = 0; i < this.languages.length; i++) {
            let found = this.languages[i].resources.filter(function(res: Resource) {
                return res.identifier === 'obs';
            });

            this.languages[i].obs_resource = found[0];
        }

        // sort the languages by id
        this.languages.sort(function(a: Language, b: Language) { return a.identifier.localeCompare(b.identifier); });
    }

    /**
     * Builds the language accordion and inserts it into the page
     */
    buildDiv(): void {

        let $container = $('body').find('#published-languages');

        for (let i = 0; i < this.languages.length; i++) {

            let $div = $('<div></div>');
            let lang: Language = this.languages[i];

            if (!lang.obs_resource) continue;

            $div.append(OBS.lang_h2.format(lang.identifier, lang.title));

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
        $h2.css('cursor','pointer');
        $h2.click(function() {$(this).nextUntil('h2').slideToggle();});
    }

    static getResources(lang: Language): ResourceTypes {

        let res_types = new ResourceTypes();

        let res: Resource = lang.obs_resource;
        for (let j = 0; j < res.projects.length; j++) {

            let proj: Project = res.projects[j];
            for (let k = 0; k < proj.formats.length; k++) {

                let fmt: Format = proj.formats[k];

                // sort chapters
                if ('chapters' in fmt) {
                    fmt.chapters.sort(function(a: Chapter, b: Chapter) { return a.identifier.localeCompare(b.identifier); });
                }

                if (fmt.format.indexOf('audio') > -1) {
                    res_types.audio.push(fmt);
                }
                else if (fmt.format.indexOf('video') > -1) {
                    res_types.video.push(fmt);
                }
                else if (!fmt.format && (fmt.url.indexOf('https://door43.org/u/Door43-Catalog') > -1)) {
                    fmt.format = 'door43';
                    res_types.text.push(fmt);
                }
                else if (!fmt.format) {

                    // check for youtube link
                    if (fmt.url.indexOf('youtube') > -1) {
                        fmt.format = 'youtube';
                    }
                    // check for bloom link
                    else if (fmt.url.indexOf('bloom') > -1) {
                        fmt.format = 'bloom';
                    }
                    // just use the host name
                    else {
                        fmt.format = fmt.url.getHostName();
                    }

                    res_types.other.push(fmt);
                }
                else {
                    res_types.text.push(fmt);
                }
            }
        }

        return res_types;
    }

    /**
     * Gets a friendly description of the format
     * @param {Format|Chapter} fmt
     * @returns {string}
     */
    private static getDescription(fmt: Format | Chapter): string {

        let format_string = fmt.format;
        let size_string = OBS.getSize(fmt.size);

        if (format_string.indexOf('application/pdf') > -1) {
            return '<i class="fa fa-file-pdf-o" aria-hidden="true"></i>&ensp;PDF&nbsp;<span style="color: #606060">(' + size_string + ')</span>';
        }
        else if (format_string.indexOf('youtube') > -1) {
            return OBS.description.format('fa-youtube', 'YouTube');
        }
        else if (format_string.indexOf('bloom') > -1) {
            return OBS.description.format('fa-book', 'Bloom Shell Book');
        }
        else if (format_string.indexOf('door43') > -1) {
            return OBS.description.format('fa-globe', 'View on Door43.org');
        }

        let is_zipped = format_string.indexOf('application/zip') > -1;
        let fmt_description: string;
        let fmt_class: string;

        if (format_string.indexOf('text/markdown') > -1) {
            fmt_description = 'Markdown';
            fmt_class = 'fa-file-text-o';
        }
        else if (format_string.indexOf('text/html') > -1) {
            // we are skipping this one for now
            return null;

            // fmt_description = 'HTML';
            // fmt_class = 'fa-code';
        }
        else if (format_string.indexOf('text/usfm') > -1) {
            fmt_description = 'USFM';
            fmt_class = 'fa-file-text';
        }
        else if (format_string.indexOf('audio/mp3') > -1) {
            fmt_description = 'MP3';
            fmt_class = 'fa-file-audio-o';
        }
        else if (format_string.indexOf('video/mp4') > -1) {
            fmt_description = 'MP4';
            fmt_class = 'fa-file-video-o';
        }
        else {
            fmt_description = format_string;
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